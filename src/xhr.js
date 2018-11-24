
import is from 'whatitis';
import invariant from 'invariant';
import compose from './compose';
import convertor from './convertor';

// content-type 表示上传的数据格式
// get 没有 content-type
// post 表单数据 application/x-www-form-urlencoded
//      上传文件 不用设置 content-type
// responseType 是接受的数据格式

const MIMETYPES = {
  TEXT: '*/*',
  XML: 'text/xml',
  JSON: 'application/json',
  POST: 'application/x-www-form-urlencoded',
  DOCUMENT: 'text/html'
};

const ACCEPT = {
  TEXT: '*/*',
  XML: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
  JSON: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
};


function hasHeader( name_ ) {
  return function( headers ) {
    return Object.keys( headers ).some( name => name.toLowerCase() === name_.toLowerCase());
  };
}

function hasAccept( headers ) {
  return hasHeader( 'accept' )( headers );
}

function hasContentType( headers ) {
  return hasHeader( 'content-type' )( headers );
}

function encode( value ) {
  return encodeURIComponent( value );
}

function getQueryString( object ) {
  return Object.keys( object ).reduce(( acc, item ) => {
    const prefix = !acc ? '' : `${acc}&`;
    return `${prefix + encode( item )}=${encode( object[item])}`;
  }, '' );
}

function objectToQueryString( data ) {
  return is.PlainObject( data ) ? getQueryString( data ) : data;
}

function setHeaders( xhr, { headers, dataType, method }) {

  const TYPE = dataType.toUpperCase();

  if ( !hasAccept( headers )) {
    headers.Accept = ACCEPT[TYPE] || ACCEPT.TEXT;
  }

  if ( !hasContentType( headers ) && method !== 'get' ) {
    headers['Content-Type'] = MIMETYPES.POST;
  }

  Object.keys( headers ).forEach( name => {
    if ( headers[name]) {
      xhr.setRequestHeader( name, headers[name]);
    }
  });
}

function getDataType( xhr ) {
  const ct = xhr.getResponseHeader( 'Content-Type' );
  if ( ct.indexOf( MIMETYPES.JSON ) > -1 ) {
    return 'json';
  } else if ( ct.indexOf( MIMETYPES.XML ) > -1 ) {
    return 'xml';
  }
  return 'text';
}

function convertors( dataType ) {
  return function( xhr, convertor ) {
    if ( dataType ) {
      return convertor( dataType, xhr.response );
    }
    return convertor( getDataType( xhr ), xhr.response );
  };
}

function parseResponse( xhr, ctors, codePass ) {

  let success = codePass;
  let result = null;
  let error = null;

  if (
    typeof xhr.response === 'undefined' && (
    typeof xhr.responseType === 'undefined' ||
    xhr.responseType === '' ||
    xhr.responseType === 'text' )
  ) {
    xhr.response = xhr.responseText;
  }

  if ( codePass ) {
    try {
      if ( is.Function( ctors )) {
        result = ctors( xhr, convertor );
      } else if ( xhr.response === null ) {
        success = false;
        error = 'parseerror';
      } else {
        result = xhr.response;
      }
    } catch ( e ) {
      success = false;
      error = 'parseerror';
    }
  } else {
    error = xhr.statusText;
  }
  return {
    success, result, error
  };
}

function ready( xhr2, xdr, ctors, timeout, xhr ) {
  return function handleReady( appendMethods ) {
      // 0 - (未初始化)还没有调用send()方法
      // 1 - (载入)已调用send()方法，正在发送请求
      // 2 - (载入完成)send()方法执行完成，
      // 3 - (交互)正在解析响应内容
      // 4 - (完成)响应内容解析完成，可以在客户端调用了
    if ( xhr.readyState === xhr.DONE ) {
      if ( timeout ) {
        clearTimeout( timeout );
      }
      if ( xhr2 || xdr ) {
        xhr.onload = null;
        xhr.onerror = null;
      } else if ( xhr.removeEventListener ) {
        xhr.removeEventListener( 'readystatechange', handleReady, false );
      } else {
        xhr.onreadystatechange = null;
      }
      const codePass = ( xhr.status >= 200 && xhr.status < 300 ) || xhr.status === 304;
      const { success, result, error } = parseResponse( xhr, ctors, codePass );

      if ( success ) {
        if ( appendMethods.then ) {
          appendMethods.then( result, xhr );
        }
      } else if ( appendMethods.catch ) {
        appendMethods.catch( error, xhr );
      }
      if ( appendMethods.finally ) {
        appendMethods.finally( error, result, xhr );
      }
    }
  };
}


function handleTimeout( xhr, ontimeout ) {
  return function() {
    if ( !xhr.aborted ) {
      xhr.abort();
      if ( ontimeout ) {
        ontimeout( xhr );
      }
    }
  };
}


let getXhr;

try {
  // test window
  if ( is.Undefined( window )) {
    throw Error( 'Hope: Ajax only for browser environment.' );
  }
  getXhr = window.XMLHttpRequest
    ? () => new window.XMLHttpRequest()
    : () => new window.ActiveXObject( 'Microsoft.XMLHTTP' );
} catch ( e ) {
  // server-side
  getXhr = () => {};
}

function fixXhr( xhr_, options ) {

  let xhr;
  let xdr = false;
  const xhr2 = xhr_.responseType === '';

  if ( options.crossOrigin ) {
    if ( !xhr2 && window.XDomainRequest ) {
      xhr = new window.XDomainRequest(); // CORS with IE8/9
      xdr = true;
      if ( options.method !== 'get' && options.method !== 'post' ) {
        options.method = 'post';
      }
      return [ xhr, xdr, xhr2 ];
    }
    throw Error( 'Hope: CrossOrigin is not support.' );
  }
  return [ xhr_, xdr, xhr2 ];
}


function xhrConnection( method, url, data, options ) {

  let nativeParsing;
  let queryString = '';
  const appendMethods = {};
  const returnMethods = [ 'then', 'catch', 'finally' ];
  const promiseMethods = returnMethods.reduce(( promise, method ) => {
    // eslint-disable-next-line
    promise[method] = function ( callback ) {
      const old = appendMethods[method];
      appendMethods[method] = old ? compose( callback, old ) : callback;
      return promise;
    };
    return promise;
  }, {});

  const [ xhr, xdr, xhr2 ] = fixXhr( getXhr(), options );

  if ( method === 'get' && data ) {
    queryString = `?${objectToQueryString( data )}`;
  }

  if ( xdr ) {
    xhr.open( method, url + queryString );
  } else {
    xhr.open( method, url + queryString, options.async, options.user, options.password );
  }

  // withCredentials cross domain
  if ( xhr2 ) {
    xhr.withCredentials = !!( options.async || options.withCredentials );
  }

  // headers
  if ( 'setRequestHeader' in xhr ) {
    setHeaders( xhr, options );
  }

  // timeout
  let timeout;
  let handleOntimeout;
  const ontimeout = () => {
    xhr.statusText_ = 'timeout';
    ( options.ontimeout || handleOntimeout )();
  };
  if ( options.async ) {
    if ( xhr2 ) {
      xhr.timeout = options.timeout;
      xhr.ontimeout = ontimeout;
    } else {
      timeout = setTimeout( handleTimeout( xhr, ontimeout ), options.timeout );
    }
  } else if ( xdr ) {
    xhr.ontimeout = function() {};
  }

  if ( xhr2 ) {
    try {
      xhr.responseType = options.dataType;
      nativeParsing = xhr2 && ( xhr.responseType === options.dataType );
    } catch ( e ) {} // eslint-disable-line
  } else if ( 'overrideMimeType' in xhr ) {
    xhr.overrideMimeType( MIMETYPES[options.dataType.toUpperCase()]);
  }

  const ctors = nativeParsing || convertors( options.dataType );
  const handleResponse = () => ready(
    xhr2, xdr, ctors, timeout, xhr
  )( appendMethods );
  handleOntimeout = handleResponse;

  if ( xhr2 || xdr ) {
    xhr.onload = handleResponse;
    xhr.onerror = handleResponse;
    xhr.onabort = handleResponse;
    // http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
    if ( xdr ) {
      xhr.onprogress = function() {};
    }
  } else if ( xhr.addEventListener ) {
    xhr.addEventListener( 'readystatechange', handleResponse, false );
  } else {
    xhr.onreadystatechange = handleResponse;
  }

  xhr.send( method !== 'get' ? objectToQueryString( data ) : null );
  promiseMethods.abort = function() {
    if ( !xhr.aborted ) {
      if ( timeout ) {
        clearTimeout( timeout );
      }
      xhr.aborted = true;
      xhr.abort();
    }
  };
  return promiseMethods;
}


/**
 * option {
 *   method: string,
 *   headers: object
 *   timeout: number
 *   ontimeout: function
 *   baseUrl: string,
 *   data: object,
 *   url: string,
 *   withCredentials: boolean
 *   crossDomain: boolean,
 *   // async: boolean,
 *   user: string,
 *   password: string,
 *   dataType: string,
 *   cache: string
 * }
 */


const defaultOption = {
  method: 'get',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  timeout: 10 * 1000,
  ontimeout: null,
  baseUrl: '',
  data: null,
  url: '',
  withCredentials: false,
  crossDomain: false,
  // async: true,
  user: '',
  password: '',
  dataType: 'json',
  cache: false
};

function getOption({
  method,
  headers,
  timeout,
  ontimeout,
  baseUrl,
  data,
  url,
  withCredentials,
  crossDomain,
  user,
  password,
  dataType,
  cache
}) {

  const options = Object.assign({}, defaultOption );
  options.headers = Object.assign({}, options.headers );

  if ( is.String( method ) && method ) {
    options.method = method;
  }

  if ( is.PlainObject( headers )) {
    Object.assign( options.headers, headers );
  }

  if ( is.Number( timeout ) && isFinite( timeout )) {
    options.timeout = Math.max( 0, timeout );
  }

  if ( is.Function( ontimeout )) {
    options.ontimeout = ontimeout;
  }

  if ( is.String( baseUrl ) && baseUrl ) {
    options.baseUrl = baseUrl;
  }

  if ( data ) {
    options.data = is.PlainObject( data ) ? Object.assign({}, data ) : data;
  }

  if ( is.String( url ) && url ) {
    options.url = url;
  }

  options.withCredentials = !!withCredentials;

  options.crossDomain = !!crossDomain;
  if ( !options.crossDomain && options.headers['X-Requested-With'] === 'XMLHttpRequest' ) {
    delete options.headers['X-Requested-With'];
  }

  if ( is.String( user ) && user ) {
    options.user = user;
    if ( is.String( password )) {
      options.password = password;
    }
  }

  if ( Object.keys( MIMETYPES ).includes( dataType.toUpperCase())) {
    options.dataType = dataType;
  }

  // "arraybuffer", "blob", "document", "json", or "text"
  if ( 'ArrayBuffer' in window && data instanceof ArrayBuffer ) {
    options.dataType = 'arraybuffer';
  } else if ( 'Blob' in window && data instanceof Blob ) {
    options.dataType = 'blob';
  } else if ( 'Document' in window && data instanceof Document ) {
    options.dataType = 'document';
  } else if ( 'FormData' in window && data instanceof FormData ) {
    options.dataType = 'json';
  }

  if ( is.Object( headers )) {
    const cacheControl = headers['Cache-Control'];
    if ( !cache && !is.String( cacheControl ) && cacheControl ) {
      options.headers['Cache-Control'] = 'no-cache';
    }
  }

  options.async = true;

  invariant(
    options.url || options.baseUrl,
    'Hope: One of Url and BaseUrl must be a non-empty string.'
  );

  return options;
}


function ajax( options ) {
  return xhrConnection(
    options.method,
    options.baseUrl + options.url,
    options.data,
    options
  );
}

export default compose( ajax, getOption );

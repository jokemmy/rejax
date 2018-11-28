

import qs from 'qs';
import is from 'whatitis';
import invariant from 'invariant';
import buildURL from './buildURL';
import compose from './compose';
// import convertor from './convertor';

// POST 的四种数据格式 content-type
// text/xml
// application/json
// application/x-www-form-urlencoded 发送表单数据
// multipart/form-data 不用手动设置直接发送带有文件的FormData就会被浏览器自动设置

// content-type 表示上传的数据格式
// get 不用设置 content-type
// post 表单数据 application/x-www-form-urlencoded
//      上传文件 不用设置 content-type
// responseType 是接受的数据格式 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'

const ContentType = {
  XML: 'text/xml; charset=utf-8',
  TEXT: 'text/plain; charset=utf-8',
  JSON: 'application/json; charset=utf-8',
  FORMDATA: 'application/x-www-form-urlencoded;charset=utf-8'
};

// const charset = 'charset=utf-8';

// 一般不用手动设置
const ACCEPT = {
  '*': '*/*',
  HTML: 'text/html; q=1.0, text/*; q=0.8, */*; q=0.1',
  TEXT: 'text/plain; q=1.0, text/*; q=0.8, */*; q=0.1',
  XML: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
  JSON: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1',
  SCRIPT: 'application/javascript; q=1.0, text/javascript; q=1.0, application/ecmascript; q=0.8, application/x-ecmascript; q=0.8, */*; q=0.1',
  DEFAULT: 'application/json; q=1.0, text/plain; q=0.8, */*; q=0.1'
};


// accept-language: zh-CN,zh;q=0.9,en;q=0.8
// referer: https://www.jianshu.com/p/df889c2b9988
// accept-encoding: gzip, deflate, br
// Accept: text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01
// Accept-Encoding: gzip, deflate, br
// Accept-Language: zh-CN,zh;q=0.9,en;q=0.8

function hasHeader( name ) {
  return function( headers ) {
    return Object.keys( headers ).some( key => key.toLowerCase() === name.toLowerCase());
  };
}

function hasAccept( headers ) {
  return hasHeader( 'accept' )( headers );
}

function hasContentType( headers ) {
  return hasHeader( 'content-type' )( headers );
}

// function encode( value ) {
//   return encodeURIComponent( value );
// }

// function getQueryString( object ) {
//   return Object.keys( object ).reduce(( qs, item ) => {
//     return `${( qs || `${qs}&` ) + encode( item )}=${encode( object[item])}`;
//   }, '' );
// }

// function objectToQueryString( data ) {
//   return is.PlainObject( data ) ? getQueryString( data ) : data;
// }

function setHeaders( xhr, { headers, dataType, contentType, method }) {

  if ( !hasAccept( headers )) {
    headers.Accept = ACCEPT[dataType.toUpperCase()];
  }

  if ( !hasContentType( headers ) && method !== 'get' ) {
    headers['Content-Type'] = ContentType[contentType.toUpperCase()];
  }

  Object.keys( headers ).forEach( name => {
    if ( headers[name]) {
      xhr.setRequestHeader( name, headers[name]);
    }
  });
}

// function getDataType( xhr ) {
//   const ct = xhr.getResponseHeader( 'Content-Type' );
//   if ( ct.indexOf( ContentType.JSON ) > -1 ) {
//     return 'json';
//   } else if ( ct.indexOf( ContentType.XML ) > -1 ) {
//     return 'xml';
//   }
//   return 'text';
// }

// arrayBuffur blob stream IE9 不支持
function convertors({ dataType, responseType }) {
  // '*', 'xml', 'html', --'script'--
  return function( xhr/*, convertor*/ ) {
    if ( dataType === 'default' ) {
      return xhr.response || xhr.responseText;
    } else if ( dataType === '*' ) {
      // arrayBuffur blob stream | *
      return responseType ? xhr.response : xhr.responseText;
    } else if ([ 'xml', 'html' ].includes( dataType )) { // responseType === document
      return xhr.responseXML || xhr.response;
    } else if ([ 'json', 'text' ].includes( dataType )) {
      return xhr.response || xhr.responseText;
    }
    return xhr.response;
  };
}

function validateResponse( xhr, ctors, validateStatus ) {

  let success = validateStatus( xhr.status );
  let result = null;
  let error = null;

  // 把结果都放在 response 上
  if ( !xhr.response && ( !xhr.responseType || xhr.responseType === 'text' )) {
    xhr.response = xhr.responseText;
  }

  if ( success ) {
    try {
      result = ctors( xhr );
      if ( result === null ) {
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

function ready( xhr2, xdr, timeout, xhr, options ) {
  return function handleReady( appendMethods ) {
      // 0 - (未初始化)还没有调用send()方法
      // 1 - (载入)已调用send()方法，正在发送请求
      // 2 - (载入完成)send()方法执行完成，
      // 3 - (交互)正在解析响应内容
      // 4 - (完成)响应内容解析完成，可以在客户端调用了
    if ( xhr.readyState === 4 ) {
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
      const { success, result, error } = validateResponse( xhr, convertors( options ), options.validateStatus );

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
  // if ( is.Undefined( window )) {
  //   throw Error( 'Hope: Ajax only for browser environment.' );
  // }
  getXhr = window.XMLHttpRequest
    ? () => new window.XMLHttpRequest()
    : () => new window.ActiveXObject( 'Microsoft.XMLHTTP' );
} catch ( e ) {
  // server-side
  getXhr = () => {};
}

// XDomainRequest 是 IE8 9 上的跨域实现
function fixXhr( xhr_, options ) {

  let xhr;
  let xdr = false;
  const xhr2 = xhr_.responseType === '';

  if ( options.crossOrigin ) {
    if ( !xhr2 && window.XDomainRequest ) {
      xhr = new window.XDomainRequest(); // CORS with IE8/9
      xdr = true;
      options.method = options.data ? 'post' : 'get';
      return { xhr, xdr, xhr2 };
    }
    throw Error( 'CrossOrigin is not support.' );
  }
  return { xhr: xhr_, xdr, xhr2 };
}


function connection( method, url, data, options ) {

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

  let { xhr, xdr, xhr2 } = fixXhr( getXhr(), options );

  // if ( method === 'get' && data ) {
  //   queryString = `?${objectToQueryString( data )}`;
  // }

  if ( xdr ) {
    xhr.open( method.toUpperCase(), buildURL( url, data, options.paramsSerializer ));
  } else {
    xhr.open( method.toUpperCase(), buildURL( url, data, options.paramsSerializer ), options.async, options.user, options.password );
  }

  // withCredentials crossdomain
  // 当xhr为同步请求时，有如下限制：
  // xhr.timeout必须为0
  // xhr.withCredentials必须为 false
  // xhr.responseType必须为""（注意置为"text"也不允许）
  if ( xhr2 ) {
    xhr.withCredentials = options.withCredentials;
  }

  // headers
  // setRequestHeader必须在open()方法之后，send()方法之前调用，否则会抛错
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
  if ( xhr2 ) {
    xhr.timeout = options.timeout;
    xhr.ontimeout = ontimeout;
  } else {
    timeout = setTimeout( handleTimeout( xhr, ontimeout ), options.timeout );
  }

  if ( xhr2 ) {
    try {
      if ( options.responseType ) {
        xhr.responseType = options.responseType;
      }
    } catch ( e ) { /* Ignore */ }
  } else if ( 'overrideMimeType' in xhr ) {
    xhr.overrideMimeType( ContentType[options.contentType.toUpperCase()]);
  }

  // '*', 'xml', 'html', 'script'
  // const ctors = convertors( options );
  const handleResponse = () => ready(
    xhr2, xdr, timeout, xhr, options
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

  if ( xhr2 ) {
    xhr.addEventListener( 'progress', options.onDownloadProgress );
    if ( xhr2 && xhr.upload ) {
      xhr.upload.addEventListener( 'progress', options.onUploadProgress );
    }
  }

  xhr.send( is.Defined( data ) ? options.paramsSerializer( data ) : null );
  promiseMethods.abort = function() {
    if ( !xhr.aborted ) {
      if ( timeout ) {
        clearTimeout( timeout );
      }
      xhr.aborted = true;
      xhr.abort();
    }
  };

  if ( options.signal ) {
    options.signal.onabort = () => {
      promiseMethods.abort();
    };
    xhr = null;
  }

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
 *   user: string,
 *   password: string,
 *   dataType: string,
 *   responseType: string,
 *   cache: string,
 *   contentType: string
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
  user: '',
  password: '',
  dataType: 'default', // '*' 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
                    // xml html --script--
                    // domstring 同 text
  contentType: '',
  // responseType;
  cache: 'default', // default 不设置头信息
                    // no-store 、 reload 、 no-cache 、 force-cache 或者 only-if-cached
  signal: null,
  validateStatus( status ) {
    return status >= 200 && status < 300; // default
  },
  transformResponse: [( data, headers_ ) => {
    return data;
  }],
  transformRequest: [( data ) => {
    return data;
  }],
  paramsSerializer( params ) {
    return qs.stringify( params, { arrayFormat: 'brackets' });
  },
  onUploadProgress( progressEvent ) {
    // Do whatever you want with the native progress event
  },
  onDownloadProgress( progressEvent ) {
    // Do whatever you want with the native progress event
  }
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
  dataType, // 类似 responseType, 相同优先 responseType
  contentType,
  cache,
  signal,
  validateStatus,
  transformResponse,
  transformRequest,
  paramsSerializer,
  onUploadProgress,
  onDownloadProgress
}) {

  const options = Object.assign({}, defaultOption );
  options.headers = Object.assign({}, options.headers );

  if ( is.String( method ) && method ) {
    options.method = method.toLowerCase();
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

  if ( is.String( url ) && url ) {
    options.url = url;
  }

  // 跨域带cookie
  options.withCredentials = !!withCredentials;

  // 跨域
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

  // 设置 accept
  if ( !is.String( dataType )) {
    // options.dataType = '';
  } else if ([ '*', 'xml', 'json', 'text', 'html'/*, 'script'*/ ].includes( dataType.toLowerCase())) {
    options.dataType = dataType;
  } else if ( dataType.toLowerCase() === 'document' ) {
    options.dataType = 'html';
  } else if ([ 'arraybuffer', 'blob', 'stream' ].includes( dataType.toLowerCase())) {
    options.dataType = '*';
  }

  // 设置接收数据的格式
  // arraybuffer blob document stream 返回值可能需要相应的处理
  // json 将字符串自动转换成对象 xhr2不用手动转换
  // text 不处理接受的数据
  if ( !is.String( dataType )) {
    // options.responseType = dataType;
  } else if ([ 'xml', 'html' ].includes( dataType.toLowerCase())) {
    options.responseType = 'document';
  } else if ([ 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream' ].includes( dataType.toLowerCase())) {
    options.responseType = dataType;
  }

  // 设置 content-type
  // formdata xml text 不处理数据, data 应该是字符串或 formdata 对象
  // json 转换成字符串发送, data 是普通对象
  // 如果data是 Document 类型，同时也是HTML Document类型，则content-type默认值为text/html;charset=UTF-8;否则为application/xml;charset=UTF-8；
  // 如果data是 DOMString 类型，content-type默认值为text/plain;charset=UTF-8；
  // 如果data是 FormData 类型，content-type默认值为multipart/form-data; boundary=[xxx]
  if ( options.method !== 'get' && [ 'xml', 'json', 'text', 'formdata' ].includes( contentType.toLowerCase())) {
    options.contentType = contentType;
  }

  // 如果是PlainObject就浅克隆
  if ( data ) {
    // options.data = is.PlainObject( data ) ? Object.assign({}, data ) : data;
    options.data = data;
  }

  if ( is.Object( headers )) {
    // 使用no-cache的目的就是为了防止从缓存中获取过期的资源
    // const pragma = headers['Pragma']; // HTTP1.0-1.1
    // const cacheControl = headers['Cache-Control']; // HTTP1.1
    // if ( !cache && !is.String( cacheControl ) && cacheControl ) {
    //   options.headers['Cache-Control'] = 'no-cache';
    //   options.headers['Pragma'] = 'no-cache';
    // }
    if ( cache && cache !== 'default' ) {
      options.headers['Cache-Control'] = cache;
      // 为了兼容 HTTP1.0
      if ( cache === 'no-cache' ) {
        options.headers['Pragma'] = 'no-cache';
      }
    }
    options.cache = cache || options.cache;
  }

  // 只考虑异步情况
  options.async = true;

  if ( signal ) {
    options.signal = signal;
  }

  if ( is.Function( validateStatus )) {
    options.validateStatus = validateStatus;
  }

  if ( is.Array( transformResponse )) {
    options.transformResponse = transformResponse;
  }

  if ( is.Array( transformRequest )) {
    options.transformRequest = transformRequest;
  }

  if ( is.Function( paramsSerializer )) {
    options.paramsSerializer = paramsSerializer;
  }

  if ( is.Function( onUploadProgress )) {
    options.onUploadProgress = onUploadProgress;
  }

  if ( is.Function( onDownloadProgress )) {
    options.onDownloadProgress = onDownloadProgress;
  }

  invariant(
    options.url || options.baseUrl,
    'Url or BaseUrl must be a non-empty string.'
  );

  return options;
}


function ajax( options ) {
  return connection(
    options.method,
    options.baseUrl + options.url,
    options.data,
    options
  );
}

export default compose( ajax, getOption );

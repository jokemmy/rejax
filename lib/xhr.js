'use strict';

exports.__esModule = true;

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _whatitis = require('whatitis');

var _whatitis2 = _interopRequireDefault(_whatitis);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _buildURL = require('./buildURL');

var _buildURL2 = _interopRequireDefault(_buildURL);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var ContentType = {
  XML: 'text/xml; charset=utf-8',
  TEXT: 'text/plain; charset=utf-8',
  JSON: 'application/json; charset=utf-8',
  FORMDATA: 'application/x-www-form-urlencoded;charset=utf-8'
};

// const charset = 'charset=utf-8';

// 一般不用手动设置
var ACCEPT = {
  '*': '*/*',
  HTML: 'text/html; q=1.0, text/*; q=0.8, */*; q=0.1',
  TEXT: 'text/plain; q=1.0, text/*; q=0.8, */*; q=0.1',
  XML: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
  JSON: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1',
  // SCRIPT: 'application/javascript; q=1.0, text/javascript; q=1.0, application/ecmascript; q=0.8, application/x-ecmascript; q=0.8, */*; q=0.1',
  DEFAULT: 'application/json; q=1.0, text/plain; q=0.8, */*; q=0.1'
};

// accept-language: zh-CN,zh;q=0.9,en;q=0.8
// referer: https://www.jianshu.com/p/df889c2b9988
// accept-encoding: gzip, deflate, br
// Accept: text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01
// Accept-Encoding: gzip, deflate, br
// Accept-Language: zh-CN,zh;q=0.9,en;q=0.8

function hasHeader(name) {
  return function (headers) {
    return Object.keys(headers).some(function (key) {
      return key.toLowerCase() === name.toLowerCase();
    });
  };
}

function hasAccept(headers) {
  return hasHeader('accept')(headers);
}

function hasContentType(headers) {
  return hasHeader('content-type')(headers);
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

function setHeaders(xhr, _ref) {
  var headers = _ref.headers,
      dataType = _ref.dataType,
      contentType = _ref.contentType,
      method = _ref.method;


  if (!hasAccept(headers)) {
    headers.Accept = ACCEPT[dataType.toUpperCase()];
  }

  if (!hasContentType(headers) && method !== 'get') {
    headers['Content-Type'] = ContentType[contentType.toUpperCase()];
  }

  Object.keys(headers).forEach(function (name) {
    if (headers[name]) {
      xhr.setRequestHeader(name, headers[name]);
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
function convertors(_ref2) {
  var dataType = _ref2.dataType,
      responseType = _ref2.responseType;

  // '*', 'xml', 'html', --'script'--
  return function (xhr /*, convertor*/) {
    if (dataType === 'default') {
      return xhr.response || xhr.responseText;
    } else if (dataType === '*') {
      // arrayBuffur blob stream | *
      return responseType ? xhr.response : xhr.responseText;
    } else if (['xml', 'html'].includes(dataType)) {
      // responseType === document
      return xhr.responseXML || xhr.response;
    } else if (['json', 'text'].includes(dataType)) {
      return xhr.response || xhr.responseText;
    }
    return xhr.response;
  };
}

function validateResponse(xhr, ctors, validateStatus) {

  var success = validateStatus(xhr.status);
  var result = null;
  var error = null;

  // 把结果都放在 response 上
  if (!xhr.response && (!xhr.responseType || xhr.responseType === 'text')) {
    xhr.response = xhr.responseText;
  }

  if (success) {
    try {
      result = ctors(xhr);
      if (result === null) {
        success = false;
        error = 'parseerror';
      } else {
        result = xhr.response;
      }
    } catch (e) {
      success = false;
      error = 'parseerror';
    }
  } else {
    error = xhr.statusText;
  }
  return {
    success: success, result: result, error: error
  };
}

function ready(xhr2, xdr, timeout, xhr, options) {
  return function handleReady(appendMethods) {
    // 0 - (未初始化)还没有调用send()方法
    // 1 - (载入)已调用send()方法，正在发送请求
    // 2 - (载入完成)send()方法执行完成，
    // 3 - (交互)正在解析响应内容
    // 4 - (完成)响应内容解析完成，可以在客户端调用了
    if (xhr.readyState === 4) {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (xhr2 || xdr) {
        xhr.onload = null;
        xhr.onerror = null;
      } else if (xhr.removeEventListener) {
        xhr.removeEventListener('readystatechange', handleReady, false);
      } else {
        xhr.onreadystatechange = null;
      }

      var _validateResponse = validateResponse(xhr, convertors(options), options.validateStatus),
          success = _validateResponse.success,
          result = _validateResponse.result,
          error = _validateResponse.error;

      if (success) {
        if (appendMethods.then) {
          appendMethods.then(result, xhr);
        }
      } else if (appendMethods['catch']) {
        appendMethods['catch'](error, xhr);
      }
      if (appendMethods['finally']) {
        appendMethods['finally'](error, result, xhr);
      }
    }
  };
}

function handleTimeout(xhr, ontimeout) {
  return function () {
    if (!xhr.aborted) {
      xhr.abort();
      if (ontimeout) {
        ontimeout(xhr);
      }
    }
  };
}

var getXhr = void 0;

try {
  // test window
  // if ( is.Undefined( window )) {
  //   throw Error( 'Hope: Ajax only for browser environment.' );
  // }
  getXhr = window.XMLHttpRequest ? function () {
    return new window.XMLHttpRequest();
  } : function () {
    return new window.ActiveXObject('Microsoft.XMLHTTP');
  };
} catch (e) {
  // server-side
  getXhr = function getXhr() {};
}

// XDomainRequest 是 IE8 9 上的跨域实现
function fixXhr(xhr_, options) {

  var xhr = void 0;
  var xdr = false;
  var xhr2 = xhr_.responseType === '';

  if (options.crossOrigin) {
    if (!xhr2 && window.XDomainRequest) {
      xhr = new window.XDomainRequest(); // CORS with IE8/9
      xdr = true;
      options.method = options.data ? 'post' : 'get';
      return { xhr: xhr, xdr: xdr, xhr2: xhr2 };
    }
    throw Error('CrossOrigin is not support.');
  }
  return { xhr: xhr_, xdr: xdr, xhr2: xhr2 };
}

function connection(method, url, data, options) {

  var appendMethods = {};
  var returnMethods = ['then', 'catch', 'finally'];
  var promiseMethods = returnMethods.reduce(function (promise, method) {
    // eslint-disable-next-line
    promise[method] = function (callback) {
      var old = appendMethods[method];
      appendMethods[method] = old ? (0, _compose2['default'])(callback, old) : callback;
      return promise;
    };
    return promise;
  }, {});

  var _fixXhr = fixXhr(getXhr(), options),
      xhr = _fixXhr.xhr,
      xdr = _fixXhr.xdr,
      xhr2 = _fixXhr.xhr2;

  // if ( method === 'get' && data ) {
  //   queryString = `?${objectToQueryString( data )}`;
  // }


  var reqURL = method === 'get' ? (0, _buildURL2['default'])(url, data, options.paramsSerializer) : url;

  if (xdr) {
    xhr.open(method.toUpperCase(), reqURL);
  } else {
    xhr.open(method.toUpperCase(), reqURL, options.async, options.user, options.password);
  }

  // withCredentials crossdomain
  // 当xhr为同步请求时，有如下限制：
  // xhr.timeout必须为0
  // xhr.withCredentials必须为 false
  // xhr.responseType必须为""（注意置为"text"也不允许）
  if (xhr2) {
    xhr.withCredentials = options.withCredentials;
  }

  // headers
  // setRequestHeader必须在open()方法之后，send()方法之前调用，否则会抛错
  if ('setRequestHeader' in xhr) {
    setHeaders(xhr, options);
  }

  // timeout
  var timeout = void 0;
  var handleOntimeout = void 0;
  var ontimeout = function ontimeout() {
    xhr.statusText_ = 'timeout';
    (options.ontimeout || handleOntimeout)();
  };
  if (xhr2) {
    xhr.timeout = options.timeout;
    xhr.ontimeout = ontimeout;
  } else {
    timeout = setTimeout(handleTimeout(xhr, ontimeout), options.timeout);
  }

  if (xhr2) {
    try {
      if (options.responseType) {
        xhr.responseType = options.responseType;
      }
    } catch (e) {/* Ignore */}
  } else if ('overrideMimeType' in xhr) {
    xhr.overrideMimeType(ContentType[options.contentType.toUpperCase()]);
  }

  // '*', 'xml', 'html', 'script'
  // const ctors = convertors( options );
  var handleResponse = function handleResponse() {
    return ready(xhr2, xdr, timeout, xhr, options)(appendMethods);
  };
  handleOntimeout = handleResponse;

  if (xhr2 || xdr) {
    xhr.onload = handleResponse;
    xhr.onerror = handleResponse;
    xhr.onabort = handleResponse;
    // http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
    if (xdr) {
      xhr.onprogress = function () {};
    }
  } else if (xhr.addEventListener) {
    xhr.addEventListener('readystatechange', handleResponse, false);
  } else {
    xhr.onreadystatechange = handleResponse;
  }

  if (xhr2) {
    xhr.addEventListener('progress', options.onDownloadProgress);
    if (xhr2 && xhr.upload) {
      xhr.upload.addEventListener('progress', options.onUploadProgress);
    }
  }

  if (options.contentType === 'formdata' && _whatitis2['default'].PlainObject(data)) {
    xhr.send(options.paramsSerializer(data));
  } else if (options.contentType === 'formdata') {
    xhr.send(data || null);
  } else if (options.contentType === 'json' && _whatitis2['default'].PlainObject(data)) {
    xhr.send(JSON.stringify(data));
  } else if (options.contentType === 'json') {
    xhr.send(data || null);
  } else {
    xhr.send(data || null);
  }

  promiseMethods.abort = function () {
    if (!xhr.aborted) {
      if (timeout) {
        clearTimeout(timeout);
      }
      xhr.aborted = true;
      xhr.abort();
    }
  };

  if (options.signal) {
    options.signal.onabort = function () {
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

var defaultOption = {
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
  contentType: 'formdata', // 'xml', 'json', 'text', 'formdata'
  // responseType;
  cache: 'default', // default 不设置头信息
  // no-store 、 reload 、 no-cache 、 force-cache 或者 only-if-cached
  signal: null,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300; // default
  },

  transformResponse: [function (data, headers_) {
    return data;
  }],
  transformRequest: [function (data) {
    return data;
  }],
  paramsSerializer: function paramsSerializer(params) {
    return _qs2['default'].stringify(params, { arrayFormat: 'brackets' });
  },
  onUploadProgress: function onUploadProgress(progressEvent_) {
    // Do whatever you want with the native progress event
  },
  onDownloadProgress: function onDownloadProgress(progressEvent_) {
    // Do whatever you want with the native progress event
  }
};

function getOption(_ref3) {
  var method = _ref3.method,
      headers = _ref3.headers,
      timeout = _ref3.timeout,
      ontimeout = _ref3.ontimeout,
      baseUrl = _ref3.baseUrl,
      data = _ref3.data,
      url = _ref3.url,
      withCredentials = _ref3.withCredentials,
      crossDomain = _ref3.crossDomain,
      user = _ref3.user,
      password = _ref3.password,
      dataType = _ref3.dataType,
      contentType = _ref3.contentType,
      cache = _ref3.cache,
      signal = _ref3.signal,
      validateStatus = _ref3.validateStatus,
      transformResponse = _ref3.transformResponse,
      transformRequest = _ref3.transformRequest,
      paramsSerializer = _ref3.paramsSerializer,
      onUploadProgress = _ref3.onUploadProgress,
      onDownloadProgress = _ref3.onDownloadProgress;


  var options = Object.assign({}, defaultOption);
  options.headers = Object.assign({}, options.headers);

  if (_whatitis2['default'].String(method) && method) {
    options.method = method.toLowerCase();
  }

  if (_whatitis2['default'].PlainObject(headers)) {
    Object.assign(options.headers, headers);
  }

  if (_whatitis2['default'].Number(timeout) && isFinite(timeout)) {
    options.timeout = Math.max(0, timeout);
  }

  if (_whatitis2['default'].Function(ontimeout)) {
    options.ontimeout = ontimeout;
  }

  if (_whatitis2['default'].String(baseUrl) && baseUrl) {
    options.baseUrl = baseUrl;
  }

  if (_whatitis2['default'].String(url) && url) {
    options.url = url;
  }

  // 跨域带cookie
  options.withCredentials = !!withCredentials;

  // 跨域
  options.crossDomain = !!crossDomain;
  if (!options.crossDomain && options.headers['X-Requested-With'] === 'XMLHttpRequest') {
    delete options.headers['X-Requested-With'];
  }

  if (_whatitis2['default'].String(user) && user) {
    options.user = user;
    if (_whatitis2['default'].String(password)) {
      options.password = password;
    }
  }

  // 设置 accept
  if (!_whatitis2['default'].String(dataType)) {
    // options.dataType = '';
  } else if (['*', 'xml', 'json', 'text', 'html' /*, 'script'*/].includes(dataType.toLowerCase())) {
    options.dataType = dataType;
  } else if (dataType.toLowerCase() === 'document') {
    options.dataType = 'html';
  } else if (['arraybuffer', 'blob', 'stream'].includes(dataType.toLowerCase())) {
    options.dataType = '*';
  }

  // 设置接收数据的格式
  // arraybuffer blob document stream 返回值可能需要相应的处理
  // json 将字符串自动转换成对象 xhr2不用手动转换
  // text 不处理接受的数据
  if (!_whatitis2['default'].String(dataType)) {
    // options.responseType = dataType;
  } else if (['xml', 'html'].includes(dataType.toLowerCase())) {
    options.responseType = 'document';
  } else if (['arraybuffer', 'blob', 'document', 'json', 'text', 'stream'].includes(dataType.toLowerCase())) {
    options.responseType = dataType;
  }

  // 设置 content-type
  // formdata xml text 不处理数据, data 应该是字符串或 formdata 对象
  // json 转换成字符串发送, data 是普通对象
  // 如果data是 Document 类型，同时也是HTML Document类型，则content-type默认值为text/html;charset=UTF-8;否则为application/xml;charset=UTF-8；
  // 如果data是 DOMString 类型，content-type默认值为text/plain;charset=UTF-8；
  // 如果data是 FormData 类型，content-type默认值为multipart/form-data; boundary=[xxx]
  if (!_whatitis2['default'].String(contentType)) {
    /* ignore */
  } else if (options.method !== 'get' && ['xml', 'json', 'text', 'formdata'].includes(contentType.toLowerCase())) {
    options.contentType = contentType;
  }

  // 如果是PlainObject就浅克隆
  if (data) {
    // options.data = is.PlainObject( data ) ? Object.assign({}, data ) : data;
    options.data = data;
  }

  if (_whatitis2['default'].Object(headers)) {
    // 使用no-cache的目的就是为了防止从缓存中获取过期的资源
    // const pragma = headers['Pragma']; // HTTP1.0-1.1
    // const cacheControl = headers['Cache-Control']; // HTTP1.1
    // if ( !cache && !is.String( cacheControl ) && cacheControl ) {
    //   options.headers['Cache-Control'] = 'no-cache';
    //   options.headers['Pragma'] = 'no-cache';
    // }
    if (cache && cache !== 'default') {
      options.headers['Cache-Control'] = cache;
      // 为了兼容 HTTP1.0
      if (cache === 'no-cache') {
        options.headers['Pragma'] = 'no-cache';
      }
    }
    options.cache = cache || options.cache;
  }

  // 只考虑异步情况
  options.async = true;

  if (signal) {
    options.signal = signal;
  }

  if (_whatitis2['default'].Function(validateStatus)) {
    options.validateStatus = validateStatus;
  }

  if (_whatitis2['default'].Array(transformResponse)) {
    options.transformResponse = transformResponse;
  }

  if (_whatitis2['default'].Array(transformRequest)) {
    options.transformRequest = transformRequest;
  }

  if (_whatitis2['default'].Function(paramsSerializer)) {
    options.paramsSerializer = paramsSerializer;
  }

  if (_whatitis2['default'].Function(onUploadProgress)) {
    options.onUploadProgress = onUploadProgress;
  }

  if (_whatitis2['default'].Function(onDownloadProgress)) {
    options.onDownloadProgress = onDownloadProgress;
  }

  (0, _invariant2['default'])(options.url || options.baseUrl, 'Url or BaseUrl must be a non-empty string.');

  return options;
}

function ajax(options) {
  return connection(options.method, options.baseUrl + options.url, options.data, options);
}

exports['default'] = (0, _compose2['default'])(ajax, getOption);
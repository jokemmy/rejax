'use strict';

exports.__esModule = true;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _whatitis = require('whatitis');

var _whatitis2 = _interopRequireDefault(_whatitis);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _convertor = require('./convertor');

var _convertor2 = _interopRequireDefault(_convertor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// content-type 表示上传的数据格式
// get 没有 content-type
// post 表单数据 application/x-www-form-urlencoded
//      上传文件 不用设置 content-type
// responseType 是接受的数据格式

var MIMETYPES = {
  TEXT: '*/*',
  XML: 'text/xml',
  JSON: 'application/json',
  POST: 'application/x-www-form-urlencoded',
  DOCUMENT: 'text/html'
};

var ACCEPT = {
  TEXT: '*/*',
  XML: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
  JSON: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
};

function hasHeader(name_) {
  return function (headers) {
    return Object.keys(headers).some(function (name) {
      return name.toLowerCase() === name_.toLowerCase();
    });
  };
}

function hasAccept(headers) {
  return hasHeader('accept')(headers);
}

function hasContentType(headers) {
  return hasHeader('content-type')(headers);
}

function encode(value) {
  return encodeURIComponent(value);
}

function getQueryString(object) {
  return Object.keys(object).reduce(function (acc, item) {
    var prefix = !acc ? '' : acc + '&';
    return prefix + encode(item) + '=' + encode(object[item]);
  }, '');
}

function objectToQueryString(data) {
  return _whatitis2['default'].PlainObject(data) ? getQueryString(data) : data;
}

function setHeaders(xhr, _ref) {
  var headers = _ref.headers,
      dataType = _ref.dataType,
      method = _ref.method;


  var TYPE = dataType.toUpperCase();

  if (!hasAccept(headers)) {
    headers.Accept = ACCEPT[TYPE] || ACCEPT.TEXT;
  }

  if (!hasContentType(headers) && method !== 'get') {
    headers['Content-Type'] = MIMETYPES.POST;
  }

  Object.keys(headers).forEach(function (name) {
    if (headers[name]) {
      xhr.setRequestHeader(name, headers[name]);
    }
  });
}

function getDataType(xhr) {
  var ct = xhr.getResponseHeader('Content-Type');
  if (ct.indexOf(MIMETYPES.JSON) > -1) {
    return 'json';
  } else if (ct.indexOf(MIMETYPES.XML) > -1) {
    return 'xml';
  }
  return 'text';
}

function convertors(dataType) {
  return function (xhr, convertor) {
    if (dataType) {
      return convertor(dataType, xhr.response);
    }
    return convertor(getDataType(xhr), xhr.response);
  };
}

function parseResponse(xhr, ctors, codePass) {

  var success = codePass;
  var result = null;
  var error = null;

  if (typeof xhr.response === 'undefined' && (typeof xhr.responseType === 'undefined' || xhr.responseType === '' || xhr.responseType === 'text')) {
    xhr.response = xhr.responseText;
  }

  if (codePass) {
    try {
      if (_whatitis2['default'].Function(ctors)) {
        result = ctors(xhr, _convertor2['default']);
      } else if (xhr.response === null) {
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

function ready(xhr2, xdr, ctors, timeout, xhr) {
  return function handleReady(appendMethods) {
    // 0 - (未初始化)还没有调用send()方法
    // 1 - (载入)已调用send()方法，正在发送请求
    // 2 - (载入完成)send()方法执行完成，
    // 3 - (交互)正在解析响应内容
    // 4 - (完成)响应内容解析完成，可以在客户端调用了
    if (xhr.readyState === xhr.DONE) {
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
      var codePass = xhr.status >= 200 && xhr.status < 300 || xhr.status === 304;

      var _parseResponse = parseResponse(xhr, ctors, codePass),
          success = _parseResponse.success,
          result = _parseResponse.result,
          error = _parseResponse.error;

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
  if (_whatitis2['default'].Undefined(window)) {
    throw Error('Hope: Ajax only for browser environment.');
  }
  getXhr = window.XMLHttpRequest ? function () {
    return new window.XMLHttpRequest();
  } : function () {
    return new window.ActiveXObject('Microsoft.XMLHTTP');
  };
} catch (e) {
  // server-side
  getXhr = function getXhr() {};
}

function fixXhr(xhr_, options) {

  var xhr = void 0;
  var xdr = false;
  var xhr2 = xhr_.responseType === '';

  if (options.crossOrigin) {
    if (!xhr2 && window.XDomainRequest) {
      xhr = new window.XDomainRequest(); // CORS with IE8/9
      xdr = true;
      if (options.method !== 'get' && options.method !== 'post') {
        options.method = 'post';
      }
      return [xhr, xdr, xhr2];
    }
    throw Error('Hope: CrossOrigin is not support.');
  }
  return [xhr_, xdr, xhr2];
}

function xhrConnection(method, url, data, options) {

  var nativeParsing = void 0;
  var queryString = '';
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
      _fixXhr2 = _slicedToArray(_fixXhr, 3),
      xhr = _fixXhr2[0],
      xdr = _fixXhr2[1],
      xhr2 = _fixXhr2[2];

  if (method === 'get' && data) {
    queryString = '?' + objectToQueryString(data);
  }

  if (xdr) {
    xhr.open(method, url + queryString);
  } else {
    xhr.open(method, url + queryString, options.async, options.user, options.password);
  }

  // withCredentials cross domain
  if (xhr2) {
    xhr.withCredentials = !!(options.async || options.withCredentials);
  }

  // headers
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
  if (options.async) {
    if (xhr2) {
      xhr.timeout = options.timeout;
      xhr.ontimeout = ontimeout;
    } else {
      timeout = setTimeout(handleTimeout(xhr, ontimeout), options.timeout);
    }
  } else if (xdr) {
    xhr.ontimeout = function () {};
  }

  if (xhr2) {
    try {
      xhr.responseType = options.dataType;
      nativeParsing = xhr2 && xhr.responseType === options.dataType;
    } catch (e) {} // eslint-disable-line
  } else if ('overrideMimeType' in xhr) {
    xhr.overrideMimeType(MIMETYPES[options.dataType.toUpperCase()]);
  }

  var ctors = nativeParsing || convertors(options.dataType);
  var handleResponse = function handleResponse() {
    return ready(xhr2, xdr, ctors, timeout, xhr)(appendMethods);
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

  xhr.send(method !== 'get' ? objectToQueryString(data) : null);
  promiseMethods.abort = function () {
    if (!xhr.aborted) {
      if (timeout) {
        clearTimeout(timeout);
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
  // async: true,
  user: '',
  password: '',
  dataType: 'json',
  cache: false
};

function getOption(_ref2) {
  var method = _ref2.method,
      headers = _ref2.headers,
      timeout = _ref2.timeout,
      ontimeout = _ref2.ontimeout,
      baseUrl = _ref2.baseUrl,
      data = _ref2.data,
      url = _ref2.url,
      withCredentials = _ref2.withCredentials,
      crossDomain = _ref2.crossDomain,
      user = _ref2.user,
      password = _ref2.password,
      dataType = _ref2.dataType,
      cache = _ref2.cache;


  var options = Object.assign({}, defaultOption);
  options.headers = Object.assign({}, options.headers);

  if (_whatitis2['default'].String(method) && method) {
    options.method = method;
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

  if (data) {
    options.data = _whatitis2['default'].PlainObject(data) ? Object.assign({}, data) : data;
  }

  if (_whatitis2['default'].String(url) && url) {
    options.url = url;
  }

  options.withCredentials = !!withCredentials;

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

  if (Object.keys(MIMETYPES).includes(dataType.toUpperCase())) {
    options.dataType = dataType;
  }

  // "arraybuffer", "blob", "document", "json", or "text"
  if ('ArrayBuffer' in window && data instanceof ArrayBuffer) {
    options.dataType = 'arraybuffer';
  } else if ('Blob' in window && data instanceof Blob) {
    options.dataType = 'blob';
  } else if ('Document' in window && data instanceof Document) {
    options.dataType = 'document';
  } else if ('FormData' in window && data instanceof FormData) {
    options.dataType = 'json';
  }

  if (_whatitis2['default'].Object(headers)) {
    var cacheControl = headers['Cache-Control'];
    if (!cache && !_whatitis2['default'].String(cacheControl) && cacheControl) {
      options.headers['Cache-Control'] = 'no-cache';
    }
  }

  options.async = true;

  (0, _invariant2['default'])(options.url || options.baseUrl, 'Hope: One of Url and BaseUrl must be a non-empty string.');

  return options;
}

function ajax(options) {
  return xhrConnection(options.method, options.baseUrl + options.url, options.data, options);
}

exports['default'] = (0, _compose2['default'])(ajax, getOption);
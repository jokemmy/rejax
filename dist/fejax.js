(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('whatitis')) :
	typeof define === 'function' && define.amd ? define(['whatitis'], factory) :
	(global.whatenvis = factory(global.is));
}(this, (function (is) { 'use strict';

var is__default = 'default' in is ? is['default'] : is;

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

var object_pick$1 = function pick(obj, keys) {
  if (!isobject(obj) && typeof obj !== 'function') {
    return {};
  }

  var res = {};
  if (typeof keys === 'string') {
    if (keys in obj) {
      res[keys] = obj[keys];
    }
    return res;
  }

  var len = keys.length;
  var idx = -1;

  while (++idx < len) {
    var key = keys[idx];
    if (key in obj) {
      res[key] = obj[key];
    }
  }
  return res;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = "development";

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  var last = funcs[funcs.length - 1];
  var rest = funcs.slice(0, -1);
  return function () {
    return rest.reduceRight(function (composed, f) {
      return f(composed);
    }, last.apply(undefined, arguments));
  };
}

var convertor = function (type, data) {

  var response = void 0;

  switch (type) {

    case 'json':
      if (data.length) {
        try {
          if ('JSON' in global) {
            response = JSON.parse(data);
          } else {
            response = new Function('return (' + data + ')')(); // eslint-disable-line
          }
        } catch (e) {
          throw Error('Hope: Error while parsing JSON body : ' + e);
        }
      }
      break;

    case 'xml':

      // Based on jQuery's parseXML() function
      try {
        // Standard
        if (window.DOMParser) {
          response = new DOMParser().parseFromString(data, 'text/xml');

          // IE<9
        } else {
          response = new window.ActiveXObject('Microsoft.XMLDOM');
          response.async = 'false';
          response.loadXML(data);
        }
      } catch (e) {
        response = undefined;
      }
      if (!response || !response.documentElement || response.getElementsByTagName('parsererror').length) {
        throw Error('Hope: Invalid XML');
      }
      break;
    default:
      response = data;
  }

  return response;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};





















var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

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
  return is__default.PlainObject(data) ? getQueryString(data) : data;
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
  return function (xhr, convertor$$1) {
    if (dataType) {
      return convertor$$1(dataType, xhr.response);
    }
    return convertor$$1(getDataType(xhr), xhr.response);
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
      if (is__default.Function(ctors)) {
        result = ctors(xhr, convertor);
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
  if (is__default.Undefined(window)) {
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
      appendMethods[method] = old ? compose(callback, old) : callback;
      return promise;
    };
    return promise;
  }, {});

  var _fixXhr = fixXhr(getXhr(), options),
      _fixXhr2 = slicedToArray(_fixXhr, 3),
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

  if (is__default.String(method) && method) {
    options.method = method;
  }

  if (is__default.PlainObject(headers)) {
    Object.assign(options.headers, headers);
  }

  if (is__default.Number(timeout) && isFinite(timeout)) {
    options.timeout = Math.max(0, timeout);
  }

  if (is__default.Function(ontimeout)) {
    options.ontimeout = ontimeout;
  }

  if (is__default.String(baseUrl) && baseUrl) {
    options.baseUrl = baseUrl;
  }

  if (data) {
    options.data = is__default.PlainObject(data) ? Object.assign({}, data) : data;
  }

  if (is__default.String(url) && url) {
    options.url = url;
  }

  options.withCredentials = !!withCredentials;

  options.crossDomain = !!crossDomain;
  if (!options.crossDomain && options.headers['X-Requested-With'] === 'XMLHttpRequest') {
    delete options.headers['X-Requested-With'];
  }

  if (is__default.String(user) && user) {
    options.user = user;
    if (is__default.String(password)) {
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

  if (is__default.Object(headers)) {
    var cacheControl = headers['Cache-Control'];
    if (!cache && !is__default.String(cacheControl) && cacheControl) {
      options.headers['Cache-Control'] = 'no-cache';
    }
  }

  options.async = true;

  invariant_1(options.url || options.baseUrl, 'Hope: One of Url and BaseUrl must be a non-empty string.');

  return options;
}

function ajax(options) {
  return xhrConnection(options.method, options.baseUrl + options.url, options.data, options);
}

var ajaxXhr = compose(ajax, getOption);

var PENDING = 'PENDING';
var FULFILLED = 'FULFILLED';
var REJECTED = 'REJECTED';

function setStatus(chain, status) {
  chain._state = status;
}

function getResult(results) {
  return results.length <= 1 ? results[0] : results;
}

function setStatusWapper(chains) {
  return function (resultSet) {
    try {
      setStatus(resultSet.chain, resultSet.err ? REJECTED : FULFILLED);
      return chains(resultSet);
    } catch (err) {
      resultSet.err = err;
      resultSet.result = [err];
      setStatus(resultSet.chain, REJECTED);
      throw err;
    }
  };
}

function tryWapper(chains) {
  return function (resultSet) {
    try {
      return chains(resultSet);
    } catch (err) {
      return Object.assign(resultSet, { err: err, result: [err] });
    }
  };
}

function delayThrow(chains) {
  return function (resultSet) {
    try {
      return chains(resultSet);
    } catch (err) {
      var timer = setTimeout(function () {
        throw err;
      });
      return Object.assign(resultSet, { err: err, timer: timer, result: [err] });
    }
  };
}

// use in always method, catch a error and throw this error or throw the last error
function throwWapper(callback) {
  return function (resultSet) {
    callback.apply(undefined, [resultSet.err || null, resultSet.err ? null : resultSet.result].concat(toConsumableArray(resultSet.argument)));
    if (resultSet.err) {
      throw resultSet.err;
    }
    return resultSet;
  };
}

function notThrowWapper(callback) {
  return function (resultSet) {
    callback.apply(undefined, [resultSet.err || null, resultSet.err ? null : resultSet.result].concat(toConsumableArray(resultSet.argument)));
    return resultSet;
  };
}

function thenerWrapper(callback) {
  return function handler(resultSet_) {
    var resultSet = Object.assign({}, resultSet_);

    if (resultSet.err) {
      return resultSet;
    }

    if (is__default.Defined(resultSet.result)) {
      resultSet.result = callback(resultSet.result);
    } else {
      resultSet.result = callback.apply(undefined, toConsumableArray(resultSet.argument));
    }

    return resultSet;
  };
}

function catcherWrapper(callback) {
  return function handler(resultSet_) {
    var resultSet = Object.assign({}, resultSet_);

    if (!resultSet.err) {
      return resultSet;
    }

    if (resultSet.timer) {
      clearTimeout(resultSet.timer);
      delete resultSet.timer;
    }

    resultSet.result = callback(resultSet.err);
    return Object.assign(resultSet, { err: null });
  };
}

var METHOD = {
  thenMethod: function thenMethod(chains, callback) {
    var wrapped = compose(setStatusWapper, thenerWrapper)(callback);
    return chains ? compose(wrapped, chains) : wrapped;
  },
  catchMethod: function catchMethod(chains, callback) {
    var wrapped = compose(catcherWrapper)(callback);
    return chains ? compose(wrapped, tryWapper(chains)) : wrapped;
  },
  alwaysMethod: function alwaysMethod(chains, callback) {
    var wrapped = compose(throwWapper)(callback);
    return chains ? compose(wrapped, tryWapper(chains)) : wrapped;
  },
  thenSyncMethod: function thenSyncMethod(callback) {
    return compose(delayThrow, setStatusWapper, thenerWrapper)(callback);
  },
  catchSyncMethod: function catchSyncMethod(callback) {
    return compose(delayThrow, catcherWrapper)(callback);
  },
  alwaysSyncMethod: function alwaysSyncMethod(callback) {
    return compose(delayThrow, notThrowWapper)(callback);
  }
};

function initChain(callback) {

  invariant_1(is__default.Function(callback), 'Hope: You must pass a resolver function as the first argument to the chain constructor');

  return function (resolve, reject) {
    try {
      callback(resolve, reject);
    } catch (err) {
      reject(err);
    }
  };
}

function removeSet(chain) {
  setTimeout(function () {
    delete chain._sync;
  });
}

var Chain = function () {
  createClass(Chain, null, [{
    key: 'of',
    value: function of(resolver) {
      return new Chain(resolver);
    }
  }, {
    key: 'resolve',
    value: function resolve(value) {
      return Chain.of(function (resolve) {
        return resolve(value);
      });
    }
  }, {
    key: 'reject',
    value: function reject(reason) {
      return Chain.of(function (_, reject) {
        return reject(reason);
      });
    }
  }, {
    key: 'all',
    value: function all(chains_) {
      var chn = Chain.of(function () {});
      var chains = Array.from(chains_);
      function checkAll(chs) {
        if (chs.every(function (chain) {
          return chain._state !== PENDING;
        })) {
          var chainResults = chs.map(function (chain) {
            return chain._result;
          });
          if (chs.some(function (chain) {
            return chain._state === REJECTED;
          })) {
            chn.reject.apply(chn, toConsumableArray(chainResults));
          }
          chn.resolve.apply(chn, toConsumableArray(chainResults));
        }
      }
      chains.forEach(function (chain) {
        chain.always(function () {
          return checkAll(chains);
        })['catch'](function () {});
      });
      return chn;
    }
  }, {
    key: 'race',
    value: function race(chains_) {
      var chn = Chain.of(function () {});
      var chains = Array.from(chains_);
      function checkOne(chs) {
        if (chs.some(function (chain) {
          return chain._state !== PENDING;
        })) {
          var chain = chs.find(function (chain) {
            return chain._state !== PENDING;
          });
          if (chain._state === REJECTED) {
            chn.reject(chain._result);
          }
          chn.resolve(chain._result);
        }
      }
      chains.forEach(function (chain) {
        chain.always(function () {
          return checkOne(chains);
        })['catch'](function () {});
      });
      return chn;
    }
  }]);

  function Chain(resolver) {
    var _this = this;

    classCallCheck(this, Chain);

    // this._sync = null;
    this._result = null;
    this._state = PENDING;

    var chains = null;
    var initialize = initChain(resolver);

    ['resolve', 'reject'].forEach(function (func) {
      var body = _this[func].bind(_this);
      _this[func] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return body.apply(undefined, [chains].concat(args));
      };
    });

    ['then', 'catch', 'always'].forEach(function (func) {
      _this[func] = function (callback) {
        if (_this._sync) {
          _this._set = METHOD[func + 'SyncMethod'](callback)(_this._set);
          _this._result = _this._set.result;
        } else {
          chains = METHOD[func + 'Method'](chains, callback);
        }
        return _this;
      };
    });

    var thenMethod = this.then;
    var catchMethod = this['catch'];
    this.then = function (resolve, reject) {
      if (is__default.Function(resolve)) {
        thenMethod(resolve);
      }
      if (is__default.Function(reject)) {
        catchMethod(reject);
      }
      return _this;
    };

    initialize(this.resolve, this.reject);
  }

  createClass(Chain, [{
    key: 'resolve',
    value: function resolve(chains) {
      for (var _len2 = arguments.length, value = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        value[_key2 - 1] = arguments[_key2];
      }

      if (this._state === PENDING) {
        this._result = getResult(value);
        this._state = FULFILLED;
        this._set = {
          err: null,
          result: undefined,
          argument: value,
          chain: this
        };
        if (chains) {
          this._set = chains(this._set);
          // this._result = this._set.result;
        } else {
          removeSet(this);
          this._sync = true;
        }
      }
      return this;
    }
  }, {
    key: 'reject',
    value: function reject(chains) {
      for (var _len3 = arguments.length, reason = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        reason[_key3 - 1] = arguments[_key3];
      }

      if (this._state === PENDING) {
        this._result = getResult(reason);
        this._state = REJECTED;
        this._set = {
          err: reason,
          result: undefined,
          argument: reason,
          chain: this
        };
        if (chains) {
          this._set = chains(this._set);
          // this._result = this._set.result;
        } else {
          removeSet(this);
          this._sync = true;
        }
      }
      return this;
    }
  }]);
  return Chain;
}();

var isDev = process && "development" === 'development';

function log(level, message) {
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (isDev) {
    /* eslint-disable no-console */
    if (typeof window === 'undefined') {
      console.log('Hope: ' + message + '\n' + (error && error.stack || error));
    } else {
      var _console;

      (_console = console)[level].apply(_console, toConsumableArray([message].concat(error ? ['\n', error] : [])));
    }
  }
}

var ajaxSymbol = Symbol('ajax');
var ajaxHandler = Symbol('ajaxHandler');
var isAjax = is.property(ajaxSymbol);
var globalMap = {

  // converters: {
  //   xml:
  //   html:
  //   script:
  //   json: JSON.parse,
  //   jsonp:
  // },

  urls: {},
  tokens: new Map(),

  setURLTokens: function setURLTokens(pairs) {
    var tokens = globalMap.tokens;
    Object.entries(pairs).forEach(function (_ref) {
      var _ref2 = slicedToArray(_ref, 2),
          token = _ref2[0],
          value = _ref2[1];

      tokens.set(token, [new RegExp('{' + token + '}', 'g'), value]);
    });
  },
  setURLAlias: function setURLAlias(aliases, transform) {
    var urls = globalMap.urls;
    Object.entries(aliases).forEach(function (_ref3) {
      var _ref4 = slicedToArray(_ref3, 2),
          alias = _ref4[0],
          url = _ref4[1];

      urls[alias] = url;
    });
    if (is__default.Function(transform)) {
      globalMap.URLTransform = transform;
    }
  },
  setDataTransform: function setDataTransform(transform) {
    if (is__default.Function(transform)) {
      globalMap.dataTransform = transform;
    }
  },
  setAssert: function setAssert(assert) {
    if (is__default.Function(assert)) {
      globalMap.assert = assert;
    }
  },
  URLTransform: function URLTransform(alias, tokens) {
    var url = globalMap.urls[alias];
    if (url) {
      tokens.forEach(function (_ref5) {
        var _ref6 = slicedToArray(_ref5, 2),
            regexp = _ref6[0],
            value = _ref6[1];

        if (regexp.test(url)) {
          url = url.replace(regexp, value);
        }
      });
      return url;
    }
    return alias;
  },
  dataTransform: function dataTransform(type_, response, error, xhr_) {
    return response || error;
  },
  assert: function assert(type_, response, resolve_, reject_) {
    resolve_(response);
  }
};

// eslint-disable-next-line
var allocator = function allocator(resolve, reject, options) {
  return function (success) {
    return function (cdResponse, xhr) {
      var dataType = options.dataType;

      var transform = globalMap.dataTransform;
      if (success) {
        if (is__default.Function(options.assert)) {
          options.assert(dataType, transform(dataType, cdResponse, null, xhr), resolve, reject);
        } else {
          globalMap.assert(dataType, transform(dataType, cdResponse, null, xhr), resolve, reject);
        }
        // abort/timeout only print one warn
        // opened and no status code has been received from the server,status === 0
      } else if (xhr.status === 0) {
        var txt = xhr.aborted ? 'abort' : 'timeout';
        log('warn', 'Url (' + options.url + ') is ' + txt + '.');
        reject(transform(dataType, null, txt, xhr));
      } else {
        reject(transform(dataType, null, cdResponse, xhr));
      }
    };
  };
};

function URLFormat(alias) {
  return globalMap.URLTransform(alias, globalMap.tokens);
}

function getMethod(_ref7) {
  var data = _ref7.data,
      method = _ref7.method;

  if (method) {
    return method;
  }
  if (data) {
    return 'post';
  }
  return 'get';
}

function assignOption(obj) {
  for (var _len = arguments.length, objs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objs[_key - 1] = arguments[_key];
  }

  var newObj = Object.assign.apply(Object, [obj].concat(objs));
  delete newObj[ajaxHandler];
  return newObj;
}

function getOptions(url, options_) {

  var options = {};

  // url is String, options is undefined/plain-object, two arguments
  if (is__default.String(url)) {
    options.url = url;
    if (is__default.PlainObject(options_)) {
      assignOption(options, options_);
    }
    options.method = getMethod(options);

    // url is PlainObject, only one argument
  } else if (is__default.PlainObject(url)) {
    assignOption(options, url);
    options.method = getMethod(options);

    // url is Function, only one argument
  } else if (is__default.Function(url)) {
    options[ajaxHandler] = url;
  }

  // dataType default 'json'
  if (!is__default.String(options.dataType) || options.dataType === '') {
    options.dataType = 'json';
  }

  if (is__default.String(options.url)) {
    options.url = URLFormat(options.url);
  }

  // null/undefined => String('')
  if (is__default.PlainObject(options.data)) {
    options.data = Object.entries(options.data).reduce(function (memo, _ref8) {
      var _ref9 = slicedToArray(_ref8, 2),
          key = _ref9[0],
          value = _ref9[1];

      memo[key] = is__default.Defined(value) ? value : '';
      return memo;
    }, {});
  }

  return options;
}

function composeWithResult(callback, lastHandle) {
  return function () {
    var result = lastHandle.apply(undefined, arguments);
    if (is__default.Defined(result)) {
      return callback(result);
    }
    return callback.apply(undefined, arguments);
  };
}

/**
 * options {
 *   assert,
 *   dataType: 'json',
 *   headers: object
 *   timeout: number
 *   ontimeout: function
 *   baseUrl: string,
 *   data: object,
 *   url: string,
 *   withCredentials: boolean
 * }
 */
function Ajax(url, options) {
  var _chainMethod;

  var next = void 0;
  var getNextXhrs = void 0;
  var sending = null;
  var handlerThen = null;
  var handlerCatch = null;
  var handlerBefore = null;
  var handlerFinally = null;

  var xhrs = [];
  var builders = [];
  var chainMethod = (_chainMethod = {}, defineProperty(_chainMethod, ajaxSymbol, true), defineProperty(_chainMethod, 'then', function then(callback) {
    handlerThen = handlerThen ? composeWithResult(callback, handlerThen) : callback;
  }), defineProperty(_chainMethod, 'catch', function _catch(callback) {
    handlerCatch = handlerCatch ? composeWithResult(callback, handlerCatch) : callback;
  }), defineProperty(_chainMethod, 'always', function always(callback) {
    chainMethod.then(function () {
      for (var _len2 = arguments.length, results = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        results[_key2] = arguments[_key2];
      }

      return callback(null, results);
    });
    chainMethod['catch'](function (err) {
      return callback(err, null);
    });
  }), defineProperty(_chainMethod, 'before', function before(callback) {
    handlerBefore = handlerBefore ? composeWithResult(callback, handlerBefore) : callback;
  }), defineProperty(_chainMethod, 'finally', function _finally(callback) {
    handlerFinally = handlerFinally ? composeWithResult(callback, handlerFinally) : callback;
  }), defineProperty(_chainMethod, 'getXhr', function getXhr() {
    if (getNextXhrs) {
      return getNextXhrs();
    }
    return xhrs;
  }), defineProperty(_chainMethod, 'abort', function abort() {
    var xhrs = chainMethod.getXhr();
    while (xhrs.length) {
      xhrs.pop().abort();
    }
  }), _chainMethod);

  // create new chain of ajax
  function newAjax(options) {
    var abort = void 0;
    var chain = Chain.of(function (resolve, reject) {
      var callback = allocator(resolve, reject, options);
      abort = ajaxXhr(options).then(callback(true))['catch'](callback(false)).abort;
    });
    chain.abort = abort;
    return chain;
  }

  function nextAjax(options, ajaxHandler) {
    if (sending) {
      if (next) {
        var prev = next;
        next = function next() {
          return prev.apply(undefined, arguments).ajax(options || ajaxHandler);
        };
      } else {
        var finallys = handlerFinally;
        next = ajaxHandler ? function () {
          for (var _len3 = arguments.length, result = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            result[_key3] = arguments[_key3];
          }

          return ajaxHandler.apply(undefined, result)['finally'](function () {
            for (var _len4 = arguments.length, rs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              rs[_key4] = arguments[_key4];
            }

            return finallys.apply(undefined, result.concat(rs));
          });
        } : function () {
          for (var _len5 = arguments.length, result = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            result[_key5] = arguments[_key5];
          }

          return Ajax(options)['finally'](function () {
            for (var _len6 = arguments.length, rs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
              rs[_key6] = arguments[_key6];
            }

            return finallys.apply(undefined, result.concat(rs));
          });
        };
        handlerFinally = null;
      }
    } else {
      builders.push(options || ajaxHandler);
    }
  }

  function createAjax(options, method) {
    if (options.url) {
      nextAjax(Object.assign(options, { method: method }));
      return true;
    } else if (options[ajaxHandler]) {
      nextAjax(null, options[ajaxHandler]);
      return true;
    }
    return false;
  }

  function append(funcName) {
    for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      args[_key7 - 1] = arguments[_key7];
    }

    var prev = next;
    var needLastResults = ['ajax', 'get', 'post', 'put', 'delete', 'then', 'always', 'finally'].includes(funcName);
    var nextArgs = args.length === 1 && is__default.Function(args[0]) && needLastResults ? function (result) {
      var _args$;

      return [(_args$ = args[0]).bind.apply(_args$, [undefined].concat(toConsumableArray(result)))];
    } : function () {
      return args;
    };
    next = function next() {
      var _prev;

      for (var _len8 = arguments.length, result = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        result[_key8] = arguments[_key8];
      }

      return (_prev = prev.apply(undefined, result))[funcName].apply(_prev, toConsumableArray(nextArgs(result)));
    };
  }

  function remove(xhr) {
    xhrs.splice(xhrs.indexOf(xhr), 1);
  }

  function setXhrs() {
    return builders.reduce(function (xhrs, options) {
      var ajaxObject = void 0;
      if (is__default.Function(options)) {
        var ajax = options();
        invariant_1(isAjax(ajax), 'Hope: Function of ajax() expecting a ajax-object be returned.');
        ajaxObject = ajax.getXhr()[0].always(function () {
          return remove(ajaxObject);
        });
      } else {
        ajaxObject = newAjax(options).always(function () {
          return remove(ajaxObject);
        });
      }
      xhrs.push(ajaxObject);
      return xhrs;
    }, xhrs);
  }

  function getNext(ajaxObject) {
    invariant_1(isAjax(ajaxObject), 'Hope: Function of ajax() expecting a ajax-object be returned.');
    getNextXhrs = ajaxObject.getXhr;
  }

  function connection() {

    if (sending) return;

    var xhrs = setXhrs();
    if (handlerBefore) {
      handlerBefore.apply(undefined, toConsumableArray(xhrs));
    }

    sending = Chain.all(xhrs).then(function () {
      var result = void 0;
      if (handlerThen) {
        result = handlerThen.apply(undefined, arguments);
      }
      if (next) {
        if (is__default.Defined(result)) {
          getNext(next(result));
        } else {
          getNext(next.apply(undefined, arguments));
        }
      }
    })['catch'](function (err) {
      if (handlerCatch) {
        handlerCatch(err.length === 1 ? err[0] : err);
      }
    }).then(function () {
      if (handlerFinally) {
        handlerFinally.apply(undefined, arguments);
      }
    });
  }

  // ajax methods
  ['ajax', 'get', 'post', 'put', 'delete'].forEach(function (method) {
    chainMethod[method] = compose(function (options) {
      if (createAjax(options, method === 'ajax' ? options.method : method)) {
        return chainMethod;
      }
      return object_pick$1(chainMethod, ['ajax', 'get', 'post', 'put', 'delete']);
    }, getOptions); /* ( url, options ) */
  });

  // add xhr connection
  ['then', 'catch', 'before', 'always', 'finally'].forEach(function (func) {
    var funcBody = chainMethod[func];
    chainMethod[func] = function (callback) {
      if (callback) {
        funcBody(callback);
      }
      connection();
      return chainMethod;
    };
  });

  // if next ajax is exist, all function will append to the next ajax
  ['ajax', 'get', 'post', 'put', 'delete', 'before', 'then', 'catch', 'always', 'finally'].forEach(function (func) {
    var body = chainMethod[func];
    chainMethod[func] = function () {
      for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      if (next) {
        append.apply(undefined, [func].concat(args));
        return chainMethod;
      }
      return body.apply(undefined, args);
    };
  });

  // success === done === then && error === fail === catch
  chainMethod.success = chainMethod.done = chainMethod.then;
  chainMethod.error = chainMethod.fail = chainMethod['catch'];

  // init
  return chainMethod.ajax(url, options);
}

Object.assign(Ajax, object_pick$1(globalMap, ['setURLTokens', 'setURLAlias', 'setDataTransform', 'setAssert']), {
  getURL: URLFormat
});

return Ajax;

})));

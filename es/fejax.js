var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import pick from 'object.pick';
import invariant from 'invariant';
import is, { property } from 'whatitis';
import ajaxXhr from './xhr';
import compose from './compose';
import Chain from './chain';

var isDev = process && process.env.NODE_ENV === 'development';

function log(level, message) {
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (isDev) {
    /* eslint-disable no-console */
    if (typeof window === 'undefined') {
      console.log('Hope: ' + message + '\n' + (error && error.stack || error));
    } else {
      var _console;

      (_console = console)[level].apply(_console, _toConsumableArray([message].concat(error ? ['\n', error] : [])));
    }
  }
}

var ajaxSymbol = Symbol('ajax');
var ajaxHandler = Symbol('ajaxHandler');
var isAjax = property(ajaxSymbol);
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
      var _ref2 = _slicedToArray(_ref, 2),
          token = _ref2[0],
          value = _ref2[1];

      tokens.set(token, [new RegExp('{' + token + '}', 'g'), value]);
    });
  },
  setURLAlias: function setURLAlias(aliases, transform) {
    var urls = globalMap.urls;
    Object.entries(aliases).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          alias = _ref4[0],
          url = _ref4[1];

      urls[alias] = url;
    });
    if (is.Function(transform)) {
      globalMap.URLTransform = transform;
    }
  },
  setDataTransform: function setDataTransform(transform) {
    if (is.Function(transform)) {
      globalMap.dataTransform = transform;
    }
  },
  setAssert: function setAssert(assert) {
    if (is.Function(assert)) {
      globalMap.assert = assert;
    }
  },
  URLTransform: function URLTransform(alias, tokens) {
    var url = globalMap.urls[alias];
    if (url) {
      tokens.forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
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
        if (is.Function(options.assert)) {
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
  if (is.String(url)) {
    options.url = url;
    if (is.PlainObject(options_)) {
      assignOption(options, options_);
    }
    options.method = getMethod(options);

    // url is PlainObject, only one argument
  } else if (is.PlainObject(url)) {
    assignOption(options, url);
    options.method = getMethod(options);

    // url is Function, only one argument
  } else if (is.Function(url)) {
    options[ajaxHandler] = url;
  }

  // dataType default 'json'
  if (!is.String(options.dataType) || options.dataType === '') {
    options.dataType = 'json';
  }

  if (is.String(options.url)) {
    options.url = URLFormat(options.url);
  }

  // null/undefined => String('')
  if (is.PlainObject(options.data)) {
    options.data = Object.entries(options.data).reduce(function (memo, _ref8) {
      var _ref9 = _slicedToArray(_ref8, 2),
          key = _ref9[0],
          value = _ref9[1];

      memo[key] = is.Defined(value) ? value : '';
      return memo;
    }, {});
  }

  return options;
}

function composeWithResult(callback, lastHandle) {
  return function () {
    var result = lastHandle.apply(undefined, arguments);
    if (is.Defined(result)) {
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
  var chainMethod = (_chainMethod = {}, _defineProperty(_chainMethod, ajaxSymbol, true), _defineProperty(_chainMethod, 'then', function then(callback) {
    handlerThen = handlerThen ? composeWithResult(callback, handlerThen) : callback;
  }), _defineProperty(_chainMethod, 'catch', function _catch(callback) {
    handlerCatch = handlerCatch ? composeWithResult(callback, handlerCatch) : callback;
  }), _defineProperty(_chainMethod, 'always', function always(callback) {
    chainMethod.then(function () {
      for (var _len2 = arguments.length, results = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        results[_key2] = arguments[_key2];
      }

      return callback(null, results);
    });
    chainMethod['catch'](function (err) {
      return callback(err, null);
    });
  }), _defineProperty(_chainMethod, 'before', function before(callback) {
    handlerBefore = handlerBefore ? composeWithResult(callback, handlerBefore) : callback;
  }), _defineProperty(_chainMethod, 'finally', function _finally(callback) {
    handlerFinally = handlerFinally ? composeWithResult(callback, handlerFinally) : callback;
  }), _defineProperty(_chainMethod, 'getXhr', function getXhr() {
    if (getNextXhrs) {
      return getNextXhrs();
    }
    return xhrs;
  }), _defineProperty(_chainMethod, 'abort', function abort() {
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
    var nextArgs = args.length === 1 && is.Function(args[0]) && needLastResults ? function (result) {
      var _args$;

      return [(_args$ = args[0]).bind.apply(_args$, [undefined].concat(_toConsumableArray(result)))];
    } : function () {
      return args;
    };
    next = function next() {
      var _prev;

      for (var _len8 = arguments.length, result = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        result[_key8] = arguments[_key8];
      }

      return (_prev = prev.apply(undefined, result))[funcName].apply(_prev, _toConsumableArray(nextArgs(result)));
    };
  }

  function remove(xhr) {
    xhrs.splice(xhrs.indexOf(xhr), 1);
  }

  function setXhrs() {
    return builders.reduce(function (xhrs, options) {
      var ajaxObject = void 0;
      if (is.Function(options)) {
        var ajax = options();
        invariant(isAjax(ajax), 'Hope: Function of ajax() expecting a ajax-object be returned.');
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
    invariant(isAjax(ajaxObject), 'Hope: Function of ajax() expecting a ajax-object be returned.');
    getNextXhrs = ajaxObject.getXhr;
  }

  function connection() {

    if (sending) return;

    var xhrs = setXhrs();
    if (handlerBefore) {
      handlerBefore.apply(undefined, _toConsumableArray(xhrs));
    }

    sending = Chain.all(xhrs).then(function () {
      var result = void 0;
      if (handlerThen) {
        result = handlerThen.apply(undefined, arguments);
      }
      if (next) {
        if (is.Defined(result)) {
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
      return pick(chainMethod, ['ajax', 'get', 'post', 'put', 'delete']);
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

Object.assign(Ajax, pick(globalMap, ['setURLTokens', 'setURLAlias', 'setDataTransform', 'setAssert']), {
  getURL: URLFormat
});

export default Ajax;
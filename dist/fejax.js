(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.fejax = factory());
}(this, (function () { 'use strict';

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject$1 = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function isObjectObject(o) {
  return isobject$1(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

var toString = Object.prototype.toString;

var kindOf = function kindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';

  var type = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol': return 'symbol';
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    case 'WeakMap': return 'weakmap';
    case 'WeakSet': return 'weakset';
    case 'Map': return 'map';
    case 'Set': return 'set';

    // 8-bit typed arrays
    case 'Int8Array': return 'int8array';
    case 'Uint8Array': return 'uint8array';
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    case 'Int16Array': return 'int16array';
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    case 'Int32Array': return 'int32array';
    case 'Uint32Array': return 'uint32array';
    case 'Float32Array': return 'float32array';
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) {
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    case '[object Object]': return 'object';
    // iterators
    case '[object Map Iterator]': return 'mapiterator';
    case '[object Set Iterator]': return 'setiterator';
    case '[object String Iterator]': return 'stringiterator';
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  return val.constructor ? val.constructor.name : null;
}

function isArray(val) {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

function isError(val) {
  return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function'
    && typeof val.getDate === 'function'
    && typeof val.setDate === 'function';
}

function isRegexp(val) {
  if (val instanceof RegExp) return true;
  return typeof val.flags === 'string'
    && typeof val.ignoreCase === 'boolean'
    && typeof val.multiline === 'boolean'
    && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  return typeof val.throw === 'function'
    && typeof val.return === 'function'
    && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }
  return false;
}

var itis = {};

['Array', 'Number', 'Function', 'RegExp', 'Boolean', 'Date', 'Error', 'Arguments', 'Null', 'String'].forEach(function (name) {
  itis[name] = function (v) {
    return kindOf(v) === name.toLowerCase();
  };
});

/**
 * 2017-08-12 rainx
 * If a variable is not equal to null or undefined, I think it is defined.
 */
var isDefined = (function (variable) {
  return variable !== null && variable !== undefined;
});

/**
 * 2017-08-12 rainx
 * Be contrary to isDefined.
 */
var isUndefined = (function (variable) {
  return variable === null || variable === undefined;
});

function isItClass(Cls) {
  return function (obj) {
    return obj instanceof Cls;
  };
}

var isWindow = function (win) {
  return win != null && win === win.window;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * nodeType 说明 http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
 *
 * 1 Element  代表元素
 *   Element, Text, Comment, ProcessingInstruction, CDATASection, EntityReference
 * 2 Attr  代表属性
 *   Text, EntityReference
 * 3 Text  代表元素或属性中的文本内容
 *   None
 * 4 CDATASection  代表文档中的 CDATA 部分（不会由解析器解析的文本）
 *   None
 * 5 EntityReference  代表实体引用
 *   Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference
 * 6 Entity  代表实体
 *   Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference
 * 7 ProcessingInstruction  代表处理指令
 *   None
 * 8 Comment  代表注释
 *   None
 * 9 Document  代表整个文档（DOM 树的根节点）
 *   Element, ProcessingInstruction, Comment, DocumentType
 * 10 DocumentType  向为文档定义的实体提供接口
 *   None
 * 11 DocumentFragment  代表轻量级的 Document 对象，能够容纳文档的某个部分
 *   Element, ProcessingInstruction, Comment, Text, CDATASection, EntityReference
 * 12 Notation  代表 DTD 中声明的符号
 *   None
 */

var isElement = (function (element) {
  return (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && element.nodeType === 1;
});

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isDocument = (function (element) {
  return (typeof element === 'undefined' ? 'undefined' : _typeof$1(element)) === 'object' && element.nodeType === 9;
});

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function getLength(obj) {
  return isobject(obj) ? obj.length : undefined;
}

var isArrayLike = function (collection) {
  var length = getLength(collection);
  return itis.Number(length) && length >= 0 && length <= MAX_ARRAY_INDEX;
};

// Number, Function, RegExp, Boolean, Date, Error, Arguments,
// PlainObject, Object, Array, ArrayLike, Element
var is = Object.assign(itis, {
  Undefined: isUndefined,
  Defined: isDefined,
  Element: isElement,
  Window: isWindow,
  Document: isDocument,
  PlainObject: isPlainObject,
  Object: isobject,
  ArrayLike: isArrayLike,
  isItClass: isItClass
});

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject$3 = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

var object_pick$1 = function pick(obj, keys) {
  if (!isobject$3(obj) && typeof obj !== 'function') {
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

var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (Array.isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer$1 = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var utils = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer$1,
    isRegExp: isRegExp,
    merge: merge
};

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var formats = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var isArray$1 = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            pushToArray(values, stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        } else {
            pushToArray(values, stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        }
    }

    return values;
};

var stringify_1 = function (object, opts) {
    var obj = object;
    var options = opts ? utils.assign({}, opts) : {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? defaults.allowDots : !!options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    var charset = options.charset || defaults.charset;
    if (typeof options.charset !== 'undefined' && options.charset !== 'utf-8' && options.charset !== 'iso-8859-1') {
        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    if (typeof options.format === 'undefined') {
        options.format = formats['default'];
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly,
            charset
        ));
    }

    var joined = keys.join(delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

var has$1 = Object.prototype.hasOwnProperty;

var defaults$1 = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults$1.decoder, charset);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults$1.decoder, charset);
            val = options.decoder(part.slice(pos + 1), defaults$1.decoder, charset);
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }
        if (has$1.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has$1.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has$1.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

var parse = function (str, opts) {
    var options = opts ? utils.assign({}, opts) : {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults$1.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults$1.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults$1.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults$1.decoder;
    options.allowDots = typeof options.allowDots === 'undefined' ? defaults$1.allowDots : !!options.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults$1.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults$1.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults$1.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults$1.strictNullHandling;

    if (typeof options.charset !== 'undefined' && options.charset !== 'utf-8' && options.charset !== 'iso-8859-1') {
        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    if (typeof options.charset === 'undefined') {
        options.charset = defaults$1.charset;
    }

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

var lib = {
    formats: formats,
    parse: parse,
    stringify: stringify_1
};

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

function encode$1(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams = void 0;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    Object.entries(params).forEach(function (_ref) {
      var _ref2 = slicedToArray(_ref, 2),
          key = _ref2[0],
          val = _ref2[1];

      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (is.Array(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      val.forEach(function (v) {
        if (is.Date(v)) {
          v = v.toISOString();
        } else if (is.PlainObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode$1(key) + '=' + encode$1(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

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
      appendMethods[method] = old ? compose(callback, old) : callback;
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


  var reqURL = method === 'get' ? buildURL(url, data, options.paramsSerializer) : url;

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

  if (options.contentType === 'formdata' && is.PlainObject(data)) {
    xhr.send(options.paramsSerializer(data));
  } else if (options.contentType === 'formdata') {
    xhr.send(data || null);
  } else if (options.contentType === 'json' && is.PlainObject(data)) {
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
    return lib.stringify(params, { arrayFormat: 'brackets' });
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

  if (is.String(method) && method) {
    options.method = method.toLowerCase();
  }

  if (is.PlainObject(headers)) {
    Object.assign(options.headers, headers);
  }

  if (is.Number(timeout) && isFinite(timeout)) {
    options.timeout = Math.max(0, timeout);
  }

  if (is.Function(ontimeout)) {
    options.ontimeout = ontimeout;
  }

  if (is.String(baseUrl) && baseUrl) {
    options.baseUrl = baseUrl;
  }

  if (is.String(url) && url) {
    options.url = url;
  }

  // 跨域带cookie
  options.withCredentials = !!withCredentials;

  // 跨域
  options.crossDomain = !!crossDomain;
  if (!options.crossDomain && options.headers['X-Requested-With'] === 'XMLHttpRequest') {
    delete options.headers['X-Requested-With'];
  }

  if (is.String(user) && user) {
    options.user = user;
    if (is.String(password)) {
      options.password = password;
    }
  }

  // 设置 accept
  if (!is.String(dataType)) {
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
  if (!is.String(dataType)) {
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
  if (!is.String(contentType)) {
    /* ignore */
  } else if (options.method !== 'get' && ['xml', 'json', 'text', 'formdata'].includes(contentType.toLowerCase())) {
    options.contentType = contentType;
  }

  // 如果是PlainObject就浅克隆
  if (data) {
    // options.data = is.PlainObject( data ) ? Object.assign({}, data ) : data;
    options.data = data;
  }

  if (is.Object(headers)) {
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

  if (is.Function(validateStatus)) {
    options.validateStatus = validateStatus;
  }

  if (is.Array(transformResponse)) {
    options.transformResponse = transformResponse;
  }

  if (is.Array(transformRequest)) {
    options.transformRequest = transformRequest;
  }

  if (is.Function(paramsSerializer)) {
    options.paramsSerializer = paramsSerializer;
  }

  if (is.Function(onUploadProgress)) {
    options.onUploadProgress = onUploadProgress;
  }

  if (is.Function(onDownloadProgress)) {
    options.onDownloadProgress = onDownloadProgress;
  }

  invariant_1(options.url || options.baseUrl, 'Url or BaseUrl must be a non-empty string.');

  return options;
}

function ajax(options) {
  return connection(options.method, options.baseUrl + options.url, options.data, options);
}

var ajaxXhr = compose(ajax, getOption);

var isDev = "development" === 'development';

function log(level, message) {
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (isDev) {
    /* eslint-disable no-console */
    if (typeof window === 'undefined') {
      console.log(' ' + message + '\n' + (error && error.stack || error));
    } else {
      var _console;

      (_console = console)[level].apply(_console, toConsumableArray([message].concat(error ? ['\n', error] : [])));
    }
  }
}

function property(propertyName) {
  return function (obj) {
    return obj[propertyName];
  };
}

var ajaxSymbol = Symbol('ajax');
var ajaxHandler = Symbol('ajaxHandler');
var isAjax = property(ajaxSymbol);
var methods = ['ajax', 'get', 'post', 'put', 'delete', 'head', 'options', 'patch', 'trace'];
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
  globalOptions: {},

  mergeOptions: function mergeOptions() {
    for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
      options[_key] = arguments[_key];
    }

    return options.reduce(function (lastOption, option) {
      var objectKeys = Object.keys(lastOption).filter(function (key) {
        return is.PlainObject(lastOption[key]);
      });
      objectKeys.forEach(function (key) {
        var obj = option[key];
        if (is.PlainObject(obj)) {
          option[key] = globalMap.mergeOptions(lastOption[key], obj);
        }
      });
      return Object.assign(lastOption, option);
    }, {});
  },
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
  },
  setGlobalOptions: function setGlobalOptions(options) {
    globalMap.globalOptions = globalMap.mergeOptions(globalMap.globalOptions, options);
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
  for (var _len2 = arguments.length, objs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    objs[_key2 - 1] = arguments[_key2];
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
      var _ref9 = slicedToArray(_ref8, 2),
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
  var chainMethod = (_chainMethod = {}, defineProperty(_chainMethod, ajaxSymbol, true), defineProperty(_chainMethod, 'then', function then(callback) {
    handlerThen = handlerThen ? composeWithResult(callback, handlerThen) : callback;
  }), defineProperty(_chainMethod, 'catch', function _catch(callback) {
    handlerCatch = handlerCatch ? composeWithResult(callback, handlerCatch) : callback;
  }), defineProperty(_chainMethod, 'always', function always(callback) {
    chainMethod.then(function () {
      for (var _len3 = arguments.length, results = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        results[_key3] = arguments[_key3];
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
    var chain = new Promise(function (resolve, reject) {
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
          for (var _len4 = arguments.length, result = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            result[_key4] = arguments[_key4];
          }

          return ajaxHandler.apply(undefined, result)['finally'](function () {
            for (var _len5 = arguments.length, rs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
              rs[_key5] = arguments[_key5];
            }

            return finallys.apply(undefined, result.concat(rs));
          });
        } : function () {
          for (var _len6 = arguments.length, result = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            result[_key6] = arguments[_key6];
          }

          return Ajax(options)['finally'](function () {
            for (var _len7 = arguments.length, rs = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
              rs[_key7] = arguments[_key7];
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
    for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
      args[_key8 - 1] = arguments[_key8];
    }

    var prev = next;
    var needLastResults = [].concat(methods, ['then', 'always', 'finally']).includes(funcName);
    var nextArgs = args.length === 1 && is.Function(args[0]) && needLastResults ? function (result) {
      var _args$;

      return [(_args$ = args[0]).bind.apply(_args$, [undefined].concat(toConsumableArray(result)))];
    } : function () {
      return args;
    };
    next = function next() {
      var _prev;

      for (var _len9 = arguments.length, result = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        result[_key9] = arguments[_key9];
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
      if (is.Function(options)) {
        var ajax = options();
        invariant_1(isAjax(ajax), 'Function of ajax() expecting a ajax-object be returned.');
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
    invariant_1(isAjax(ajaxObject), 'Function of ajax() expecting a ajax-object be returned.');
    getNextXhrs = ajaxObject.getXhr;
  }

  function connection() {

    if (sending) return;

    var xhrs = setXhrs();
    if (handlerBefore) {
      handlerBefore.apply(undefined, toConsumableArray(xhrs));
    }

    sending = Promise.all(xhrs).then(function () {
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
        handlerCatch(err);
      }
    }).then(function () {
      if (handlerFinally) {
        handlerFinally();
      }
    });
  }

  // ajax methods
  methods.forEach(function (method) {
    chainMethod[method] = compose(function (options) {
      if (createAjax(options, method === 'ajax' ? options.method : method)) {
        return chainMethod;
      }
      return object_pick$1(chainMethod, methods);
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
  [].concat(methods, ['before', 'then', 'catch', 'always', 'finally']).forEach(function (func) {
    var body = chainMethod[func];
    chainMethod[func] = function () {
      for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      if (next) {
        append.apply(undefined, [func].concat(args));
        return chainMethod;
      }
      return body.apply(undefined, args);
    };
  });

  // success === done === then && error === fail === catch
  // chainMethod.success =
  // chainMethod.done = chainMethod.then;
  // chainMethod.error =
  // chainMethod.fail = chainMethod.catch;

  // init
  return chainMethod.ajax(url, globalMap.mergeOptions(globalMap.globalOptions, options));
}

Object.assign(Ajax, object_pick$1(globalMap, ['setURLTokens', 'setURLAlias', 'setDataTransform', 'setAssert', 'setGlobalOptions', 'mergeOptions']), {
  getURL: URLFormat
});

return Ajax;

})));

/*!
 * version : prod-momo/0.3.5.1
 * build on : Wed Jul 17 2024 18:26:57 GMT+0800 (CST)
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/webpack/buildin/global.js":
/*!*************************************************!*\
  !*** ../node_modules/webpack/buildin/global.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "../node_modules/yaku/lib/yaku.core.js":
/*!*********************************************!*\
  !*** ../node_modules/yaku/lib/yaku.core.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
/**
 * This is the minimal implementation of Yaku.
 * No extra helper methods.
 */

(function () {
    "use strict";

    var $undefined
    , $null = null
    , isBrowser = typeof window === "object"
    , root = isBrowser ? window : global
    , nativePromise = root.Promise
    , process = root.process
    , Arr = Array

    , $rejected = 0
    , $resolved = 1
    , $pending = 2

    , $Symbol = "Symbol"
    , $iterator = "iterator"
    , $species = "species"
    , $speciesKey = $Symbol + "(" + $species + ")"
    , $return = "return"

    , $unhandled = "_uh"

    , $invalidThis = "Invalid this"
    , $invalidArgument = "Invalid argument"
    , $promiseCircularChain = "Chaining cycle detected for promise"
    , $rejectionHandled = "rejectionHandled"
    , $unhandledRejection = "unhandledRejection"

    , $tryCatchFn
    , $tryCatchThis
    , $tryErr = { e: $null }
    , $noop = function () {}

    , Symbol = root[$Symbol] || {}
    , nextTick = isBrowser ?
        function (fn) {
            nativePromise ?
                new nativePromise(function (resolve) { resolve(); }).then(fn) :
                setTimeout(fn);
        } :
        process.nextTick
    , speciesConstructor = function (O, D) {
        var C = O.constructor;

        return C ? (C[getSpecies()] || D) : D;
    }
    ;

    /**
     * This class follows the [Promises/A+](/* https://promisesaplus.com */) and
     * [ES6](/* http://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects */) spec
     * with some extra helpers.
     * @param  {Function} executor Function object with two arguments resolve, reject.
     * The first argument fulfills the promise, the second argument rejects it.
     * We can call these functions, once our operation is completed.
     */
    var Yaku = function Promise (executor) {
        var self = this,
            err;

        // "this._s" is the internal state of: pending, resolved or rejected
        // "this._v" is the internal value

        if (!isObject(self) || self._s !== $undefined)
            throw genTypeError($invalidThis);

        self._s = $pending;

        if (executor !== $noop) {
            if (!isFunction(executor))
                throw genTypeError($invalidArgument);

            err = genTryCatcher(executor)(
                genSettler(self, $resolved),
                genSettler(self, $rejected)
            );

            if (err === $tryErr)
                settlePromise(self, $rejected, err.e);
        }
    };

    Yaku["default"] = Yaku;

    extendPrototype(Yaku, {
        /**
         * Appends fulfillment and rejection handlers to the promise,
         * and returns a new promise resolving to the return value of the called handler.
         * @param  {Function} onFulfilled Optional. Called when the Promise is resolved.
         * @param  {Function} onRejected  Optional. Called when the Promise is rejected.
         * @return {Yaku} It will return a new Yaku which will resolve or reject after
         * @example
         * the current Promise.
         * ```js
         * var Promise = require('yaku');
         * var p = Promise.resolve(10);
         *
         * p.then((v) => {
         *     console.log(v);
         * });
         * ```
         */
        then: function then (onFulfilled, onRejected) {
            if (this._s === undefined) throw genTypeError();

            return addHandler(
                this,
                newCapablePromise(speciesConstructor(this, Yaku)),
                onFulfilled,
                onRejected
            );
        },

        /**
         * The `catch()` method returns a Promise and deals with rejected cases only.
         * It behaves the same as calling `Promise.prototype.then(undefined, onRejected)`.
         * @param  {Function} onRejected A Function called when the Promise is rejected.
         * This function has one argument, the rejection reason.
         * @return {Yaku} A Promise that deals with rejected cases only.
         * @example
         * ```js
         * var Promise = require('yaku');
         * var p = Promise.reject(new Error("ERR"));
         *
         * p['catch']((v) => {
         *     console.log(v);
         * });
         * ```
         */
        "catch": function (onRejected) {
            return this.then($undefined, onRejected);
        },

        /**
         * Register a callback to be invoked when a promise is settled (either fulfilled or rejected).
         * Similar with the try-catch-finally, it's often used for cleanup.
         * @param  {Function} onFinally A Function called when the Promise is settled.
         * It will not receive any argument.
         * @return {Yaku} A Promise that will reject if onFinally throws an error or returns a rejected promise.
         * Else it will resolve previous promise's final state (either fulfilled or rejected).
         * @example
         * ```js
         * var Promise = require('yaku');
         * var p = Promise.reject(new Error("ERR"));
         *
         * p['catch']((v) => {
         *     console.log(v);
         * });
         * ```
         */
        "finally": function (onFinally) {
            return this.then(function (val) {
                return Yaku.resolve(onFinally()).then(function () {
                    return val;
                });
            }, function (err) {
                return Yaku.resolve(onFinally()).then(function () {
                    throw err;
                });
            });
        },

        // The number of current promises that attach to this Yaku instance.
        _pCount: 0,

        // The parent Yaku.
        _pre: $null,

        // A unique type flag, it helps different versions of Yaku know each other.
        _Yaku: 1
    });

    /**
     * The `Promise.resolve(value)` method returns a Promise object that is resolved with the given value.
     * If the value is a thenable (i.e. has a then method), the returned promise will "follow" that thenable,
     * adopting its eventual state; otherwise the returned promise will be fulfilled with the value.
     * @param  {Any} value Argument to be resolved by this Promise.
     * Can also be a Promise or a thenable to resolve.
     * @return {Yaku}
     * @example
     * ```js
     * var Promise = require('yaku');
     * var p = Promise.resolve(10);
     * ```
     */
    Yaku.resolve = function resolve (val) {
        return isYaku(val) ? val : settleWithX(newCapablePromise(this), val);
    };

    /**
     * The `Promise.reject(reason)` method returns a Promise object that is rejected with the given reason.
     * @param  {Any} reason Reason why this Promise rejected.
     * @return {Yaku}
     * @example
     * ```js
     * var Promise = require('yaku');
     * var p = Promise.reject(new Error("ERR"));
     * ```
     */
    Yaku.reject = function reject (reason) {
        return settlePromise(newCapablePromise(this), $rejected, reason);
    };

    /**
     * The `Promise.race(iterable)` method returns a promise that resolves or rejects
     * as soon as one of the promises in the iterable resolves or rejects,
     * with the value or reason from that promise.
     * @param  {iterable} iterable An iterable object, such as an Array.
     * @return {Yaku} The race function returns a Promise that is settled
     * the same way as the first passed promise to settle.
     * It resolves or rejects, whichever happens first.
     * @example
     * ```js
     * var Promise = require('yaku');
     * Promise.race([
     *     123,
     *     Promise.resolve(0)
     * ])
     * .then((value) => {
     *     console.log(value); // => 123
     * });
     * ```
     */
    Yaku.race = function race (iterable) {
        var self = this
        , p = newCapablePromise(self)

        , resolve = function (val) {
            settlePromise(p, $resolved, val);
        }

        , reject = function (val) {
            settlePromise(p, $rejected, val);
        }

        , ret = genTryCatcher(each)(iterable, function (v) {
            self.resolve(v).then(resolve, reject);
        });

        if (ret === $tryErr) return self.reject(ret.e);

        return p;
    };

    /**
     * The `Promise.all(iterable)` method returns a promise that resolves when
     * all of the promises in the iterable argument have resolved.
     *
     * The result is passed as an array of values from all the promises.
     * If something passed in the iterable array is not a promise,
     * it's converted to one by Promise.resolve. If any of the passed in promises rejects,
     * the all Promise immediately rejects with the value of the promise that rejected,
     * discarding all the other promises whether or not they have resolved.
     * @param  {iterable} iterable An iterable object, such as an Array.
     * @return {Yaku}
     * @example
     * ```js
     * var Promise = require('yaku');
     * Promise.all([
     *     123,
     *     Promise.resolve(0)
     * ])
     * .then((values) => {
     *     console.log(values); // => [123, 0]
     * });
     * ```
     * @example
     * Use with iterable.
     * ```js
     * var Promise = require('yaku');
     * Promise.all((function * () {
     *     yield 10;
     *     yield new Promise(function (r) { setTimeout(r, 1000, "OK") });
     * })())
     * .then((values) => {
     *     console.log(values); // => [123, 0]
     * });
     * ```
     */
    Yaku.all = function all (iterable) {
        var self = this
        , p1 = newCapablePromise(self)
        , res = []
        , ret
        ;

        function reject (reason) {
            settlePromise(p1, $rejected, reason);
        }

        ret = genTryCatcher(each)(iterable, function (item, i) {
            self.resolve(item).then(function (value) {
                res[i] = value;
                if (!--ret) settlePromise(p1, $resolved, res);
            }, reject);
        });

        if (ret === $tryErr) return self.reject(ret.e);

        if (!ret) settlePromise(p1, $resolved, []);

        return p1;
    };

    // To support browsers that don't support `Object.defineProperty`.
    genTryCatcher(function () {
        Object.defineProperty(Yaku, getSpecies(), {
            get: function () { return this; }
        });
    })();

    // ********************** Private **********************

    Yaku._Yaku = 1;

    /**
     * All static variable name will begin with `$`. Such as `$rejected`.
     * @private
     */

    // ******************************* Utils ********************************

    function getSpecies () {
        return Symbol[$species] || $speciesKey;
    }

    function extendPrototype (src, target) {
        for (var k in target) {
            src.prototype[k] = target[k];
        }
        return src;
    }

    function isObject (obj) {
        return obj && typeof obj === "object";
    }

    function isFunction (obj) {
        return typeof obj === "function";
    }

    function isInstanceOf (a, b) {
        return a instanceof b;
    }

    function ensureType (obj, fn, msg) {
        if (!fn(obj)) throw genTypeError(msg);
    }

    /**
     * Wrap a function into a try-catch.
     * @private
     * @return {Any | $tryErr}
     */
    function tryCatcher () {
        try {
            return $tryCatchFn.apply($tryCatchThis, arguments);
        } catch (e) {
            $tryErr.e = e;
            return $tryErr;
        }
    }

    /**
     * Generate a try-catch wrapped function.
     * @private
     * @param  {Function} fn
     * @return {Function}
     */
    function genTryCatcher (fn, self) {
        $tryCatchFn = fn;
        $tryCatchThis = self;
        return tryCatcher;
    }

    /**
     * Generate a scheduler.
     * @private
     * @param  {Integer}  initQueueSize
     * @param  {Function} fn `(Yaku, Value) ->` The schedule handler.
     * @return {Function} `(Yaku, Value) ->` The scheduler.
     */
    function genScheduler (initQueueSize, fn) {
        /**
         * All async promise will be scheduled in
         * here, so that they can be execute on the next tick.
         * @private
         */
        var fnQueue = Arr(initQueueSize)
        , fnQueueLen = 0;

        /**
         * Run all queued functions.
         * @private
         */
        function flush () {
            var i = 0;
            while (i < fnQueueLen) {
                fn(fnQueue[i], fnQueue[i + 1]);
                fnQueue[i++] = $undefined;
                fnQueue[i++] = $undefined;
            }

            fnQueueLen = 0;
            if (fnQueue.length > initQueueSize) fnQueue.length = initQueueSize;
        }

        return function (v, arg) {
            fnQueue[fnQueueLen++] = v;
            fnQueue[fnQueueLen++] = arg;

            if (fnQueueLen === 2) nextTick(flush);
        };
    }

    /**
     * Generate a iterator
     * @param  {Any} obj
     * @private
     * @return {Object || TypeError}
     */
    function each (iterable, fn) {
        var len
        , i = 0
        , iter
        , item
        , ret
        ;

        if (!iterable) throw genTypeError($invalidArgument);

        var gen = iterable[Symbol[$iterator]];
        if (isFunction(gen))
            iter = gen.call(iterable);
        else if (isFunction(iterable.next)) {
            iter = iterable;
        }
        else if (isInstanceOf(iterable, Arr)) {
            len = iterable.length;
            while (i < len) {
                fn(iterable[i], i++);
            }
            return i;
        } else
            throw genTypeError($invalidArgument);

        while (!(item = iter.next()).done) {
            ret = genTryCatcher(fn)(item.value, i++);
            if (ret === $tryErr) {
                isFunction(iter[$return]) && iter[$return]();
                throw ret.e;
            }
        }

        return i;
    }

    /**
     * Generate type error object.
     * @private
     * @param  {String} msg
     * @return {TypeError}
     */
    function genTypeError (msg) {
        return new TypeError(msg);
    }

    // *************************** Promise Helpers ****************************

    /**
     * Resolve the value returned by onFulfilled or onRejected.
     * @private
     * @param {Yaku} p1
     * @param {Yaku} p2
     */
    var scheduleHandler = genScheduler(999, function (p1, p2) {
        var x, handler;

        // 2.2.2
        // 2.2.3
        handler = p1._s ? p2._onFulfilled : p2._onRejected;

        // 2.2.7.3
        // 2.2.7.4
        if (handler === $undefined) {
            settlePromise(p2, p1._s, p1._v);
            return;
        }

        // 2.2.7.1
        x = genTryCatcher(callHanler)(handler, p1._v);
        if (x === $tryErr) {
            // 2.2.7.2
            settlePromise(p2, $rejected, x.e);
            return;
        }

        settleWithX(p2, x);
    });

    var scheduleUnhandledRejection = genScheduler(9, function (p) {
        if (!hashOnRejected(p)) {
            p[$unhandled] = 1;
            emitEvent($unhandledRejection, p);
        }
    });

    function emitEvent (name, p) {
        var browserEventName = "on" + name.toLowerCase()
            , browserHandler = root[browserEventName];

        if (process && process.listeners(name).length)
            name === $unhandledRejection ?
                process.emit(name, p._v, p) : process.emit(name, p);
        else if (browserHandler)
            browserHandler({ reason: p._v, promise: p });
    }

    function isYaku (val) { return val && val._Yaku; }

    function newCapablePromise (Constructor) {
        if (isYaku(Constructor)) return new Constructor($noop);

        var p, r, j;
        p = new Constructor(function (resolve, reject) {
            if (p) throw genTypeError();

            r = resolve;
            j = reject;
        });

        ensureType(r, isFunction);
        ensureType(j, isFunction);

        return p;
    }

    /**
     * It will produce a settlePromise function to user.
     * Such as the resolve and reject in this `new Yaku (resolve, reject) ->`.
     * @private
     * @param  {Yaku} self
     * @param  {Integer} state The value is one of `$pending`, `$resolved` or `$rejected`.
     * @return {Function} `(value) -> undefined` A resolve or reject function.
     */
    function genSettler (self, state) {
        return function (value) {
            if (state === $resolved)
                settleWithX(self, value);
            else
                settlePromise(self, state, value);
        };
    }

    /**
     * Link the promise1 to the promise2.
     * @private
     * @param {Yaku} p1
     * @param {Yaku} p2
     * @param {Function} onFulfilled
     * @param {Function} onRejected
     */
    function addHandler (p1, p2, onFulfilled, onRejected) {
        // 2.2.1
        if (isFunction(onFulfilled))
            p2._onFulfilled = onFulfilled;
        if (isFunction(onRejected)) {
            if (p1[$unhandled]) emitEvent($rejectionHandled, p1);

            p2._onRejected = onRejected;
        }

        p1[p1._pCount++] = p2;

        // 2.2.6
        if (p1._s !== $pending)
            scheduleHandler(p1, p2);

        // 2.2.7
        return p2;
    }

    // iterate tree
    function hashOnRejected (node) {
        // A node shouldn't be checked twice.
        if (node._umark)
            return true;
        else
            node._umark = true;

        var i = 0
        , len = node._pCount
        , child;

        while (i < len) {
            child = node[i++];
            if (child._onRejected || hashOnRejected(child)) return true;
        }
    }

    function callHanler (handler, value) {
        // 2.2.5
        return handler(value);
    }

    /**
     * Resolve or reject a promise.
     * @private
     * @param  {Yaku} p
     * @param  {Integer} state
     * @param  {Any} value
     */
    function settlePromise (p, state, value) {
        var i = 0
        , len = p._pCount;

        // 2.1.2
        // 2.1.3
        if (p._s === $pending) {
            // 2.1.1.1
            p._s = state;
            p._v = value;

            if (state === $rejected) {
                scheduleUnhandledRejection(p);
            }

            // 2.2.4
            while (i < len) {
                scheduleHandler(p, p[i++]);
            }
        }

        return p;
    }

    /**
     * Resolve or reject promise with value x. The x can also be a thenable.
     * @private
     * @param {Yaku} p
     * @param {Any | Thenable} x A normal value or a thenable.
     */
    function settleWithX (p, x) {
        // 2.3.1
        if (x === p && x) {
            settlePromise(p, $rejected, genTypeError($promiseCircularChain));
            return p;
        }

        // 2.3.2
        // 2.3.3
        if (x !== $null && (isFunction(x) || isObject(x))) {
            // 2.3.2.1
            var xthen = genTryCatcher(getThen)(x);

            if (xthen === $tryErr) {
                // 2.3.3.2
                settlePromise(p, $rejected, xthen.e);
                return p;
            }

            if (isFunction(xthen)) {
                // Fix /* https://bugs.chromium.org/p/v8/issues/detail?id=4162 */
                if (isYaku(x))
                    settleXthen(p, x, xthen);
                else
                    nextTick(function () {
                        settleXthen(p, x, xthen);
                    });
            } else
                // 2.3.3.4
                settlePromise(p, $resolved, x);
        } else
            // 2.3.4
            settlePromise(p, $resolved, x);

        return p;
    }

    /**
     * Try to get a promise's then method.
     * @private
     * @param  {Thenable} x
     * @return {Function}
     */
    function getThen (x) { return x.then; }

    /**
     * Resolve then with its promise.
     * @private
     * @param  {Yaku} p
     * @param  {Thenable} x
     * @param  {Function} xthen
     */
    function settleXthen (p, x, xthen) {
        // 2.3.3.3
        var err = genTryCatcher(xthen, x)(function (y) {
            // 2.3.3.3.3
            // 2.3.3.3.1
            x && (x = $null, settleWithX(p, y));
        }, function (r) {
            // 2.3.3.3.3
            // 2.3.3.3.2
            x && (x = $null, settlePromise(p, $rejected, r));
        });

        // 2.3.3.3.4.1
        if (err === $tryErr && x) {
            // 2.3.3.3.4.2
            settlePromise(p, $rejected, err.e);
            x = $null;
        }
    }

    try {
        module.exports = Yaku;
    } catch (e) {
        root.Yaku = Yaku;
    }
})();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./ad/banner.js":
/*!**********************!*\
  !*** ./ad/banner.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var mods = __webpack_require__(/*! ../mods */ "./mods.js");
var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");
var BaseAd = __webpack_require__(/*! ./base */ "./ad/base.js");
var TYPES = __webpack_require__(/*! ./types */ "./ad/types.js");
var util = __webpack_require__(/*! ./util */ "./ad/util.js");
var dom = __webpack_require__(/*! ../util/dom */ "./util/dom.js");

function BannerAd(space, channel) {
  if (!channel.content) {
    throw new AdcodeError(AdcodeError.TYPES.ILLEGAL_TEMPLATE, new Error(), {
      content: channel.content
    });
  }
  BaseAd.call(this, TYPES.BANNER, space, channel);
}

objects.inherit(BannerAd, BaseAd);

Object.assign(BannerAd.prototype, {
  _display$: function() {
    var ref = this.space.placement.ref;
    var position = this.space.placement.position;
    util.verifyPlacement(ref, position);

    var channel = this.channel;
    var width = channel.width;
    var height = channel.height;

    // shim ins element to align with legacy behavior
    if (ref === this.space.element && position === 'INNER') {
      ref.style.display = 'inline-block';
      ref.style.fontSize = 0;
      ref.style.width = width + 'px';
      ref.style.height = height + 'px';
    }

    // build iframe
    var iframe = dom.createFriendlyIframe();
    iframe.width = width + 'px';
    iframe.height = height + 'px';

    this._teardown = dom.placeNodes(ref, position, (this._elements = [iframe]));

    return dom.writeFriendlyIframe$(iframe, channel.content);
  }
});

mods.register('BannerAd', BannerAd);

module.exports = BannerAd;


/***/ }),

/***/ "./ad/base.js":
/*!********************!*\
  !*** ./ad/base.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var fns = __webpack_require__(/*! ../util/functions */ "./util/functions.js");
var Component = __webpack_require__(/*! ../util/component */ "./util/component.js");
var uuidv4 = __webpack_require__(/*! ../util/uuidv4 */ "./util/uuidv4.js");

function BaseAd(type, space, channel) {
  Component.call(this, 'ad');
  this.uuid = uuidv4();
  this.type = type;
  this.space = space;
  this.channel = channel;
  // TODO: link channel.ad = this here
};

objects.inherit(BaseAd, Component);

Object.assign(BaseAd.prototype, {
  // API //
  display$: function() {
    var self = this;
    return this._display$()
      .then(function() {
        // TODO: refactor this, let _display$ return boolean: filled
        self._displayed = true;
        self._emitter.emit('display');
        if (self._empty) {
          self._emitter.emit('empty');
        }
      });
  },
  destroy: function() {
    this._emitter.emit('destroy'); // emit first, so handler can still access most part of ad
    this._destroy();
    this._emitter.clear();
    this._view = this._emitter = undefined;
    this._destroyed = true;
  },
  error: function(err) {
    this._emitter.emit('error', err);
  },

  /*
   * Subclass should implement this method.
   * When the returned Promise is resolved, the space will start to monitor viewability.
   */
  _display$: fns.unimplemented,
  /*
   * Subclass should call this method on empty ad result
   */
  _doEmpty: function() {
    // TODO: refactor this
    if (this._empty) {
      return;
    }
    this._empty = true;
    // normally we emit after _display$ resolution, but in case DISPLAY has passed, we emit it right away
    if (this._displayed) {
      this._emitter.emit('empty');
    }
  },
  _destroy: function() {
    try {
      this._teardown && this._teardown();
    } catch(e) {}
  }
});

// API //
Object.defineProperties(BaseAd.prototype, {
  elements: {
    get: function() {
      var elements = this._element || this._elements;
      // distinguish undefined and empty array
      return elements && objects.asArray(elements);
    }
  },
  empty: {
    get: function() {
      return !!this._empty;
    }
  },
  filled: {
    get: function() {
      return !this._empty;
    }
  },
  displayed: {
    get: function() {
      return !!this._displayed;
    }
  },
  destroyed: {
    get: function() {
      return !!this._destroyed;
    }
  }
});

module.exports = BaseAd;


/***/ }),

/***/ "./ad/index.js":
/*!*********************!*\
  !*** ./ad/index.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var BannerAd = __webpack_require__(/*! ./banner */ "./ad/banner.js");
var NativeAd = __webpack_require__(/*! ./native */ "./ad/native.js");

function select(channel) {
  switch (channel.modType) {
  case 'asiamax':
    switch (channel.adType) {
    case 'banner':
      return BannerAd;
    case 'native':
      return NativeAd;
    }
    break;
  }
  return undefined;
}

module.exports = {
  select: select
};


/***/ }),

/***/ "./ad/native.js":
/*!**********************!*\
  !*** ./ad/native.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var mods = __webpack_require__(/*! ../mods */ "./mods.js");
var dom = __webpack_require__(/*! ../util/dom */ "./util/dom.js");
var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");
var BaseAd = __webpack_require__(/*! ./base */ "./ad/base.js");
var TYPES = __webpack_require__(/*! ./types */ "./ad/types.js");
var util = __webpack_require__(/*! ./util */ "./ad/util.js");
var http = __webpack_require__(/*! ../util/http */ "./util/http.js");

function NativeAd(space, channel) {
  if (!channel.content) {
    throw new AdcodeError(AdcodeError.TYPES.ILLEGAL_TEMPLATE, new Error(), {
      content: channel.content
    });
  }
  BaseAd.call(this, TYPES.NATIVE, space, channel);
}

objects.inherit(NativeAd, BaseAd);

Object.assign(NativeAd.prototype, {
  _display$: function() {
    var ref = this.space.placement.ref;
    var position = this.space.placement.position;
    util.verifyPlacement(ref, position);

    var content = this.content || this.channel.content;
    var elements = this._elements = dom.buildElementsFromHtml(content, this.channel.deepInto);

    var withoutScriptElements = elements.filter((e) => {
      return e.nodeName !== 'SCRIPT';
    });
    var scriptTags = elements.filter((e) => {
      return e.nodeName === 'SCRIPT';
    });

    this._teardown = dom.placeNodes(ref, position, withoutScriptElements);

    // 執行 script tag
    scriptTags.forEach((e) => {
      if (e.src) { // 載入 js
        http.loadJS$(e.src);
      }
      if (e.innerHTML) { // 執行 js
        eval(e.innerHTML);
      };
    });

    return Promise.resolve();
  }
});

mods.register('NativeAd', NativeAd);

module.exports = NativeAd;


/***/ }),

/***/ "./ad/types.js":
/*!*********************!*\
  !*** ./ad/types.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  NATIVE: 'native',
  BANNER: 'banner'
};


/***/ }),

/***/ "./ad/util.js":
/*!********************!*\
  !*** ./ad/util.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");

function verifyPlacement(ref, position) {
  // TODO: shall we verify other cases as well?
  if (!ref.parentNode) {
    switch (position) {
    case 'REPLACE':
    case 'REPLACE_HIDE':
    case 'BEFORE':
    case 'AFTER':
      throw new AdcodeError(AdcodeError.TYPES.TARGET_DETACHED);
    }
  }
}

module.exports = {
  verifyPlacement: verifyPlacement
};


/***/ }),

/***/ "./adcodeError.js":
/*!************************!*\
  !*** ./adcodeError.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

var PER_MILLE = 0.001;
var PER_CENT = 0.01;

function AdcodeError(type, cause, context) {
  this._adcode = true;
  this.type = type || AdcodeError.TYPES.GENERAL_ERROR;
  this.cause = cause;
  this.context = context || {};
  var code = Number(this.type.code);
  this.isWarning = code >= 700 && code < 800; // eslint-disable-line no-magic-numbers
  this.isUserError = code >= 800 && code < 900; // eslint-disable-line no-magic-numbers
}

AdcodeError.isAdcodeError = function(err) {
  return err && err._adcode === true;
};

AdcodeError.prototype.toString = function() {
  var contextString = '';
  if (this.context && Object.keys(this.context).length > 0) {
    try {
      contextString = ' ' + JSON.stringify(this.context);
    } catch(e) {}
  }
  return '[' + this.type.code + '] ' + this.type.message + contextString;
};

AdcodeError.TYPES = {
  SPACE_ELEMENT_NOT_FOUND: {
    code: '101',
    message: 'Space element not found',
    sampling: PER_MILLE
  },
  INVALID_AD_TAG: {
    code: '102',
    message: 'Invalid ad tag',
    sampling: PER_MILLE
  },
  INVALID_PRODUCT_TYPE: {
    code: '103',
    message: 'Invalid product type',
    sampling: PER_MILLE
  },
  AD_REQUEST_FAILURE: {
    code: '104',
    message: 'Ad request failure'
  },
  PLAN_REQUEST_FAILURE: {
    code: '105',
    message: 'Plan request failure'
  },
  SPACE_SETTING_REQUEST_FAILURE: {
    code: '106',
    message: 'Space setting request failure'
  },
  /* // shall be handled by server
  UNMATCHED_ID_AND_PRODUCT_TYPE: {
    code: '201',
    message: 'Unmatched id and product type',
    sampling: PER_MILLE
  },
  */
  INVALID_SSP_AD_RESPONSE: {
    code: '202',
    message: 'Invalid SSP ad response'
  },
  DETACHED_IFRAME_CONTAINER: {
    code: '203',
    message: 'Detached iframe container'
  },
  INVALID_SSP_PLAN_RESPONSE: {
    code: '204',
    message: 'Invalid SSP plan response'
  },
  RENDERING_ERROR: {
    code: '300',
    message: 'Rendering error',
    sampling: PER_MILLE
  },
  INVALID_BANNER_IFRAME_MESSAGE_FORMAT: {
    code: '302',
    message: 'Invalid banner iframe message format'
  },
  INVALID_AD_CONTAINER_TEMPLATE: {
    code: '303',
    message: 'Invalid ad container template'
  },
  TARGET_DETACHED: {
    code: '305',
    message: 'Target element has been detached from parent'
  },
  ILLEGAL_TEMPLATE: {
    code: '306',
    message: 'Template format is illegal or content is empty',
    sampling: PER_MILLE
  },
  TRACKER_ERROR: {
    code: '400',
    message: 'Tracker error'
  },
  INVALID_TRACKER_URL_FORMAT: {
    code: '401',
    message: 'Invalid tracker URL format'
  },
  USE_OF_DEPRECATED_FEATURE: {
    code: '700',
    message: 'Use of deprecated feature',
    sampling: PER_MILLE
  },
  USE_OF_HIDDEN_FIF: {
    code: '701',
    message: 'Use of data-rmax-hidden-fif attribute',
    sampling: PER_MILLE
  },
  MOLECULAR_SETUP_SCRIPT_ERROR: {
    code: '701',
    message: 'Error in molecular ad setup script'
  },
  MOLECULAR_MAIN_SCRIPT_ERROR: {
    code: '702',
    message: 'Error in molecular ad main script'
  },
  MOLECULAR_CUSTOM_ERROR: {
    code: '703',
    message: 'Error reported by molecular ad setup/main script'
  },
  MOLECULAR_CUSTOM_SCRIPT_ERROR: {
    code: '704',
    message: 'Custom script loading error / None existing custom script'
  },
  // error by extension, shall notify user even in production
  HOOK_HANDLER_ERROR: {
    code: '800',
    message: 'Hook handler error',
    sampling: PER_CENT
  },
  // unknown error, general error
  GENERAL_ERROR: {
    code: '900',
    message: 'General error'
  },
  MODULE_ERROR: {
    code: '901',
    message: 'Module error'
  }
};

module.exports = AdcodeError;


/***/ }),

/***/ "./banned.js":
/*!*******************!*\
  !*** ./banned.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),

/***/ "./constants.js":
/*!**********************!*\
  !*** ./constants.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

// TODO: we may disband these as well
module.exports = {
  IMPRESSION_THRESHOLD: 0.01,
  IMPRESSION_TIMEOUT: 10, // ms

  VIEWABLE_THRESHOLD: 0.5,
  VIEWABLE_TIMEOUT: 1000, // ms
  THROTTLE_INTERVAL: 250 // ms
};


/***/ }),

/***/ "./entry/core/base.js":
/*!****************************!*\
  !*** ./entry/core/base.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! src/plugin/legacy-hooks */ "./plugin/legacy-hooks.js");
__webpack_require__(/*! src/plugin/demo */ "./plugin/demo.js");

__webpack_require__(/*! src/patch */ "./patch/index.js");


/***/ }),

/***/ "./entry/core/display.js":
/*!*******************************!*\
  !*** ./entry/core/display.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rmaxads = __webpack_require__(/*! src/rmaxads.singleton */ "./rmaxads.singleton.js");
var TYPES = __webpack_require__(/*! src/space/types */ "./space/types.js");

var UniversalSpace = __webpack_require__(/*! src/space/universal */ "./space/universal.js");
var UniversalGroupedAdService = __webpack_require__(/*! src/service/universal-grouped.v3 */ "./service/universal-grouped.v3.js");

rmaxads.register(TYPES.DISPLAY_GROUPED, {
  selector: '.rmax[data-rmax-group-id]',
  spaceModule: UniversalSpace
});

rmaxads.register(TYPES.DISPLAY, {
  selector: '.rmax, .rmax-universal',
  spaceModule: UniversalSpace
});

rmaxads.service.registerModule(
  UniversalGroupedAdService,
);


/***/ }),

/***/ "./entry/core/kickoff.js":
/*!*******************************!*\
  !*** ./entry/core/kickoff.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rmaxads = __webpack_require__(/*! src/rmaxads.singleton */ "./rmaxads.singleton.js");
rmaxads.autoStart();


/***/ }),

/***/ "./entry/standard.js":
/*!***************************!*\
  !*** ./entry/standard.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./core/base */ "./entry/core/base.js");
__webpack_require__(/*! ./core/display */ "./entry/core/display.js");
__webpack_require__(/*! ./core/kickoff */ "./entry/core/kickoff.js");


/***/ }),

/***/ "./events.js":
/*!*******************!*\
  !*** ./events.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

var BASIC = {
  REQUEST: 'request',
  IMPRESSION: 'impression',
  NO_FILL: 'noFill',
  VIEWABLE: 'viewable',
  CLICK: 'click',
  VISIBLE: 'visible',
  SCRIPT: 'script'
};

module.exports = Object.freeze(Object.assign(
  BASIC
));


/***/ }),

/***/ "./mods.js":
/*!*****************!*\
  !*** ./mods.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports) {

var mods = {};
var shimmers = {};

function register(name, mod) {
  if (mods[name]) {
    return;
  }
  mods[name] = mod;
  (shimmers[name] || []).forEach(function(fn) {
    fn(mod);
  });
}

function shim(name, fn) {
  if (mods[name]) {
    fn(mods[name]);
  } else {
    (shimmers[name] || (shimmers[name] = [])).push(fn);
  }
}

module.exports = {
  register: register,
  shim: shim
};


/***/ }),

/***/ "./patch/2023-08-21-momo-search-keyword.js":
/*!*************************************************!*\
  !*** ./patch/2023-08-21-momo-search-keyword.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-magic-numbers */
var mods = __webpack_require__(/*! ../mods */ "./mods.js");

function defaultEmpty(value) {
  return value === undefined ? '' : value;
}

function getUrlParams() {
  return decodeURI(location.search).substring(1).split('&').reduce(function(acc, str) {
    if (str) {
      var i = str.indexOf('=');
      acc[i < 0 ? str : str.substring(0, i)] = i < 0 ? true : str.substring(i + 1);
    }
    return acc;
  }, {});
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return undefined;
}

mods.shim('HttpAdService', function(HttpAdService) {
  var _getCommonParams = HttpAdService.prototype._getCommonParams;

  Object.assign(HttpAdService.prototype, {
    _getCommonParams: function(space) {
      var params = _getCommonParams.apply(this, arguments);
      var urlParam = getUrlParams();

      // 取得 url的 query value 帶到 ad request 的 params
      params['searchKeyword'] = defaultEmpty(urlParam['keyword']);
      // ecdmp js 會種 cookie 到 momoshop.com.tw
      params['_edvid'] = defaultEmpty(getCookie('_edvid'));
      params['_edcid'] = defaultEmpty(getCookie('_edcid'));

      return params;
    }
  });
});


/***/ }),

/***/ "./patch/index.js":
/*!************************!*\
  !*** ./patch/index.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./2023-08-21-momo-search-keyword */ "./patch/2023-08-21-momo-search-keyword.js");


/***/ }),

/***/ "./plugin/demo.js":
/*!************************!*\
  !*** ./plugin/demo.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mods = __webpack_require__(/*! ../mods */ "./mods.js");

function installCSS(window) {
  var doc = window.document;
  var head = doc.head;
  if (head.querySelector('#rmax-demo-style')) {
    return;
  }
  var style = doc.createElement('style');
  style.id = 'rmax-demo-style';
  style.innerHTML = '.rmax-highlight::before{content:"";position:absolute;top:0;bottom:0;left:0;right:0;z-index:99;pointer-events:none;border:4px solid rgba(255,0,0,0.8);}'; // eslint-disable-line max-len
  head.appendChild(style);

  try {
    var w = window.parent;
    if (w === window) {
      return;
    }
    installCSS(w);
  } catch (e) {}
}

installCSS(window);

function normalize(options) {
  options = options || {};
  if (typeof options === 'string') { // 指定素材
    options = {
      crid: options
    };
  }
  return options;
}

mods.shim('BaseSpace', function(BaseSpace) {
  var _getPlan$ = BaseSpace.prototype._getPlan$;

  Object.assign(BaseSpace.prototype, {
    _getPlan$: function(options) {
      var _self = this;
      var _plan$ = _getPlan$.apply(this, arguments);
      if (_self._mockedSspResp) {
        return _self._mockedSspResp;
      }

      if (!_self._demoPlanResp) {
        return _plan$;
      }

      return _plan$.then(function(plan) {
        Object.keys(_self._demoPlanResp).forEach(function(key) {
          plan[key] = _self._demoPlanResp[key];
        });

        return plan;
      });
    },
    demoPlanResp: function(options) {
      this._demoPlanResp = options;
      if (!this._demo) {
        this._demo = {};
      }
    },
    demo: function(options) {
      this._demo = normalize(options);
    },
    highlight: function(options) {
      options = options || {};
      var timeout = options.duration || 3000; // eslint-disable-line no-magic-numbers
      var scrollIntoView = options.scrollIntoView !== false;
      var elements = this.ad && this.ad.filled && this.ad.elements;
      var element = elements && elements[0];
      if (!element) {
        return;
      }
      var classList = elements[0].classList;
      if (classList.contains('rmax-highlight')) {
        return;
      }
      classList.add('rmax-highlight');
      scrollIntoView && element.scrollIntoView();
      setTimeout(function() {
        classList.remove('rmax-highlight');
      }, timeout);
    }
  });
});

mods.shim('HttpAdService', function(HttpAdService) {
  var _getPlanRequestPath = HttpAdService.prototype._getPlanRequestPath;
  var _getPlanRequestParams = HttpAdService.prototype._getPlanRequestParams;
  var _getAdRequestPath = HttpAdService.prototype._getAdRequestPath;

  Object.assign(HttpAdService.prototype, {
    _getPlanRequestPath: function(space) {
      var path = _getPlanRequestPath.apply(this, arguments);
      if (space._demo) {
        path = path.replace('/supply/v', '/supply/demo/v');
      }
      return path;
    },
    _getPlanRequestParams: function(space) {
      return Object.assign(_getPlanRequestParams.apply(this, arguments), space._demo);
    },
    _getAdRequestPath: function(space) {
      if (space._demo) {
        throw new Error('Demo space should only send plan request');
      }
      return _getAdRequestPath.apply(this, arguments);
    },
    _parsePlanResponse: function(space) {
      if (space._demo) {
        throw new Error('Demo space should only send plan request');
      }
      return _getAdRequestPath.apply(this, arguments);
    }
  });
});

mods.shim('UniversalGroupedAdService', function(UniversalGroupedAdService) {
  var _getPlanRequestParams = UniversalGroupedAdService.prototype._getPlanRequestParams;
  var _getPlanRequestPath = UniversalGroupedAdService.prototype._getPlanRequestPath;
  Object.assign(UniversalGroupedAdService.prototype, {
    _getPlanRequestPath: function(entries) {
      var path = _getPlanRequestPath.apply(this, arguments);
      for (var i = 0, len = entries.length, en; i < len && (en = entries[i]); i++) {
        if (en.space._demo) {
          path = path.replace('/supply/v', '/supply/demo/v');
          break;
        }
      }
      return path;
    },
    _getPlanRequestParams: function(entries) {
      // TODO: pass multiple demo params
      var demo;
      for (var i = 0, len = entries.length, en; i < len && (en = entries[i]); i++) {
        if (en.space._demo) {
          demo = en.space._demo;
          break;
        }
      }
      return Object.assign(_getPlanRequestParams.apply(this, arguments), demo);
    }
  });
});


mods.shim('NativeGroupedAdService', function(NativeGroupedAdService) {
  var _getPlanRequestParams = NativeGroupedAdService.prototype._getPlanRequestParams;
  var _getPlanRequestPath = NativeGroupedAdService.prototype._getPlanRequestPath;
  Object.assign(NativeGroupedAdService.prototype, {
    _getPlanRequestPath: function(entries) {
      var path = _getPlanRequestPath.apply(this, arguments);
      for (var i = 0, len = entries.length, en; i < len && (en = entries[i]); i++) {
        if (en.space._demo) {
          path = path.replace('/supply/v', '/supply/demo/v');
          break;
        }
      }
      return path;
    },
    _getPlanRequestParams: function(entries) {
      // TODO: pass multiple demo params
      var demo;
      for (var i = 0, len = entries.length, en; i < len && (en = entries[i]); i++) {
        if (en.space._demo) {
          demo = en.space._demo;
          break;
        }
      }
      return Object.assign(_getPlanRequestParams.apply(this, arguments), demo);
    }
  });
});


/***/ }),

/***/ "./plugin/legacy-hooks.js":
/*!********************************!*\
  !*** ./plugin/legacy-hooks.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

function id(value) {
  return value;
}

function normalizeOption(option) {
  if (option._processed) {
    return undefined;
  }
  option._processed = true;
  var normalized = {};
  var hasHook = false;
  for (var key in option) {
    if (Object.prototype.hasOwnProperty.call(option, key)) {
      var value = option[key];
      switch (key) {
      case 'id':
      case 'selector':
        normalized[key] = value;
        break;
      case 'onEmpty':
      case 'onNoAD':
        if (typeof value === 'function') {
          hasHook = true;
          normalized[key] = value;
        }
        break;
      }
    }
  }
  return hasHook ? normalized : undefined;
}

function normalizeOptions(options) {
  if (!Array.isArray(options)) {
    options = [options];
  }
  return options.map(normalizeOption).filter(id);
}

(function() {
  var options = window.rmaxSpaceOptions;
  if (!options || (typeof options !== 'object') && !Array.isArray(options)) {
    return;
  }

  options = normalizeOptions(options);
  if (!options.length) {
    return;
  }

  var rmaxads = window.rmaxads || (window.rmaxads = {});
  (rmaxads.cmd || (rmaxads.cmd = [])).push(function(rmaxads) {
    rmaxads.on('space', function(space) {
      options.forEach(function(option) {
        if (option.spaceId && option.spaceId !== space.spaceId) {
          return;
        }
        if (!option.spaceId && option.selector && !space.element.matches(option.selector)) {
          return;
        }
        option.onEmpty && space.on('empty', option.onEmpty);
        option.onNoAD && space.on('empty', option.onNoAD);
      });
    });
  });
})();


/***/ }),

/***/ "./polyfill/promise.js":
/*!*****************************!*\
  !*** ./polyfill/promise.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var LocalPromise = __webpack_require__(/*! yaku/lib/yaku.core */ "../node_modules/yaku/lib/yaku.core.js");

function isNative(fn) {
  return (/\{\s*\[native code\]\s*\}/).test('' + fn);
}

module.exports = isNative(window.Promise) ? window.Promise : LocalPromise;


/***/ }),

/***/ "./rmaxads.js":
/*!********************!*\
  !*** ./rmaxads.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var util = __webpack_require__(/*! ./util/common */ "./util/common.js");
var objects = __webpack_require__(/*! ./util/objects */ "./util/objects.js");
var url = __webpack_require__(/*! ./util/url */ "./util/url.js");
var dom = __webpack_require__(/*! ./util/dom */ "./util/dom.js");
var http = __webpack_require__(/*! ./util/http */ "./util/http.js");
var logger = __webpack_require__(/*! ./util/logger */ "./util/logger.js");
var tracker = __webpack_require__(/*! ./util/tracker */ "./util/tracker.js");
var Component = __webpack_require__(/*! ./util/component */ "./util/component.js");
var AdcodeError = __webpack_require__(/*! ./adcodeError */ "./adcodeError.js");
var AdService = __webpack_require__(/*! ./service */ "./service/index.js");

var BANNED = __webpack_require__(/*! ./banned */ "./banned.js");

// compatible with v1
var SPACE_ELEMENT_SELECTOR = (['.rmax', '.rmax-universal']
  .map(function(s) {
    return 'ins' + s + ':not([data-rmax-space-picked="true"])';
  })
  .join(','));

function RMaxADS(options) {
  Component.call(this, 'rmaxads');

  options = options || {};

  Object.defineProperty(this, 'initializedAt', {
    value: Date.now()
  });
  this.version = util.version;
  this._spaceModules = {};
  this.spaces = [];
  this._spaceIndices = {};
  this.service = new AdService(this);
  this.selectors = [];

  // global properties
  this.lang = dom.getLang();
  this.referer = url.hostObject().hrefAsReferer;

  // ssp host
  this.sspHost = this.adHost = options.adHost && url.normalizeHost(options.adHost) || 'prod';

  // version
  tracker.setVersion(this._buildVersion());

  // cmd
  var wrapCmd = this._hookctx.wrap.bind(this._hookctx, 'cmd');
  var self = this;
  var execCmd = function(callback) {
    if (typeof callback === 'function') {
      wrapCmd(callback)(self);
    }
  };
  // handle future cmd push
  Object.defineProperty(this, 'cmd', {
    value: Object.freeze({
      push: execCmd
    })
  });
  // run existing cmd
  if (options.cmd && Array.isArray(options.cmd)) {
    options.cmd.forEach(execCmd);
  }

  this._emit('initialize');
  this._init();
}

objects.inherit(RMaxADS, Component);

Object.assign(RMaxADS.prototype, {
  _init: function() {},
  // start //
  start: function() {
    // create spaces
    this._emit('before-create-spaces');
    var spaces = this._createSpaces();
    this._emit('create-spaces', spaces);

    // start spaces
    var results$ = spaces.map(this.startSpace.bind(this));
    this._emit('start-spaces', spaces);

    return Promise.all(results$);
  },

  _buildVersion: function() {
    return (this.version || 'unknown (no window.rmaxads.version)') + (this.isDev ? '/dev' : '');
  },
  _createSpaces: function() {
    var elements = this._scanElements();
    var spaces = [];
    for (var i = 0, len = elements.length, element; i < len; i++) {
      element = elements[i];
      try {
        spaces.push(this.createSpace(element));
        element.setAttribute('data-rmax-space-picked', 'true');
      } catch (err) {
        // this happens when we mix universal/standard builds in the same window and it's expected bahavior
      }
    }
    return spaces;
  },
  _scanElements: function() {
    if (document.querySelectorAll('ins.rmax-universal:not([data-rmax-space-picked="true"])').length !== 0) {
      var list = document.querySelectorAll('ins.rmax-universal:not([data-rmax-space-picked="true"])');
      var spaceIds = [];
      for (var i = 0; i < list.length; ++i) {
        var spaceId = list[i].getAttribute('data-rmax-space-id') || list[i].getAttribute('rmax-space-id');
        if (!spaceIds.includes(spaceId)) {
          spaceIds.push(spaceId);
        }
      }

      http.log('.rmax-universal', {
        'spaceId': spaceIds
      });
    }

    return Array.prototype.filter.call(
      document.querySelectorAll(SPACE_ELEMENT_SELECTOR),
      this._filterElement.bind(this));
  },
  _filterElement: function(element) {
    var spaceId = element.getAttribute('data-rmax-space-id');
    if (BANNED[spaceId]) {
      // TODO: offer a checkpoint
      return false;
    }
    return true;
  },
  createSpace: function(element) {
    // TODO: idempotent?
    if (!element) {
      throw new Error('Element is required.');
    }
    var type = this._getTypeFromElement(element);
    if (!type) {
      throw new Error('Can not determine space type.');
    }
    var SpaceModule = this._spaceModules[type];
    if (!SpaceModule) {
      throw new AdcodeError(AdcodeError.TYPES.MODULE_ERROR, new Error('Unrecognized space type: ' + type));
    }

    var space = new SpaceModule(this, element);
    this.spaces.push(space);

    var spaceId = space.spaceId;
    space.spaceIndex = this._spaceIndices[spaceId] =
      this._spaceIndices[spaceId] === undefined ? 0 : (this._spaceIndices[spaceId] + 1);

    this._emit('space', space);

    return space;
  },
  _getTypeFromElement: function(element) {
    var type;

    var found = this.selectors.find(function(item) {
      return element.matches(item.selector);
    });

    type = found && found.type;

    return type;
  },
  startSpace: function(space) {
    // idempotent
    if (space.started) {
      return Promise.resolve();
    }
    try {
      return space.start$()
        .catch(function() {});
    } catch (err) {
      return Promise.resolve();
    }
  },

  // register //
  register: function(type, options) {
    if (!options) {
      throw new Error('invalid RMAXADS register arguments');
    }
    var spaceModule = options.spaceModule;
    var selector = options.selector;

    this.selectors.push({
      type: type,
      selector: selector
    });

    this._registerSpaceModule(type, spaceModule);
  },
  _registerSpaceModule: function(type, spaceModule) {
    if (!type) {
      throw new Error('Space type is required');
    }
    if (!spaceModule) {
      throw new Error('Space module is required');
    }
    // idempotent
    if (!this._spaceModules[type]) {
      this._spaceModules[type] = spaceModule;
    }
  },

  // util //
  log: function() {
    logger.log.apply(logger, arguments);
  },
  _get$: function(url) {
    return http.get$(url, true);
  }
});

module.exports = RMaxADS;


/***/ }),

/***/ "./rmaxads.singleton.js":
/*!******************************!*\
  !*** ./rmaxads.singleton.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var RMaxADS = __webpack_require__(/*! ./rmaxads */ "./rmaxads.js");

function _createRMaxADS() {
  // options
  var cmd = window.rmaxads && window.rmaxads.cmd;
  var options = Object.assign({
    adHost: window.overrideSupplyAdsHost // compatible with v1
  }, cmd && {
    cmd: cmd
  }, window.rmaxOptions);

  var rmaxads = new RMaxADS(options);

  // patch auto start function
  var autoStart = !window.rmaxOptions || window.rmaxOptions.autoStart !== false; // default true
  rmaxads.autoStart = autoStart ?
    function() {
      return rmaxads.start();
    } :
    function() {
      return Promise.resolve();
    };

  return rmaxads;
}

module.exports = window.rmaxads && window.rmaxads.initializedAt !== undefined ?
  window.rmaxads : (window.rmaxads = _createRMaxADS());


/***/ }),

/***/ "./service/base.js":
/*!*************************!*\
  !*** ./service/base.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var mods = __webpack_require__(/*! ../mods */ "./mods.js");
var Component = __webpack_require__(/*! ../util/component */ "./util/component.js");

// space view //
function SpaceView(service, space) {
  this._service = service;
  this._space = space;
  service.registerSpace(space);
}

Object.assign(SpaceView.prototype, {
  // API //
  getPlan$: function() {
    return this._service.getPlan$(this._space);
  },
  getAsiaMaxAd$: function(channel) {
    return this._service.getAsiaMaxAd$(this._space, this._space.sessionId, channel);
  },
  error: function(err) {
    return this._service.error(this._space, err);
  },
  unregister: function() {
    this._service.unregisterSpace(this._space);
  },
  destroy: function() {
    this.unregister();
  }
});


// service //
function BaseAdService(rmaxads, type) {
  this._rmaxads = rmaxads;
  this.type = type;
  this._asiaMaxAdCache = {};
  Component.call(this, 'service');
}

BaseAdService.SpaceView = SpaceView;

objects.inherit(BaseAdService, Component);

Object.assign(BaseAdService.prototype, {
  // API //
  createSpaceView: function(space) {
    return new SpaceView(this, space);
  },
  // used by space view //
  getPlan$: function(/* space */) {
    throw new Error('Unimplemented');
  },
  getAsiaMaxAd$: function(space, sessionId, channel) {
    // look up in cache first
    var ad = this._getAsiaMaxAdFromCache(space);
    return ad ? Promise.resolve(ad) : this._requestAsiaMaxAd$(space, sessionId, channel);
  },
  error: function(space, err) {
    this._error(space, err, this._buildErrorContext(space));
  },
  registerSpace: function(/* space */) {},
  unregisterSpace: function(/* space */) {
    // TODO: deal with ad cache
  },
  destroy: function() {
    this._asiaMaxAdCache = undefined;
  },

  // internal //
  _requestAsiaMaxAd$: function(/* space, sessionId, channel */) {
    throw new Error('Unimplemented');
  },
  _getAsiaMaxAdFromCache: function(space) {
    return this._asiaMaxAdCache[space.uuid];
  },
  _saveAsiaMaxAdToCache: function(space, ad) {
    this._asiaMaxAdCache[space.uuid] = ad;
  },
  _processPlanChannels: function(response, space) {
    var channels = response.channels;
    channels = channels.map(this._processChannel.bind(this));
    channels = this._processPlanChannelsForAsiaMax(space, channels);
    channels = this._addChannelIndices(channels);
    return channels;
  },
  _processPlanChannelsForAsiaMax: function(space, channels) {
    if (channels.length === 1) {
      var channel = channels[0];
      if (channel.modType === 'asiamax') {
        this._saveAsiaMaxAdToCache(space, channel);
        return [{
          id: channel.id,
          modType: channel.modType,
          adType: channel.adType,
          subType: channel.subType,
          index: 0
        }];
      }
    }
    return channels;
  },
  _processChannel: function(channel) {
    return channel;
  },
  _addChannelIndices: function(channels) {
    for (var i = 0, len = channels.length; i < len; i++) {
      channels[i].index = i;
    }
    return channels;
  },
  _buildErrorContext: function(space) {
    return {
      spaceId: space.spaceId,
      spaceStatus: space.status,
      spaceType: space.type,
      sessionId: space.sessionId,
      spaceResult: space.result
    };
  },
  _error: function(/* space, err, context */) {
    throw new Error('Unimplemented');
  }
});

mods.register('BaseAdService', BaseAdService);

module.exports = BaseAdService;


/***/ }),

/***/ "./service/http.js":
/*!*************************!*\
  !*** ./service/http.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var mods = __webpack_require__(/*! ../mods */ "./mods.js");
var uuidv4 = __webpack_require__(/*! ../util/uuidv4 */ "./util/uuidv4.js");
var http = __webpack_require__(/*! ../util/http */ "./util/http.js");
var url = __webpack_require__(/*! ../util/url */ "./util/url.js");
var tracker = __webpack_require__(/*! ../util/tracker */ "./util/tracker.js");
var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");
var BaseAdService = __webpack_require__(/*! ./base */ "./service/base.js");

var PROD_SSP_HOST = '//https://sspap.momoshop.com.tw';
var UAT_SSP_HOST = '//https://uat-sspap.momoshop.com.tw';
var GAMMA_SSP_HOST = '//https://gamma-sspap.momoshop.com.tw';
var STAGE_SSP_HOST = '/* https://beta-sspap.momo.tenmax.tw */';
var DEV_SSP_HOST = '//http://localhost:58070';
var ERROR_TRACKING_API_PATH = '/supply/tracking/error';

// service //
function HttpAdService(rmaxads, type) {
  BaseAdService.call(this, rmaxads, type);
}

objects.inherit(HttpAdService, BaseAdService);
Object.assign(HttpAdService.prototype, {
  getPlan$: function(space) {
    var requestUrl = this._getPlanRequestUrl(space);
    var self = this;
    this._emit('plan-request', {
      'requestUrl': requestUrl,
      'space': space,
    });
    return this._get$(requestUrl)
      .catch(function(err) {
        // rethrow as PLAN_REQUEST_FAILURE
        throw new AdcodeError(AdcodeError.TYPES.PLAN_REQUEST_FAILURE, err, {
          requestUrl: requestUrl
        });
      })
      .then(function(responseString) {
        try {
          if (space.mockPlanResp) {
            responseString = JSON.stringify(space.mockPlanResp(JSON.parse(responseString)));
          }

          self._emit('plan-response', JSON.parse(responseString), space);

          return self._parsePlanResponse(responseString, space);
        } catch (err) {
          // rethrow as INVALID_SSP_PLAN_RESPONSE
          throw new AdcodeError(AdcodeError.TYPES.INVALID_SSP_PLAN_RESPONSE, err, {
            requestUrl: requestUrl
          });
        }
      });
  },
  _getApiHost: function(space) {
    var targetSpace = Array.isArray(space) ? space[0].space : space;
    var host = targetSpace.sspHost || this._rmaxads.sspHost || 'prod';

    switch (host || 'prod') {
    case 'prod':
      host = PROD_SSP_HOST;
      break;
    case 'stage':
      host = STAGE_SSP_HOST;
      break;
    case 'uat':
      host = UAT_SSP_HOST;
      break;
    case 'gamma':
      host = GAMMA_SSP_HOST;
      break;      
    case 'dev':
      host = DEV_SSP_HOST;
      break;
    }
    return url.normalizeHost(host);
  },
  _getApiUrl: function(host, path, params) {
    params.cacheBuster = uuidv4();
    return host + path + http.encodeQueryParams(params);
  },
  _getPlanRequestUrl: function(space) {
    return this._getApiUrl(this._getApiHost(space),
      this._getPlanRequestPath(space),
      this._getPlanRequestParams(space));
  },
  _getPlanRequestPath: function(space) {
    return this._planRequestPath;
  },
  _getPlanRequestParams: function(space) {
    var param = {
      rmaxSpaceId: space.spaceId
    };
    // 若 space 上面已經有 sessionId, 就把它當作 plan 參數
    if (space.sessionId) {
      param.sessionId = space.sessionId;
    }

    return Object.assign(param, this._getCommonParams(space));
  },
  _getCommonParams: function(space) {
    var insTag = space.element;
    var departmentCode = insTag.getAttribute('data-department-code');

    var sspProductNativeAdGroupType;
    if (window.momoWidget) {
      var widgetGroupId = insTag.getAttribute('data-rmax-group-id');
      if (window.momoWidget[widgetGroupId]) {
        sspProductNativeAdGroupType = window.momoWidget[widgetGroupId]['sspProductNativeAdGroupType'];
      }
    }

    // js-uuid 是 mobile01 提供的 Id, 未來其他家可能會不同
    var jsUuid = document.getElementById('js-uuid');
    var dataAdid;
    var dataUuid;
    if (jsUuid != null) {
      dataAdid = jsUuid.getAttribute('data-adid');
      dataUuid = jsUuid.getAttribute('data-uuid');
    }

    return objects.trim({
      referer: this._rmaxads.referer,
      lang: this._rmaxads.lang,
      bodyWidth: window.screen.width,
      bodyHeight: window.screen.height,
      deviceId: dataAdid,
      adGroupType: sspProductNativeAdGroupType,
      departmentCode: departmentCode,
      userId: dataUuid
    });
  },
  _parsePlanResponse: function( /* responseString, space */ ) {
    throw new Error('Unimplemented');
  },
  _requestAsiaMaxAd$: function(space, sessionId, channel) {
    var requestUrl = this._getAdRequestUrl(space, sessionId, channel);
    var self = this;
    this._emit('ad-request', requestUrl, space, sessionId, channel);
    return this._get$(requestUrl)
      .catch(function(err) {
        // rethrow as AD_REQUEST_FAILURE
        throw new AdcodeError(AdcodeError.TYPES.AD_REQUEST_FAILURE, err, {
          requestUrl: requestUrl
        });
      })
      .then(function(responseString) {
        self._emit('ad-response', responseString, space, sessionId, channel);
        try {
          return self._parseAdResponse(responseString, space, channel);
        } catch (err) {
          // rethrow as INVALID_SSP_AD_RESPONSE
          throw new AdcodeError(AdcodeError.TYPES.INVALID_SSP_AD_RESPONSE, err, {
            requestUrl: requestUrl
          });
        }
      });
  },
  _getAdRequestUrl: function(space, sessionId, channel) {
    return this._getApiUrl(this._getApiHost(space), this._getAdRequestPath(space, channel),
      this._getAdRequestParams(space, sessionId, channel));
  },
  _getAdRequestPath: function(space, channel) {
    return this._adRequestPath;
  },
  _getAdRequestParams: function(space, sessionId, channel) {
    var param = objects.trim({
      rmaxSpaceId: space.spaceId,
      subspaceId: channel.subspaceId,
      sessionId: sessionId,
      ts: space.sessionTs,
      id: channel.id,
      dealIds: channel.dealIds, // TODO: remove
      ics: channel.ics
    });

    Object.assign(param, this._getCommonParams(space));
    return param;
  },
  _parseAdResponse: function( /* responseString, space */ ) {
    throw new Error('Unimplemented');
  },
  _error: function(space, err, context) {
    var endpointUrl = this._getApiHost(space) + ERROR_TRACKING_API_PATH;
    tracker.error(endpointUrl, err, context);
  },
  _get$: function(url) {
    return this._rmaxads._get$(url);
  }
});

mods.register('HttpAdService', HttpAdService);

module.exports = HttpAdService;


/***/ }),

/***/ "./service/index.js":
/*!**************************!*\
  !*** ./service/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");
var Component = __webpack_require__(/*! ../util/component */ "./util/component.js");

function AdService(rmaxads) {
  Component.call(this, 'service');
  this._rmaxads = rmaxads;
  this._mods = [];
}

objects.inherit(AdService, Component);

Object.assign(AdService.prototype, {
  // API //
  registerModule: function() {
    var mods = this._mods;
    var self = this;
    Array.prototype.forEach.call(arguments, function(mod) {
      mods.push({
        mod: mod
      });
      if (mod.modName) {
        // TODO: we may want to keep constructors along prototype chain as well
        self[mod.modName] = mod;
      }
      self._emit('mod', mod);
    });
    return this;
  },
  createSpaceView: function(space) {
    var mod = this._getModule(space);
    return mod.createSpaceView(space);
  },
  destroy: function() {
    this._mods.forEach(function(en) {
      en.instance && en.instance.destroy();
      en.mod.destroy && en.mod.destroy();
    });
    this._mods = undefined;
  },

  _getModule: function(space) {
    var mods = this._mods;
    for (var i = 0, en, len = mods.length; i < len && (en = mods[i]); i++) {
      var mod = en.mod;
      if (mod.accept(space)) {
        return en.instance || (en.instance = new mod(this._rmaxads));
      }
    }
    throw new AdcodeError(AdcodeError.MODULE_ERROR,
      new Error('Cannot determine ad service module for space with type: ' + space.type));
  }
});

module.exports = AdService;


/***/ }),

/***/ "./service/json.js":
/*!*************************!*\
  !*** ./service/json.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var mods = __webpack_require__(/*! ../mods */ "./mods.js");
var HttpAdService = __webpack_require__(/*! ./http */ "./service/http.js");

// service //
function JsonAdService(rmaxads, type) {
  HttpAdService.call(this, rmaxads, type);
}

objects.inherit(JsonAdService, HttpAdService);

Object.assign(JsonAdService.prototype, {
  _parsePlanResponse: function(responseString, space) {
    return this._processPlanResponse(JSON.parse(responseString), space);
  },
  _processPlanResponse: function(response, space) {
    return {
      sessionId: response.sessionId,
      channels: this._processPlanChannels(response, space),
      align: response.align,
      trackers: response.trackers
    };
  },
  _parseAdResponse: function(responseString, space, channel) {
    return this._processAdResponse(JSON.parse(responseString), space, channel);
  },
  _processAdResponse: function(response, space, channel) {
    return this._processChannel(response);
  }
});

mods.register('JsonAdService', JsonAdService);

module.exports = JsonAdService;


/***/ }),

/***/ "./service/universal-grouped.v3.js":
/*!*****************************************!*\
  !*** ./service/universal-grouped.v3.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var mods = __webpack_require__(/*! ../mods */ "./mods.js");
var JsonAdService = __webpack_require__(/*! ./json */ "./service/json.js");
var TYPES = __webpack_require__(/*! ../space/types */ "./space/types.js");

function Request() {
  this._entries = [];
  this._pendingSpaceUuids = {};

  var self = this;
  this.result$ = new Promise(function(resolve, reject) {
    self._resolve = resolve;
    self._reject = reject;
  });
}

Object.defineProperty(Request.prototype, 'ready', {
  get: function() {
    return Object.keys(this._pendingSpaceUuids).length === 0;
  }
});

Object.defineProperty(Request.prototype, 'length', {
  get: function() {
    return Object.keys(this._pendingSpaceUuids).length + this._entries.length;
  }
});

Object.assign(Request.prototype, {
  register: function(space) {
    this._pendingSpaceUuids[space.uuid] = true;
  },
  unregister: function(space) {
    delete this._pendingSpaceUuids[space.uuid];
  },
  add$: function(space) {
    var entry = {
      space: space
    };
    var result$ = entry.result$ = new Promise(function(resolve, reject) {
      entry._resolve = resolve;
      entry._reject = reject;
    });
    this._entries.push(entry);
    this.unregister(space);
    return result$;
  },
  resolve: function(values) {
    for (var i = 0, len = this._entries.length; i < len; i++) {
      this._entries[i]._resolve(values[i]);
    }
  },
  reject: function(err) {
    for (var i = 0, len = this._entries.length; i < len; i++) {
      this._entries[i]._reject(err);
    }
  }
});

function RequestQueue(service, groupId) {
  this._service = service;
  this._groupId = groupId;

  this._request = new Request();
  this._requested = false;
  this._pending = false;
}

Object.assign(RequestQueue.prototype, {
  register: function(space) {
    if (this._requested) {
      throw new Error('Grouped request already sent');
    }
    this._request.register(space);
  },
  unregister: function(space) {
    if (this._requested) {
      return;
    }
    this._request.unregister(space);
    this._next();
  },
  getPlan$: function(space) {
    if (this._requested) {
      throw new Error('Grouped request already sent');
    }
    var result$ = this._request.add$(space);
    this._next();
    return result$;
  },
  _next: function() {
    if (this._requested || this._pending || !this._request.ready || this._request.length === 0) {
      return;
    }
    this._dispatch$();
  },
  _dispatch$: function() {
    this._pending = true;
    var request = this._request;
    var self = this;

    function teardown() {
      self._pending = false;
      self._requested = true;
    }

    this._service._dispatchPlanRequest$(request._entries)
      .then(function(res) {
        request.resolve(res);
        teardown();
      }, function(err) {
        request.reject(err);
        teardown();
      });
  }
});


// service //
function UniversalGroupedAdService(rmaxads) {
  JsonAdService.call(this, rmaxads, 'universal-grouped');
  this._planRequestPath = '/supply/v3/universal/grouped-plan';
  this._queue = {};
}

objects.inherit(UniversalGroupedAdService, JsonAdService);

Object.assign(UniversalGroupedAdService.prototype, {
  registerSpace: function(space) {
    this._getQueue(space.groupId).register(space);
  },
  unregisterSpace: function(space) {
    this._getQueue(space.groupId).unregister(space);
  },
  getPlan$: function(space) {
    return this._getQueue(space.groupId).getPlan$(space);
  },
  _processChannel: function(channel) {
    channel = JsonAdService.prototype._processChannel.apply(this, arguments);
    return channel;
  },
  _getQueue: function(groupId) {
    return this._queue[groupId] || (this._queue[groupId] = new RequestQueue(this, groupId));
  },
  _dispatchPlanRequest$: function(entries) {
    return JsonAdService.prototype.getPlan$.call(this, entries);
  },
  _getPlanRequestParams: function(entries) {
    var space0 = entries[0].space;

    var sessionIds = entries.map(function(en) {
      return en.space.sessionId;
    }).join(',');
    var spaceIds = entries.map(function(en) {
      return en.space.spaceId;
    }).join(',');

    // TODO: support click prefix
    return Object.assign({
      rmaxSpaceIds: spaceIds,
      sessionIds: sessionIds,
    }, this._getCommonParams(space0));
  },
  _processPlanResponse: function(response, entries) {
    var results = [];
    var terminate = false;
    // 檢查廣告是否不滿足最低數量
    if (window.momoWidget) {
      var insTag = entries[0].space.element;
      var widgetGroupId = insTag.getAttribute('data-rmax-group-id');
      var sspWidgetAdMinimumCnt = window.momoWidget[widgetGroupId]['sspWidgetAdMinimumCnt'];
      var sspWidgetAdSizeFn = window.momoWidget[widgetGroupId]['sspWidgetAdSizeFn'];
      if (sspWidgetAdMinimumCnt !== undefined) {
        var resProductSize = response.filter((r) => {
          return r.channels.length !== 0;
        }).length;
        var greaterThenMinimum = resProductSize >= sspWidgetAdMinimumCnt;
        if (!greaterThenMinimum) {
          // 若有設定廣告最低數量, 且低於最低數量就中斷
          terminate = true;
        }
        sspWidgetAdSizeFn(resProductSize);
      }
    }

    if (terminate) {
      return [];
    }
    for (var i = 0, len = response.length; i < len; i++) {
      results.push(JsonAdService.prototype._processPlanResponse.call(this, response[i], entries[i].space));
    }
    return results;
  },
  _requestAsiaMaxAd$: function() {
    throw new Error();
  }
});

UniversalGroupedAdService.accept = function(space) {
  return space.type === TYPES.DISPLAY_GROUPED;
};

mods.register('UniversalGroupedAdService', UniversalGroupedAdService);

module.exports = UniversalGroupedAdService;


/***/ }),

/***/ "./space/abstract.js":
/*!***************************!*\
  !*** ./space/abstract.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var functions = __webpack_require__(/*! ../util/functions */ "./util/functions.js");
var promises = __webpack_require__(/*! ../util/promises */ "./util/promises.js");
var uuidv4 = __webpack_require__(/*! ../util/uuidv4 */ "./util/uuidv4.js");
var extractUuidTs = __webpack_require__(/*! ../util/uuidv1-ts */ "./util/uuidv1-ts.js");
var Component = __webpack_require__(/*! ../util/component */ "./util/component.js");
var http = __webpack_require__(/*! ../util/http */ "./util/http.js");
var STATUS = __webpack_require__(/*! ./status */ "./space/status.js");
var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");

function AbstractSpace(master, type) {
  if (!master) {
    throw new Error('Master object is required');
  }
  if (!type) {
    throw new Error('Space type is required');
  }
  Component.call(this, 'space');

  this.initializedAt = Date.now();
  this.uuid = uuidv4();
  this.rmaxads = this.master = master; // TODO: deprecate rmaxads property
  this.type = type;
  this.currentScript = document.currentScript;

  this._init();

  // we need attributes to determine the right service type
  this.service = master.service.createSpaceView(this);

  this._setStatus(STATUS.INITIALIZED);
}

objects.inherit(AbstractSpace, Component);

Object.assign(AbstractSpace.prototype, {
  // attributes API //
  /*
  get: function(name) {
    return this.attributes.get(name);
  },
  set: function(name, value) {
    this.attributes.set(name, value);
  },
  */
  // workflow //
  _init: functions.nop,
  start$: function() { // eslint-disable-line consistent-return
    if (this.startedAt !== undefined) {
      return Promise.resolve(); // idempotent: ignore already started space
    }
    try {
      this.startedAt = new Date().getTime();
      this._setStatus(STATUS.STARTED);
      this._emit('start');

      return this._start$()
        .then(() => {
          this._emit('end');
        })
        .catch(this._fail.bind(this));
    } catch (err) {
      this._fail(err);
    }
  },
  _start$: function() {
    var self = this;
    // [momo] 取消 space setting 流程, 因為目前用不到，且目前寫法不會合併發送 會造成 server 負擔
    var _getPlan$ = this._beforeGetPlan$()
      .then(this._getPlan$.bind(this));
    return _getPlan$.then((plan) => {
      // 被 widget 中斷的流程這邊的 plan 會是 undefined, 所以直接結束, 否則後面會 error
      if (plan === undefined) {
        return new Promise(function(resolve, reject) {
          resolve();
        });
      } else {
        return new Promise(function(resolve, reject) {
          resolve(plan);
        }).then(function(plan) {
          plan = self._afterGetPlan(plan) || plan;
          self._setPlan(plan);
          plan = self._beforeRunPlan(plan) || plan;
          return plan;
        })
          .then(this._runPlan$.bind(this))
          .then(function(ad) {
            ad = self._afterRunPlan(ad) || ad;
            self._setAd(ad);
            return self._handleEvents(ad);
          });
      }
    });

    // return xxx$
    //   .then(function(plan) {
    //     console.log('plan', plan);

    //     plan = self._afterGetPlan(plan) || plan;
    //     self._setPlan(plan);
    //     plan = self._beforeRunPlan(plan) || plan;
    //     return plan;
    //   })
    //   .then(this._runPlan$.bind(this))
    //   .then(function(ad) {
    //     ad = self._afterRunPlan(ad) || ad;
    //     self._setAd(ad);
    //     return self._handleEvents(ad);
    //   });
  },
  _beforeGetPlan$: functions.nop,
  _getPlan$: function(res) {
    return this.service.getPlan$();
  },
  _afterGetPlan: functions.nop,
  _setPlan: function(plan) {
    this.plan = plan;
    this.sessionId = plan.sessionId;
    this.sessionTs = extractUuidTs(plan.sessionId);
    this._emit('plan', plan);
  },
  _beforeRunPlan: functions.nop,
  _runPlan$: function(plan) {
    var self = this;
    // map channels to functions to be executed sequencially until we get first non-undefined return value
    var fns = plan.channels.map(function(channel) {
      return function() {
        var typeInfo = channel.modType + '.' + channel.adType + (channel.subType ? '(' + channel.subType + ')' : '');
        self._appendResult(typeInfo);
        self._emit('channel', channel);
        // always track channel request, while AsiaMax channel shall contain zero channel-request trackers
        self._trackChannelRequest(channel);
        self._emit('track-request', channel);

        // 記錄目前進行到哪個 channel
        self.currentRunningChannelId = channel.id;

        return self._runChannel$(channel);
      };
    });
    return promises.promisify$(promises.first(fns));
  },
  _runChannel$: functions.nop,
  _afterRunPlan: functions.nop,
  _setAd: function(ad) {
    var result = ad ? 'filled' : 'empty';
    this[result] = true;
    this._setStatus(STATUS.AD_DISPLAYED);
    this._appendResult(result);
    this._emit('display', ad);
    this._emit(ad ? 'fill' : 'empty');
  },
  _handleEvents: functions.nop,

  _destroy: function() {
    this.service.destroy(); // this only destroys the space view of ad service
  },

  // error //
  _fail: function(err) {
    if (err.type === AdcodeError.TYPES.SPACE_ELEMENT_NOT_FOUND) {
      http.monitor$('targetNotFound', this, {});
    }
    console.error(err);
    this._error(err);
    this._appendResult('fail');
    this._emit('fail', err);
    throw err;
  },
  _error: function(err) {
    console.error(err);
    if (!err || !err.isUserError) {
      // skip this hook on user error to prevent infinite loop
      this._emit('error', err);
    }
  },
  // util //
  _setStatus: functions.nop,
  _appendResult: functions.nop
});

Object.defineProperties(AbstractSpace.prototype, {
  started: {
    get: function() {
      return this.startedAt !== undefined;
    }
  }
});

module.exports = AbstractSpace;


/***/ }),

/***/ "./space/base.js":
/*!***********************!*\
  !*** ./space/base.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var mods = __webpack_require__(/*! ../mods */ "./mods.js");
var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var functions = __webpack_require__(/*! ../util/functions */ "./util/functions.js");
var dom = __webpack_require__(/*! ../util/dom */ "./util/dom.js");
var visibility = __webpack_require__(/*! ../util/visibility */ "./util/visibility.js");
var AbstractSpace = __webpack_require__(/*! ./abstract */ "./space/abstract.js");
// var AdcodeError = require('../adcodeError');
var TrackerManager = __webpack_require__(/*! ../tracker/manager */ "./tracker/manager.js");
var CONSTANTS = __webpack_require__(/*! ../constants */ "./constants.js");
var EVENTS = __webpack_require__(/*! ../events */ "./events.js");
var ad = __webpack_require__(/*! ../ad */ "./ad/index.js");

var PlacementManager = __webpack_require__(/*! ./placement */ "./space/placement.js");
// var Attributes = require('./attributes');

var VIEWABLE_TIMEOUT = CONSTANTS.VIEWABLE_TIMEOUT;
var VIEWABLE_THRESHOLD = CONSTANTS.VIEWABLE_THRESHOLD;

/**
 * The base class of spaces.
 * @constructor
 * @param {RMaxADS} rmaxads - the master RMaxADS object
 * @param {string} type - the type of space
 * @param {Element} element - the <ins> space element
 * @param {object} options
 */
function BaseSpace(rmaxads, type, element) {
  if (!element) {
    throw new Error('Element is required');
  }
  this.element = element;
  this.loaderUuid = element.getAttribute('data-loader-uuid');
  // 從 loader 寫入的 ins tag, 會自帶 sessionId
  this.sessionId = element.getAttribute('data-rmax-session-id');

  AbstractSpace.call(this, rmaxads, type);
}

objects.inherit(BaseSpace, AbstractSpace);

Object.assign(BaseSpace.prototype, {
  // workflow //
  _init: function() {
    // read attributes from element
    this._readAttributes();
    // (this.attributes = new Attributes()).readFrom(element);

    this.trackerManager = new TrackerManager(this.element);
    this.placement = new PlacementManager(this.element, this.placementOptions);

    // TODO: should be done by sandbox CSS?
    // prevent default user agent underline style
    this.element.style.textDecoration = 'none';
  },
  // TODO: we may need a invokeComponentHooks() method so user can access components before start$()

  // start$: see AbstractSpace
  // _getPlan$ -> _runPlan$ -> _handleEvents
  _beforeGetPlan$: function() {
    this.placement.start();
    return Promise.resolve(this.placement.ref$);
  },
  _afterGetPlan: function(plan) {
    this._writeAttribute$('data-rmax-session-id', plan.sessionId);
  },
  _runChannel$: function(channel) {
    // TODO: let ad module handle this
    if (this._isSessionTimeout()) {
      // session timeout: we ignore channel execution 1hr after session time, as we will drop all the events anyway
      return Promise.resolve();
    }
    if (channel.modType === 'asiamax') {
      var self = this;
      return this._getAsiaMaxAd$(channel)
        .then(function(c) {
          // asiamax 沒有 ad 的時候, 在 ssp 就已經先寫了 no fill. 所以這邊不用另外處理
          return self._isNonEmptyAd(c) ? self._runAd$(Object.assign(channel, c)) : undefined;
        });
    } else {
      return this._runAd$(channel);
    }
  },
  _isSessionTimeout: function() {
    // eslint-disable-next-line no-magic-numbers
    return Date.now() - this.sessionTs > 3600000;
  },
  _isNonEmptyAd: function(channel) {
    return channel && Object.keys(channel).filter(function(s) {
      return s !== 'trackers';
    }).length > 0;
  },
  _trackChannelRequest: function(channel) {
    var requestTrackers = (channel.trackers || {}).request;
    if (requestTrackers && requestTrackers.length > 0) {
      this.trackerManager.add(EVENTS.REQUEST, requestTrackers);
      this._fireTracker(EVENTS.REQUEST);
    }
  },
  _getAsiaMaxAd$: function(channel) {
    // TODO: status, hook
    return this.service.getAsiaMaxAd$(channel);
  },
  _trackChannelNoFill: function(channel) {
    var trackers = (channel.trackers || {}).noFill;
    if (trackers && trackers.length > 0) {
      this.trackerManager.add(EVENTS.NO_FILL, trackers);
      this._fireTracker(EVENTS.NO_FILL);
    }
    return;
  },
  _runAd$: function(channel) {
    var self = this;
    this._emit('before-channel-module', channel);
    var ad = this.ad = this._createAd(channel);
    this._setupAd(ad, channel);
    this._emit('channel-module', ad);
    ad.init && ad.init();
    this._resolveInsAlign(ad);

    return ad.display$()
      .then(function() {
        if (ad.filled) {
          return ad;
        } else {
          self._trackChannelNoFill(channel);
          ad.destroy();
          return undefined;
        }
      });
  },
  _resolveInsAlign: function(ad) {
    var align = this.plan && this.plan.align;
    if (align && ad) {
      this._appendIntoWrapper(align);
    }
  },
  // 在 ins tag 外面包一層 element, 根據參數判斷是否水平或垂直置中
  _appendIntoWrapper: function(align) {
    if (!align.spaceHorizontalCenter && !align.spaceVerticalCenter) {
      return;
    }
    var insEle = this.element;
    var centerTagName = 'RMAXINSWRAPPER';
    var insTagName = insEle.tagName;
    var insParentTagName = insEle.parentElement.tagName;
    var ignoreAppendCenterTag = insTagName === centerTagName || insParentTagName === centerTagName;
    if (ignoreAppendCenterTag) {
      // POS-4703 避免長出多層 <rmaxinswrapper>
      return;
    }

    var insWrapper = document.createElement('rmaxinswrapper');
    insWrapper.style.display = 'flex';
    insWrapper.style.justifyContent = align.spaceHorizontalCenter ? 'center' : null;
    insWrapper.style.alignItems = align.spaceVerticalCenter ? 'center' : null;

    if (align.spaceVerticalCenter) {
      insWrapper.style.height = 'inherit';
    }

    var parentNode = insEle.parentNode;
    if (parentNode) {
      parentNode.insertBefore(insWrapper, insEle);
      insWrapper.appendChild(insEle);
    }
  },
  _setupAd: function(ad, channel) {
    ad.events.on('error', this._error.bind(this));
    // TODO: click?
  },
  _afterRunPlan: function(ad) {
    if (!ad) {
      this.element.style.display = 'none';
    }
  },
  _handleEvents: function(ad) {
    if (!ad) {
      this._handleDoneTracker();
      return;
    }
    var trackers = ad.channel.trackers || {};
    this._emit('trackers', trackers);
    this._handleImpressionTrackers(ad, trackers);
    this._handleViewableTrackers(ad, trackers);
    this._handleScriptTrackers(ad, trackers);
  },
  _handleDoneTracker: function() {
    var trackers = this.plan.trackers || {};
    var doneTrackers = trackers.done;
    if (!doneTrackers || !doneTrackers.length) {
      return;
    }
    this._emit('track-done');
    this.trackerManager.add(EVENTS.DONE, trackers.done);
    this._fireTracker(EVENTS.DONE);
  },
  _handleImpressionTrackers: function(ad, trackers) {
    // TODO: add API to add and fire away
    this.trackerManager.add(EVENTS.IMPRESSION, trackers.impression);
    var options = {
      visibilityThreshold: CONSTANTS.IMPRESSION_THRESHOLD,
      timeoutThreshold: CONSTANTS.IMPRESSION_TIMEOUT
    };
    this.impression$ = this._viewable$(options)
      .then(() => {
        this._doImpression(ad, trackers);
      })
      .catch(this._error.bind(this));
  },
  _handleViewableTrackers: function(ad, trackers) {
    this.trackerManager.add(EVENTS.VIEWABLE, trackers.viewable);
    this._monitorViewability();
  },
  _handleScriptTrackers: function(ad, trackers) {
    this._scriptTrackers = trackers.script;
  },
  _monitorViewability: function() {
    var elements = this.ad && this.ad.elements;
    if (elements === undefined) {
      return;
    }
    var options = {
      visibilityThreshold: VIEWABLE_THRESHOLD,
      timeoutThreshold: VIEWABLE_TIMEOUT
    };
    this.viewable$ = this._viewable$(options)
      .then(this._doViewable.bind(this))
      .catch(this._error.bind(this));
  },
  _viewable$: function(options) {
    var elements = this.ad && this.ad.elements;
    var vo = this._viewabilityObserver = new visibility.ViewabilityObserver(elements, options);
    this._emit('viewability-observer', vo, options);
    return vo.fulfilled$;
  },
  _doImpression: function(ad, trackers) {
    this._emit('impression', {
      'sessionId': this.sessionId
    });
    this._fireTracker(EVENTS.IMPRESSION);
  },
  _doViewable: function(undetermined) {
    this._emit('viewable', {
      'sessionId': this.sessionId,
      'undetermined': undetermined
    });
    this._fireViewableTracker(undetermined);
    this._installScriptTrackers(this._scriptTrackers);
  },

  // ad //
  _createAd: function(channel) {
    var Ad = ad.select(channel) || this._selectDefaultAdModule(channel);
    return new Ad(this, channel);
  },
  _selectDefaultAdModule: functions.unimplemented,

  // attributes //
  _readAttributes: function() {
    this._readAdHost();
    this._readCommonAttributes();
    this._readPlacementAttributes();
  },
  _readAdHost: function() {
    this.sspHost = this.element.getAttribute('data-ssp-host') || undefined;
  },
  _readCommonAttributes: function() {
    this.spaceId = this.element.getAttribute('data-rmax-space-id');
    if (!this.spaceId) {
      throw new Error('Space ID not found');
    }
    this.groupId = this.element.getAttribute('data-rmax-group-id') || undefined;
  },
  _readPlacementAttributes: function() {
    var element = this.element;
    this.placementOptions = {
      selector: element.getAttribute('data-target-id'),
      index: this.helpers.parseNumber(element.getAttribute('data-target-index')),
      position: element.getAttribute('data-target-pos'),
      rootSelector: element.getAttribute('data-listen-target-selector')
    };
  },
  _setStatus: function(status) {
    this.status = status;
    this._writeAttribute$('data-rmax-status', status);
  },
  _appendResult: function(result) {
    this.result = this.result ? (this.result + ' -> ' + result) : result;
    this._writeAttribute$('data-rmax-result', this.result);
  },
  _writeAttribute$: function(name, value) {
    var element = this.element;
    return dom.raf$()
      .then(value === undefined ?
        element.removeAttribute.bind(element, name) :
        element.setAttribute.bind(element, name, value)
      );
  },

  // tracking //
  _fireTracker: function(type, args) {
    try {
      this.trackerManager.fire(type, args);
    } catch (err) {
      // eat the error so it's won't break the work flow, but still send error information to server
      this._error(err);
    }
  },
  _fireViewableTracker: function(undetermined) {
    this._fireTracker(EVENTS.VIEWABLE, {
      noAd: undetermined ? 2 : 0, // eslint-disable-line no-magic-numbers
      requestId: this.sessionId
    });
  },
  _installScriptTrackers: function(trackers) {
    if (trackers && trackers.length > 0) {
      this.trackerManager.add(EVENTS.SCRIPT, trackers);
      this._fireTracker(EVENTS.SCRIPT);
    }
  },
  _installRetargetingTracker: function(tracker) {
    if (!tracker.codeUrl) {
      return;
    }
    var iframe = document.createElement('iframe');
    iframe.src = tracker.codeUrl;
    iframe.style.display = 'none';
    iframe.width = 0;
    iframe.height = 0;
    // TODO: we may want to avoid appending as a chlid of ins element with replacing placement settings
    this.element.appendChild(iframe);
  },

  // error //
  _error: function(err) {
    // TODO: use the endpoint from plan response
    this.service.error(err);
    AbstractSpace.prototype._error.apply(this, arguments);
  }

});

var HELPERS = Object.freeze({
  parseDimension: function(str) {
    if (str === undefined || str === null || str === '') {
      return undefined;
    }
    if (typeof str !== 'string') {
      throw new Error('Expecting a string');
    }
    str = str.replace('px', '');
    return Number(str);
  },
  parseNumber: function(str) {
    if (str === undefined || str === null || str === '') {
      return undefined;
    }
    if (typeof str !== 'string') {
      throw new Error('Expecting a string');
    }
    return Number(str);
  }
});

// properties //
Object.defineProperties(BaseSpace.prototype, {
  helpers: {
    value: HELPERS
  }
});

mods.register('BaseSpace', BaseSpace);

module.exports = BaseSpace;


/***/ }),

/***/ "./space/placement.js":
/*!****************************!*\
  !*** ./space/placement.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var mods = __webpack_require__(/*! ../mods */ "./mods.js");
var NodeInsertObserber = __webpack_require__(/*! ../util/node-insert-observer */ "./util/node-insert-observer.js");
var Component = __webpack_require__(/*! ../util/component */ "./util/component.js");
var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");

function PlacementManager(element, options) {
  Component.call(this, 'placement-manager');
  options = options || {};
  this._doc = options.document || document;
  this._fallback = element;
  this._selector = options.selector;
  this._index = options.index;
  this._rootSelector = options.rootSelector;
  this.position = options.position || 'INNER';

  var self = this;
  Object.defineProperty(this, 'ref$', {
    value: new Promise(function(resolve, reject) {
      self._resolveRef = resolve;
      self._rejectRef = reject;
    })
  });
}

objects.inherit(PlacementManager, Component);

Object.assign(PlacementManager.prototype, {
  start: function() {
    // 1. no selector, use fallback element
    var selector = this._selector;
    if (!selector) {
      this._setRef(this._fallback);
      return;
    }
    // 2. has selector, and element found
    if (this._trySetRef()) {
      return;
    }
    // 3. listen DOM change under root element
    var observer = new NodeInsertObserber(this._getRootElement(), this._trySetRef.bind(this));
    var disconnect = observer.disconnect.bind(observer);
    this.ref$.then(disconnect, disconnect);
  },
  _getRootElement: function() {
    var rootSelector = this._rootSelector;
    if (!rootSelector) {
      // rootSelector is required
      var err = new Error('Ref element not found, and root selector is absent');
      throw new AdcodeError(AdcodeError.TYPES.SPACE_ELEMENT_NOT_FOUND, err, {
        selector: this._selector,
        index: this._index
      });
    }
    var rootElement = this._doc.querySelector(rootSelector);
    if (!rootElement) {
      // listenTarget element has to be available at this time for us to mount listener
      var err = new Error('Ref element not found, and root element is also not found');
      throw new AdcodeError(AdcodeError.TYPES.SPACE_ELEMENT_NOT_FOUND, err, {
        selector: this._selector,
        index: this._index,
        rootSelector: rootSelector
      });
    }
    return rootElement;
  },
  _trySetRef: function() {
    var ref = this._computeRef();
    if (ref) {
      this._setRef(ref);
    }
    return ref;
  },
  _setRef: function(value) {
    Object.defineProperty(this, 'ref', {
      value: value
    });
    this._emit('ref', value);
    this._resolveRef(value);
  },
  _computeRef: function() {
    var refs;
    try {
      refs = this._doc.querySelectorAll(this._selector);
    } catch(err) {
      throw new AdcodeError(AdcodeError.TYPES.SPACE_ELEMENT_NOT_FOUND, err, {
        selector: this._selector,
        index: this._index
      });
    }
    // eslint-disable-next-line no-magic-numbers
    return refs[Number(this._index) === -1 ? (refs.length - 1) : (this._index || 0)];
  }
});

mods.register('PlacementManager', PlacementManager);

module.exports = PlacementManager;


/***/ }),

/***/ "./space/status.js":
/*!*************************!*\
  !*** ./space/status.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  INITIALIZED: 'initialized',
  STARTED: 'started',
  PLAN_REQUESTED: 'plan requested',
  PLAN_RECEIVED: 'plan received',
  ASIAMAX_AD_REQUESTED: 'asiamax ad requested',
  ASIAMAX_AD_RECEIVED: 'asiamax ad received',
  AD_CREATED: 'ad created',
  AD_DISPLAYED: 'ad displayed',

  AD_REQUEST_QUEUED: 'request queued', // TODO: remove
  AD_REQUEST_SENT: 'request sent', // TODO: remove
  AD_RESPONSE_RECEIVED: 'response received' // TODO: remove
};


/***/ }),

/***/ "./space/types.js":
/*!************************!*\
  !*** ./space/types.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  DISPLAY: 'DISPLAY',
  DISPLAY_GROUPED: 'DISPLAY-GROUPED'
};


/***/ }),

/***/ "./space/universal.js":
/*!****************************!*\
  !*** ./space/universal.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var TYPES = __webpack_require__(/*! ./types */ "./space/types.js");
var BaseSpace = __webpack_require__(/*! ./base */ "./space/base.js");

var NativeAd = __webpack_require__(/*! ../ad/native */ "./ad/native.js");

function Universal(rmaxads, element, options) {
  var type = element.getAttribute('data-rmax-group-id') ? TYPES.DISPLAY_GROUPED : TYPES.DISPLAY;
  BaseSpace.call(this, rmaxads, type, element, options);
}

// this creates and links the prototype chain between subclass and superclass
// all prototype modification shall go AFTER this call
objects.inherit(Universal, BaseSpace);

Object.assign(Universal.prototype, {
  _selectDefaultAdModule: function() {
    return NativeAd;
  },
  _afterRunPlan: function(ad) {
    BaseSpace.prototype._afterRunPlan.apply(this, arguments);
    if (!ad) {
      // TODO: be generic
      this.element.classList.add('rmax-type-noad');
    }
  }
});

module.exports = Universal;


/***/ }),

/***/ "./tracker/base.js":
/*!*************************!*\
  !*** ./tracker/base.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var fns = __webpack_require__(/*! ../util/functions */ "./util/functions.js");

function BaseTracker(tracker, type) {
  this.type = type;
  this.name = tracker.name;
  /*
  var self = this;
  this.result$ = new Promise(function(resolve, reject) {
    self._resolve = resolve;
    self._reject = reject;
  });
  */
}

Object.assign(BaseTracker.prototype, {
  fire: function(args, params) {
    if (this.fired) {
      return;
    }
    this.fired = true;

    this._fire(args, params);
  },
  destroy: function() {
    // this.result$ = this._resolve = this._reject = undefined;
    var element = this.element;
    element && element.parentElement && element.parentElement.removeChild(element);
  },

  _fire: fns.unimplemented,
  _append: function(container, element) {
    container.appendChild(element);
  }
});

module.exports = BaseTracker;


/***/ }),

/***/ "./tracker/iframe.js":
/*!***************************!*\
  !*** ./tracker/iframe.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var BaseTracker = __webpack_require__(/*! ./base */ "./tracker/base.js");

function Iframe(tracker) {
  BaseTracker.call(this, tracker, 'iframe');
  this.content = tracker.content;
}

objects.inherit(Iframe, BaseTracker);

Object.assign(Iframe.prototype, {
  _fire: function(args, params) {
    var element = this.element = document.createElement('iframe');
    element.style.display = 'none';
    element.style.width = element.style.height = '0';
    // kick off
    element.srcdoc = this.content.replace('</scr\'+\'ipt>', '</script>');
    this._append(document.body, element);
  }
});

module.exports = Iframe;


/***/ }),

/***/ "./tracker/manager.js":
/*!****************************!*\
  !*** ./tracker/manager.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var uuid = __webpack_require__(/*! ../util/uuidv4 */ "./util/uuidv4.js");
var Component = __webpack_require__(/*! ../util/component */ "./util/component.js");
var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");

var PixelTracker = __webpack_require__(/*! ./pixel */ "./tracker/pixel.js");
var ScriptTracker = __webpack_require__(/*! ./script */ "./tracker/script.js");
var IframeTracker = __webpack_require__(/*! ./iframe */ "./tracker/iframe.js");

function TrackerManager(container) {
  Component.call(this, 'tracker-manager');
  this._container = container || document.body;
  this._trackers = {};
  this._fireHistory = [];
}

objects.inherit(TrackerManager, Component);

Object.assign(TrackerManager.prototype, {
  get: function(trackerName) {
    return (this._trackers && this._trackers[trackerName]) || [];
  },
  getTypes: function() {
    return this._trackers ? Object.keys(this._trackers) : [];
  },
  getAll: function() {
    var trackers = this._trackers;
    // flatMap
    return this.getTypes().reduce(function(acc, trackerName) {
      return acc.concat(trackers[trackerName] || []);
    }, []);
  },
  add: function(trackerName, trackers) {
    if (!trackers || trackers.length === 0) {
      return;
    }
    if (!Array.isArray(trackers)) {
      trackers = [trackers];
    }
    var _self = this;
    trackers = trackers
      .map(function(tracker) {
        return _self._processTracker(trackerName, tracker);
      })
      .filter(function(t) {
        return t !== undefined;
      });

    if (trackers.length === 0) {
      return;
    }
    this._trackers[trackerName] = this._trackers[trackerName] !== undefined ? this._trackers[trackerName].concat(trackers) : trackers;
  },
  fire: function(trackerName, args) {
    var emit = this._emit.bind(this);
    var trackers = (this._trackers[trackerName] || []).filter(function(tracker) {
      return !tracker.fired;
    });

    var _self = this;
    trackers.forEach(function(tracker) {
      try {
        _self._fireHistory.push(tracker);
        tracker.fire(args);
      } catch (err) {
        emit('error', new AdcodeError(AdcodeError.TYPES.TRACKER_ERROR, err, {
          eventType: trackerName,
          trackerUrl: tracker
        }));
      }
    });

    emit('fire', trackerName, trackers, args);
  },
  destroy: function() {
    var trackers = this._trackers;
    if (trackers) {
      Object.keys(trackers).forEach(function(k) {
        (trackers[k] || []).forEach(function(tracker) {
          tracker.destroy();
        });
      });
    }
    this._trackers = undefined;
    Component.prototype._destroy.call(this);
  },

  _processArgs: function(args) {
    return Object.assing(args, {
      timestamp: Date.now.bind(Date),
      cachebuster: uuid
    });
  },
  _processTracker: function(trackerName, tracker) {
    // normalize
    if (typeof tracker === 'string') {
      tracker = {
        type: 'pixel',
        url: tracker
      };
    }
    if (tracker.type === undefined) {
      tracker.type = 'iframe';
    }

    if (trackerName === 'script') {
      tracker.type = 'script';
    }
    tracker.name = trackerName;

    switch (tracker.type) {
    case 'pixel':
      return new PixelTracker(this._container, tracker);
    case 'script':
      return new ScriptTracker(this._container, tracker);
    case 'iframe':
      return new IframeTracker(tracker);
    }
    // TODO: emit error
    return undefined; // unrecognized tracker type
  }
});

module.exports = TrackerManager;


/***/ }),

/***/ "./tracker/pixel.js":
/*!**************************!*\
  !*** ./tracker/pixel.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var http = __webpack_require__(/*! ../util/http */ "./util/http.js");
var BaseTracker = __webpack_require__(/*! ./base */ "./tracker/base.js");

function Pixel(container, tracker) {
  BaseTracker.call(this, tracker, 'pixel');
  this.container = container;
  this.url = tracker.url;
}

objects.inherit(Pixel, BaseTracker);

Object.assign(Pixel.prototype, {
  _fire: function(args, params) {
    var src = this.renderedUrl = this._renderUrl(this.url, args, params);
    var element = this.element = document.createElement('img');
    element.style.display = 'none';
    // kick off
    element.src = src;

    this._append(this.container, element);
  },
  _renderUrl: function(url, args, params) {
    args = args || {};
    url = url.replace(/\[([^\[\]]*)\]/g,
      function(a, b) {
        var r = args[b];
        if (typeof r === 'function') {
          try {
            r = r();
          } catch(err) {}
        }
        return typeof r === 'string' || typeof r === 'boolean' || typeof r === 'number' ? r : a;
      }
    );
    var keys = params && Object.keys(params);
    if (!keys || keys.length === 0) {
      return url;
    }
    var suffix = http.encodeQueryParams(params);
    return url + (url.lastIndexOf('?') < 0 ? suffix : '&' + suffix.substring(1));
  },
  destroy: function() {
    this.element && (this.element.removeAttribute('src'));
    BaseTracker.prototype.destroy.apply(this, arguments);
  }
});

module.exports = Pixel;


/***/ }),

/***/ "./tracker/script.js":
/*!***************************!*\
  !*** ./tracker/script.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objects = __webpack_require__(/*! ../util/objects */ "./util/objects.js");
var BaseTracker = __webpack_require__(/*! ./base */ "./tracker/base.js");

function Script(container, tracker) {
  BaseTracker.call(this, tracker, 'script');
  this.container = container;
  this.url = tracker.url;
}

objects.inherit(Script, BaseTracker);

Object.assign(Script.prototype, {
  _fire: function(args, params) {
    var element = this.element = document.createElement('script');
    element.type = 'text/javascript';
    element.src = this.url;

    this._append(this.container, element);
  }
});

module.exports = Script;


/***/ }),

/***/ "./util/common.js":
/*!************************!*\
  !*** ./util/common.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
/* eslint no-magic-numbers: 0 */
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) {
    options = {};
  }

  var later = function() {
    previous = options.leading === false ? 0 : +new Date;
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };

  var throttled = function() {
    var now = +new Date;
    if (!previous && options.leading === false) {
      previous = now;
    }
    var remaining = wait - (now - previous);
    context = this; // eslint-disable-line no-invalid-this
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};

function waitFor$(interval, retryLimit, getter) {
  if (typeof retryLimit === 'function' && getter === undefined) {
    getter = retryLimit;
    retryLimit = undefined;
  }
  return new Promise(function(resolve, reject) {
    var retryCount = 0, intervalId;
    function exit() {
      intervalId && clearInterval(intervalId);
    }
    function trial() {
      var value;
      try {
        value = getter();
      } catch(err) {
        exit();
        reject(err);
      }
      if (value !== undefined) {
        exit();
        resolve(value, retryCount);
      } else {
        if (retryCount >= retryLimit) {
          exit();
          reject(new Error('Reach maximum retry: ' + retryCount));
        }
        retryCount++;
      }
    }
    intervalId = setInterval(trial, interval);
    trial();
  });
}

module.exports = {
  version: "prod-momo/0.3.5.1",
  throttle: throttle,
  waitFor$: waitFor$
};


/***/ }),

/***/ "./util/component.js":
/*!***************************!*\
  !*** ./util/component.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(/*! ./event */ "./util/event.js");
var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");

function HookContext(component, thisArg, onError) {
  this._component = component;
  this._thisArg = thisArg;
  this._onError = typeof onError === 'function' ? onError : undefined;
}

Object.assign(HookContext.prototype, {
  // API //
  wrap: function(name, callback) {
    return typeof name === 'function' && callback === undefined ?
      this._wrapUnnamed(name) : this._wrapNamed(name, callback);
  },
  _wrapNamed: function(name, callback) {
    var thisArg = this._thisArg;
    var onError = this._error.bind(this, name);
    return function() {
      try {
        callback.apply(thisArg, arguments);
      } catch(err) {
        console.error(err);
        onError(err);
      }
    };
  },
  _wrapUnnamed: function(callback) {
    var thisArg = this._thisArg;
    var onError = this._error.bind(this);
    return function(name) {
      try {
        callback.apply(thisArg, arguments);
      } catch(err) {
        onError(name, err);
      }
    };
  },
  _error: function(name, err) {
    if (!AdcodeError.isAdcodeError(err)) {
      err = new AdcodeError(AdcodeError.TYPES.HOOK_HANDLER_ERROR, err, {
        component: this._component,
        hook: name
      });
    }
    this._onError && this._onError(err);
  }
});

function Component(componentType) {
  this._component = componentType;
  this._emitter = new EventEmitter();
  this._hookctx = new HookContext(componentType, this, this._error.bind(this));
}

Object.defineProperties(Component.prototype, {
  // TODO: may remove this, as we want external user to use hooks
  events: {
    get: function() {
      return this._emitter.events;
    }
  }
});

Object.assign(Component.prototype, {
  on: function(name, callback) {
    callback = this._hookctx.wrap(name, callback);
    return this._emitter.on(name, callback);
  },
  _emit: function() {
    /* 2022-07-07
      每個繼承component的物件都有自己的 _emitter,
      呼叫 _emit 來通知事件發生,
      若想要接收 emit event 需要在物件上定義 emit 的 listener function

      例如
      space 會發出 'display' 的 event, 所以需要像這樣使用
      space.on('display', function (arg) {});

      例如
      var rmaxads = (window.rmaxads || (window.rmaxads = {}));
      (rmaxads.cmd || (rmaxads.cmd = [])).push(function (rmaxads) {
        rmaxads.on('space', function (space) {
          space.on('display',    function (arg) {});
          space.on('impression', function (arg) {});
          space.on('viewable',   function (arg) {});
        });
      });
    */
    // console.log('emit', this._component, arguments[0]);
    var _emitter = this._emitter;
    if (_emitter) {
      _emitter.emit.apply(_emitter, arguments);
    }
  },
  destroy: function() {
    this._emit('before-destroy');
    this._destroy();
    this._emitter = this._hookctx = undefined;
  },
  _destroy: function() {},
  // TODO: support pipe()
  _error: function(/* error */) {}
});

module.exports = Component;


/***/ }),

/***/ "./util/continuous-state-observer.js":
/*!*******************************************!*\
  !*** ./util/continuous-state-observer.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * An observer object which takes a time threshold T and a callback C,
 * which accepts a boolean input and maintains a boolean output state.
 * The output state = (the last input value) && (last input was at least time T ago).
 * When the output state is toggled, the callback C will be called with the output state value.
 */
function ContinuousStateObserver(options, callback) {
  this._threshold = options.threshold;
  this._callback = callback;
  this._state = !!options.initialState; // default to false
}

ContinuousStateObserver.prototype = {
  update: function(value) {
    if (this._disconnected) {
      return;
    }
    if (this._state) {
      // current state: true, input: true => do nothing
      // current state: true, input: false => set state to false
      if (!value) {
        this._state = false;
        this._callback && this._callback(false);
      }
    } else {
      // current state: false, input: true, has timeout => do nothing
      // current state: false, input: true, no timeout => set timeout
      // current state: false, input: false, has timeout => clear timeout
      // current state: false, input: false, no timeout => do nothing
      var timeoutId = this._timeoutId;
      var self = this;
      if (value && !timeoutId) {
        this._timeoutId = setTimeout(function() {
          self._timeoutId = undefined;
          self._state = true;
          self._callback && self._callback(true);
        }, this._threshold);
      } else if (!value && timeoutId) {
        clearTimeout(timeoutId);
        this._timeoutId = undefined;
      }
    }
  },
  disconnect: function() {
    this._disconnected = true;
    this._timeoutId && clearTimeout(this._timeoutId);
  }
};

Object.defineProperty(ContinuousStateObserver.prototype, 'state', {
  get: function() {
    return this._state;
  }
});

module.exports = ContinuousStateObserver;


/***/ }),

/***/ "./util/device.js":
/*!************************!*\
  !*** ./util/device.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint max-len: 0, no-magic-numbers:0 */


var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

var _ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

var isPhone = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(_ua) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(_ua.substr(0, 4));
isPhone = isPhone || window.innerWidth < 468; // 寬度 468 以下視為手機

var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(_ua);

var isMobile = isPhone || isTablet;

var isIE10OrLess = /MSIE\s([\d.]+)/.test(navigator.userAgent);

var isChromeOrOpera = navigator.userAgent.indexOf('Chrome/') >= 0;

var isSafari = navigator.userAgent.indexOf('Safari') !== -1 && !isChromeOrOpera;
var isIOSLine = navigator.userAgent.indexOf('Safari Line') >= 0;

var isLine = /Safari(?:\/[\d.]+)?\sLine/.test(navigator.userAgent);
var is = {
  'isIOS': isIOS,
  'isPhone': isPhone,
  'isTablet': isTablet,
  'isMobile': isMobile,
  'isIE10OrLess': isIE10OrLess,
  'isChromeOrOpera': isChromeOrOpera,
  'isSafari': isSafari,
  'isIOSLine': isIOSLine,
  'isLine': isLine,
  'bodyWidth': document.body.clientWidth,
  'bodyHeight': document.body.clientHeight
};

module.exports = {
  is: is,
  isIOS: isIOS,
  isMobile: isMobile,
  isPhone: isPhone,
  isTablet: isTablet,
  isIE10OrLess: isIE10OrLess,
  isChromeOrOpera: isChromeOrOpera,
  isIOSLine: isIOSLine,
  isLine: isLine,
  isSafari: isSafari
};


/***/ }),

/***/ "./util/dom.js":
/*!*********************!*\
  !*** ./util/dom.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var functions = __webpack_require__(/*! ./functions */ "./util/functions.js");
var device = __webpack_require__(/*! ./device */ "./util/device.js");
var util = __webpack_require__(/*! ./common */ "./util/common.js");

// mutation API //
function requestAnimationFrame$() {
  return window.requestAnimationFrame ? new Promise(window.requestAnimationFrame.bind(undefined)) : Promise.resolve();
}

function buildElementsFromHtml(html, level) {
  if (typeof html.nodeType !== 'undefined') {
    return [html];
  }

  var div = document.createElement('div');
  div.innerHTML = html;

  while (level && level--) {
    div = div.firstElementChild;
  }

  processIframeDescendants(div);

  return Array.prototype.slice.call(div.childNodes);
};

var shallProcessLegacyIframe = !('srcdoc' in document.createElement('iframe')) || device.isIOSLine;
var processIframeDescendants = shallProcessLegacyIframe ? processLegacyIframeDescendants : functions.nop;

function processLegacyIframeDescendants(element) {
  if (element.querySelectorAll) {
    Array.prototype.forEach.call(element.querySelectorAll('iframe'), processLegacyIframe);
  }
}

function processLegacyIframe(iframe) {
  var srcdoc = iframe.getAttribute('srcdoc');
  var src = iframe.getAttribute('src');
  if (src || !srcdoc) {
    return;
  }

  if (device.isIOSLine) {
    var jsUrl = 'javascript: window.frameElement.getAttribute("data-polyfill-srcdoc");';
    iframe.removeAttribute('srcdoc');
    iframe.setAttribute('data-polyfill-srcdoc', srcdoc);
    iframe.setAttribute('src', jsUrl);
  } else {
    // in Edge/IE, window.frameElement is null before the iframe is attched to DOM tree,
    // so we have to assign content to it directly
    var jsUrl = 'javascript: \'' + srcdoc.replace(/'/g, '\\\'') + '\'';
    iframe.setAttribute('src', jsUrl);
    if (iframe.contentWindow) {
      iframe.contentWindow.location = jsUrl;
    }
  }
}

function _removeNodes(nodes) {
  Array.prototype.slice.call(nodes)
    .forEach(function(node) {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
}

function _insertBeforeFn(parent, ref) {
  return ref ? function(node) {
    parent.insertBefore(node, ref);
  } : parent.appendChild.bind(parent);
}

function _placeNodes(target, position, nodes) {
  nodes = Array.prototype.slice.call(nodes);
  switch (position) {
  case 'BEFORE':
    Array.prototype.forEach.call(nodes, _insertBeforeFn(target.parentNode, target));
    break;
  case 'AFTER':
    Array.prototype.forEach.call(nodes, _insertBeforeFn(target.parentNode, target.nextSibling));
    break;
  case 'ADD':
    Array.prototype.forEach.call(nodes, _insertBeforeFn(target));
    break;
  case 'ADD_FRONT':
    Array.prototype.forEach.call(nodes, _insertBeforeFn(target, target.firstChild));
    break;
  case 'REPLACE':
    _placeNodes(target, 'BEFORE', nodes);
    _removeNodes([target]);
    break;
  case 'INNER':
    // _removeNodes(target.childNodes);
    target.innerHTML = '';
    _placeNodes(target, 'ADD', nodes);
    break;
  case 'REPLACE_HIDE':
    _placeNodes(target, 'BEFORE', nodes);
    target.style.display = 'none';
    break;
  default:
    throw new Error('Unreconigzed position type: ' + position);
  }
}

function placeNodes(target, position, nodes) {
  switch (position) {
  case 'BEFORE':
  case 'AFTER':
  case 'ADD':
  case 'ADD_FRONT':
    _placeNodes(target, position, nodes);
    return _removeNodes.bind(undefined, nodes);
  case 'REPLACE':
    var ref0 = nodes.length ? nodes[0] : target.nextSibling;
    _placeNodes(target, 'REPLACE', nodes);
    return function() {
      _placeNodes(ref0, 'BEFORE', [target]);
      _removeNodes(nodes);
    };
  case 'INNER':
    var childNodes = Array.prototype.slice.call(target.childNodes);
    _placeNodes(target, 'INNER', nodes);
    return _placeNodes.bind(undefined, target, 'INNER', childNodes);
  case 'REPLACE_HIDE':
    var display = target.style.display;
    _placeNodes(target, 'REPLACE_HIDE', nodes);
    return function() {
      _removeNodes(nodes);
      target.style.display = display;
    };
  default:
    throw new Error('Unreconigzed position type: ' + position);
  }
}

var DEFAULT_FIF_OPTIONS = Object.freeze({
  overflow: 'hidden',
  border: 0,
  frameBorder: 0,
  scrolling: 'no',
  marginHeight: 0,
  marginWidth: 0,
  $margin: '0',
  $padding: '0',
  src: 'about:blank'
});

function createFriendlyIframe() {
  return elementBuilder('iframe', DEFAULT_FIF_OPTIONS);
}

function getDocument$(iframe, options) {
  options = options || {};
  var interval = options.interval || 100; // eslint-disable-line no-magic-numbers
  var retryLimit = options.retryLimit || 20; // eslint-disable-line no-magic-numbers
  return util.waitFor$(interval, retryLimit, function() {
    try {
      return (iframe.contentWindow && iframe.contentWindow.document) || undefined; // it might be null
    } catch (e) {
      return undefined;
    }
  });
}

function writeDocument(doc, content) {
  doc.open().write(content);
  doc.close();
}

function writeFriendlyIframe$(iframe, content) {
  return getDocument$(iframe)
    .then(function(doc) {
      writeDocument(doc, content);
    });
}

// TODO: rename to createElement
function elementBuilder(tag, params) {
  var element = document.createElement(tag);
  for (var i in params) {
    if (i.indexOf('$') === 0) {
      element.style[i.substring(1)] = params[i];
    } else {
      element[i] = params[i];
    }
  }
  return element;
}

var isInIframe;
try {
  isInIframe = window.self !== window.top;
} catch (e) {
  isInIframe = true;
}
var sfExt = window.$sf && window.$sf.ext;
var isInSafeframe = isInIframe && sfExt && sfExt.inViewPercentage;
var sfListeners;

function listenToSafeFrameStatus(callback) {
  if (sfListeners === undefined) {
    sfListeners = [];
    sfExt.register(window.innerWidth, window.innerHeight, function(status, data) {
      sfListeners.forEach(function(listener) {
        try {
          listener(status, data);
        } catch (err) {} // ignored, caller shall handle his own error
      });
    });
  }
  sfListeners.push(callback);
  return _unlistenToSafeFrameStatus.bind(undefined, callback);
}

function _unlistenToSafeFrameStatus(callback) {
  var i = sfListeners && sfListeners.indexOf(callback);
  if (i >= 0) {
    sfListeners.splice(i, 1);
  }
}

function isInDOM(element) {
  return element.ownerDocument.body.contains(element);
}

function onWindowChange(callback, throttled) {
  if (throttled !== false) {
    // eslint-disable-next-line no-magic-numbers
    callback = util.throttle(callback, typeof throttled === 'number' ? throttled : 100);
  }
  window.addEventListener('scroll', callback);
  window.addEventListener('resize', callback);

  return function() {
    window.removeEventListener('scroll', callback);
    window.removeEventListener('resize', callback);
  };
}

function _findTopMostFullWidthReference(element) {
  var doc = element.ownerDocument;
  while ((element = element.parentNode) !== doc) {
    var overflowX = window.getComputedStyle(element).overflowX;
    if (overflowX !== 'visible') {
      return element;
    }
  }
  return undefined;
}

function makeFullWidth(element) {
  var style = element.style;
  style.display = 'inline-block';
  style.position = 'relative';
  style.width = '100%';
  style.marginLeft = style.marginRight = '0';

  var rect = element.getBoundingClientRect(); // relayout
  if (rect.width === 0) {
    return; // case where container is wrapped inside inline element or display: none, give up
  }

  var ref = _findTopMostFullWidthReference(element);
  var refRect = ref && ref.getBoundingClientRect();

  var fullWidth = ref ? ref.clientWidth : element.ownerDocument.defaultView.innerWidth;
  var leftMargin = (ref ? refRect.left : 0) - rect.left;
  var rightMargin = rect.right - (ref ? refRect.right : fullWidth);

  style.width = fullWidth + 'px';
  style.marginLeft = leftMargin + 'px';
  style.marginRight = rightMargin + 'px';
}

/*
function mergeAttributes(fromElement, toElement) {
  if (!fromElement.attributes || !(toElement instanceof HTMLElement)) {
    return;
  }
  Array.prototype.forEach.call(fromElement.attributes, function(attr) {
    var value = attr.value;
    switch (attr.name) {
    case 'class':
      value = value.trim();
      if (value.length > 0) {
        var oldClassName = toElement.className.trim();
        toElement.className = oldClassName.length > 0 ? (oldClassName + ' ' + value) : value;
      }
      break;
    case 'style':
      value = value.trim();
      if (value.length > 0) {
        var oldStyle = toElement.getAttribute('style');
        if (oldStyle && oldStyle.length > 0 && oldStyle[oldStyle.length - 1] !== ';') {
          oldStyle += ';'; // just in case
        }
        toElement.style = oldStyle + value;
      }
      break;
    default:
      toElement.setAttribute(attr.name, value);
    }
  });
}
*/

/*
function setStyles(element, props) {
  var originalProps = {};
  var style = element.style;
  Object.keys(props).forEach(function(name) {
    originalProps[name] = style[name];
    style[name] = props[name];
  });
  return function restore() {
    Object.assign(style, originalProps);
    originalProps = undefined;
  };
}
*/

/**
 * Retrieves ISO 639-1 code from the document, if available.
 * @return {String} 2-char lang code, or undefined
 */
function getLang() {
  var docElement = document.documentElement;
  var lang = docElement.lang || docElement.getAttribute('xml:lang');
  if (typeof lang !== 'string' || lang.length < 2) { // eslint-disable-line no-magic-numbers
    return undefined;
  }
  // just in case
  return lang.substring(0, 2).toLowerCase(); // eslint-disable-line no-magic-numbers
}

function getRootFrame(opt, win) {
  win = win || window;
  var selector = opt.selector; // 定位點

  try {
    if (selector && win.frameElement) {
      var target = win.parent.document.querySelector(selector);
      if (target) {
        return win.frameElement;
      }
    }

    if (isTenMaxSafeFrame(win.frameElement)) {
      return win.frameElement;
    }

    if (win.frameElement == null || win.parent.frameElement == null) {
      return win.frameElement;
    } else {
      return getRootFrame(opt, win.parent);
    }
  } catch (err) {
    return null;
  }
}

function getRootWindow(opt, win) {
  win = win || window;
  opt = opt || {};
  var selector = opt.selector; // 定位點

  try {
    if (selector) {
      var target = win.parent.document.querySelector(selector);
      if (target) {
        return win.parent;
      }
    }

    if (isTenMaxSafeFrame(win.frameElement)) {
      return win;
    }

    if (win.frameElement == null || win.parent.frameElement == null) {
      return win.frameElement ? win.parent : win;
    } else {
      return getRootWindow(opt, win.parent);
    }
  } catch (err) {
    return null;
  }
}

function getSafeFrameInformation(elem) {
  var debugMessage;
  try {
    window.top.location.href;
  }catch(err) {
    debugMessage = err.message;
  }


  return {
    'safeFrameDebugMessage': debugMessage,
  };
}

function isTenMaxSafeFrame(elem) {
  if (elem != null) {
    var arr = ['data-tenmax-safeframe', 'tenmax-safeframe'];
    var s = arr.map(function(attr) {
      return elem.getAttribute(attr);
    }).filter(function(s) {
      return s !== undefined && s !== null;
    });
    return s.length > 0;
  }

  return false;
}


function cloneAttributes(to, from, ignoreAttr) {
  // eslint-disable-next-line guard-for-in
  ignoreAttr = ignoreAttr || [];
  var attrs = from.attributes;
  for (var i = 0; i < attrs.length; i++) {
    var attrName = attrs[i].name;
    var attrValue = attrs[i].value;
    // eslint-disable-next-line no-magic-numbers
    if (ignoreAttr.indexOf(attrName) === -1) {
      to.setAttribute(attrName, attrValue);
      // console.log(attrName, attrValue)
    }
  }
}

module.exports = {
  raf$: requestAnimationFrame$,
  placeNodes: placeNodes,
  createFriendlyIframe: createFriendlyIframe,
  writeDocument: writeDocument,
  getDocument$: getDocument$,
  writeFriendlyIframe$: writeFriendlyIframe$,
  isInIframe: isInIframe,
  isInSafeframe: isInSafeframe,
  isInDOM: isInDOM,
  listenToSafeFrameStatus: listenToSafeFrameStatus,
  // setStyles: setStyles,
  elementBuilder: elementBuilder,
  buildElementsFromHtml: buildElementsFromHtml,
  onWindowChange: onWindowChange,
  // mergeAttributes: mergeAttributes,
  processIframeDescendants: processIframeDescendants,
  makeFullWidth: makeFullWidth,
  getLang: getLang,
  getRootWindow: getRootWindow,
  getRootFrame: getRootFrame,
  isTenMaxSafeFrame: isTenMaxSafeFrame,
  getSafeFrameInformation: getSafeFrameInformation,
  cloneAttributes: cloneAttributes
};


/***/ }),

/***/ "./util/event.js":
/*!***********************!*\
  !*** ./util/event.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

function EventEmitter() {
  this._handlers = {};
  this._forwards = [];

  Object.defineProperty(this, 'events', {
    value: Object.freeze({
      on: this.on.bind(this),
      once: this.once.bind(this),
      pipe: this.pipe.bind(this)
    })
  });
};

var INDEX_NOT_FOUND = -1;

Object.assign(EventEmitter.prototype, {
  // API //
  on: function(name, listener) {
    this._handlers = this._handlers || {}; // in case of mixin
    (this._handlers[name] || (this._handlers[name] = [])).push(listener);
    return this._off.bind(this, name, listener);
  },
  once: function(name, listener) {
    var self = this;
    return this.on(name, function g() {
      self._off(name, g);
      listener.apply(self, arguments);
    });
  },
  pipe: function(emitter) {
    if (typeof emitter === 'function') {
      emitter = {
        emit: emitter
      };
    }
    this._forwards = this._forwards || []; // in case of mixin
    this._forwards.push(emitter);
    return this._unpipe.bind(this, emitter);
  },
  clear: function() {
    this._handlers = {};
    this._forwards = [];
  },
  emit: function(name) {
    var args = [].slice.call(arguments, 1);
    this._callHandlers(name, args);
    this._callForwards.apply(this, arguments);
  },

  _callHandlers: function(name, args) {
    if (!this._handlers) {
      return;
    }
    var handlers = this._handlers[name];
    if (!handlers || handlers.length === 0) {
      return;
    }
    handlers = handlers.slice();
    for (var i = 0, len = handlers.length; i < len; i++) {
      handlers[i].apply(this, args);
    }
  },
  _callForwards: function() {
    if (!this._forwards || this._forwards.length === 0) {
      return;
    }
    var forwards = this._forwards.slice();
    for (var i = 0, len = forwards.length, emitter; i < len && (emitter = forwards[i]); i++) {
      emitter.emit.apply(emitter, arguments);
    }
  },
  _off: function(name, listener) {
    var listeners = this._handlers && this._handlers[name];
    var idx = Array.isArray(listeners) && listeners.indexOf(listener);

    if (idx && idx > INDEX_NOT_FOUND) {
      listeners.splice(idx, 1);
    }
  },
  _unpipe: function(emitter) {
    var i = this._forwards && this._forwards.indexOf(emitter);
    if (i && i > INDEX_NOT_FOUND) {
      this._forwards.splice(i, 1);
    }
  }
});

module.exports = EventEmitter;


/***/ }),

/***/ "./util/functions.js":
/*!***************************!*\
  !*** ./util/functions.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var objs = __webpack_require__(/*! ./objects */ "./util/objects.js");

function nop() {}

function nop$() {
  return Promise.resolve();
}

function unsupported() {
  throw new Error('Unsupported operation');
}

function unimplemented() {
  throw new Error('Unimplemented function');
}

function identity(v) {
  return v;
}

function sequence() {
  var fns = Array.prototype.filter.call(arguments, objs.isFunction);
  switch (fns.length) {
  case 0:
    return nop;
  case 1:
    return fns[0];
  default:
    return function() {
      for (var i = 0, len = fns.length; i < len; i++) {
        fns[i].apply(this, arguments); // eslint-disable-line no-invalid-this
      }
    };
  }
}

function catchFn(fn) {
  return function() {
    try {
      fn.apply(this, arguments); // eslint-disable-line no-invalid-this
    } catch(err) {
      console.error(err); // eslint-disable-line no-console
    }
  };
}

/**
 * Execute sync or async functions sequencially and return the first non-undefined value or its Promise.
 * @param {Array} fns - an array of functions
 * @return {*} the first non-undefined value
 */
function first(fns) {
  switch(fns.length) {
  case 0:
    return undefined;
  case 1:
    return fns[0]();
  default:
    return fns.slice().reverse().reduce(function(acc, fn) {
      return function(value) {
        if (value !== undefined) {
          return acc(value);
        }
        var v = fn();
        return v === undefined ? acc() : objs.isPromise(v) && acc !== identity ? v.then(acc) : v;
      };
    }, identity)();
  }
}

module.exports = {
  nop: nop,
  nop$: nop$,
  unsupported: unsupported,
  unimplemented: unimplemented,
  identity: identity,
  sequence: sequence,
  first: first,
  catch: catchFn
};


/***/ }),

/***/ "./util/http.js":
/*!**********************!*\
  !*** ./util/http.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
'use strict';
var uuidv4 = __webpack_require__(/*! ./uuidv4 */ "./util/uuidv4.js");
var logger = __webpack_require__(/*! ./logger */ "./util/logger.js");
// var device = require('./device');

// var rmaxLocalHost = 'http://127.0.0.1:58080/';
// var rmaxProdHost = '/* https://rmax.tenmax.io/ */';

function post(requestUrl, requestBody) {
  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', requestUrl, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(requestBody));
}

function log(message, requestBody) {
  return;

  // var currentScript = document.currentScript;
  // requestBody = requestBody || {};
  // requestBody.href = location.href;
  // requestBody.device = device.is;

  // var finalRequestBody = {
  //   message: '[adcode] ' + message,
  //   data: requestBody,
  // };

  // var host;
  // if (currentScript != null) {
  //   // TODO 為何 currentScript == null?
  // eslint-disable-line no-magic-numbers
  //   host = currentScript.getAttribute('src').indexOf('/0.0.0.0:') !== -1 ? rmaxLocalHost : rmaxProdHost;
  // } else {
  //   host = rmaxProdHost;
  // }
  // post(host + '/api/internal/log', finalRequestBody);
}

var STATUS_OK = 200;
var XHR_DONE = 4; // XMLHttpRequest.DONE, in case it's hacked by other JS

function resolveHost(host) {
  switch (host) {
  case 'uat':
    return '//https://uat-sspap2.momoshop.com.tw';
  case 'gamma':
    return '//https://gamma-sspap2.momoshop.com.tw';    
  case 'stage':
    return '/* https://beta-sspap2.momo.tenmax.tw */';
  case 'dev':
  case 'local':
    return '//http://localhost:58070';
  default:
    return '//https://sspap2.momoshop.com.tw';
  }
}

function getSessionStateApiPath(space, stateName, params) {
  var sessionId = space.sessionId;
  var spaceId = space.spaceId;
  var url = resolveHost(space.sspHost) + '/supply/{spaceId}/{sessionId}/state/{stateName}';
  url = url.replace('{spaceId}', spaceId);
  url = url.replace('{sessionId}', sessionId);
  url = url.replace('{stateName}', stateName);
  url += encodeQueryParams(params);
  return url;
}

function getMonitorApiPath(monitorName, space, params) {
  var url = resolveHost(space.sspHost) + '/api/monitor/{monitorName}';
  url = url.replace('{monitorName}', monitorName);
  url += encodeQueryParams(params);
  return url;
}

function logState$(stateName, space, params) {
  params = params || {};
  params['spaceId'] = space.spaceId;
  params['referer'] = space.master.referer;
  getRequest$(getSessionStateApiPath(space, stateName, params));
}

function monitor$(monitorName, space, params) {
  params = params || {};
  params['spaceId'] = space.spaceId;
  params['referer'] = space.master.referer;

  getRequest$(getMonitorApiPath(monitorName, space, params));
}

function getRequest$(url) {
  // TODO: timeout
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XHR_DONE) {
        if (xhr.status === STATUS_OK) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(xhr.status + ': ' + xhr.statusText));
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  });
}

function encodeQueryParams(params) {
  params.cacheBuster = misc.uuid();
  return '?' + Object.keys(params)
    .reduce(function(arr, key) {
      if (params.hasOwnProperty(key)) {
        var value = params[key];
        arr.push(encodeURIComponent(key) + (value !== undefined ? '=' + encodeURIComponent(value) : ''));
      }
      return arr;
    }, [])
    .join('&');
}

function get$(url, options) {
  if (typeof options === 'boolean') {
    options = {
      useWithCredentials: options
    };
  }
  options = options || {};
  var useWithCredentials = !!options.useWithCredentials;
  var headers = options.headers || {};

  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    if (!('withCredentials' in xhr)) {
      logger.warn('No \'withCredentials\' in HttpRequest');
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XHR_DONE) {
        if (xhr.status === STATUS_OK) {
          var result = xhr.responseText;
          resolve(result);
        } else {
          if (window.location.search.indexOf('debug') !== -1) {
            reject(new Error(xhr.status + ': ' + xhr.statusText));
          }
        }
      }
    };
    xhr.open('GET', url, true);
    Object.keys(headers).forEach(function(key) {
      xhr.setRequestHeader(key, headers[key]);
    });
    if (useWithCredentials) {
      xhr.withCredentials = true;
    }
    xhr.send();
  });
}

// so we can share the same map with another adcode instance
var styles$ = window._rmaxStyles$ || (window._rmaxStyles$ = {});

function loadCSS$(url) {
  if (!url) {
    throw new Error('CSS URL cannot be undefined.');
  }
  return styles$[url] || (styles$[url] = _loadCSS$(url));
}

function _loadCSS$(url) {
  return new Promise(function(resolve, reject) {
    if (document.head.querySelector('link[href="' + url + '"]')) {
      // already exist, but not loaded via our API, can't tell if it's ready
      // TODO: shall we wait for like 100ms?
      resolve();
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.addEventListener('load', resolve, false);
    link.addEventListener('error', reject, false);

    // kick off
    link.href = url;
    document.head.appendChild(link);
  });
}

var inlineStyles = window._rmaxInlineStyles || (window._rmaxInlineStyles = {});

function installCSS(key, content) {
  if (inlineStyles[key]) {
    return;
  }
  inlineStyles[key] = true;
  var style = document.createElement('style');
  style.textContent = content;
  document.head.appendChild(style);
}

function loadJS$(url, mode) {
  if (!url) {
    throw new Error('JS URL cannot be undefined.');
  }
  return scripts$[url] || (scripts$[url] = _loadJS$(url, mode));
}

// so we can share the same map with another adcode instance
var scripts$ = window._rmaxScripts$ || (window._rmaxScripts$ = {});

function _loadJS$(url, mode) {
  return new Promise(function(resolve, reject) {
    if (document.querySelector('script[src="' + url + '"]')) {
      // already exist, but not loaded via our API, can't tell if it's ready
      // TODO: shall we wait for like 100ms?
      resolve();
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = resolve;
    script.onerror = reject;
    switch (mode) {
    case 'async':
      script.setAttribute('async', 'async');
      break;
    case 'defer':
      script.setAttribute('defer', 'defer');
      break;
    }

    // kick off
    document.body.appendChild(script);
    script.src = url;
  });
}

// TODO: deprecate with adsense
function loadJS(url, sync, onloadCallback, onerrorCallback) {
  if (url == null) {
    return null;
  }

  var scriptElement = document.body.querySelector('script[src="' + url + '"]');
  if (scriptElement) {
    onloadCallback && onloadCallback();
    return null;
  }
  scriptElement = document.createElement('script');
  scriptElement.onload = onloadCallback;
  scriptElement.onerror = onerrorCallback;
  scriptElement.type = 'text/javascript';
  if (!sync) {
    scriptElement.setAttribute('defer', true);
  }
  document.body.appendChild(scriptElement);
  scriptElement.src = url;

  return scriptElement;
}

function _importJS$(url) {
  // TODO: take options which specifies element container, module container
  var uuid = uuidv4();
  var resolvers = window._moduleResolvers || (window._moduleResolvers = {});
  var script;
  return get$(url)
    .then(function(content) {
      return 'var module = {exports: {}};\n' +
        '(function(module) {\n' + content + '\n})(module);\n' +
        'window._moduleResolvers["' + uuid + '"](module.exports);';
    })
    .then(function(content) {
      return new Promise(function(resolve, reject) {
        resolvers[uuid] = resolve;
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.text = content;
        document.body.appendChild(script);
      });
    })
    .then(function(module) {
      delete resolvers[uuid];
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      return module;
    }).catch(function(err) {
      throw err;
    });
}
var _importedJSCache$ = {};

function importJS$(url) {
  if (!url) {
    throw new Error('Cannot import JS from empty URL.');
  }
  return _importedJSCache$[url] || (_importedJSCache$[url] = _importJS$(url));
}

function encodeQueryParams(params) {
  return '?' + Object.keys(params)
    .reduce(function(arr, key) {
      if (params.hasOwnProperty(key)) {
        var value = params[key];
        arr.push(encodeURIComponent(key) + (value !== undefined ? '=' + encodeURIComponent(value) : ''));
      }
      return arr;
    }, [])
    .join('&');
}

module.exports = {
  // TODO: merge get$ & post
  post: post,
  log: log,
  logState$: logState$,
  monitor$: monitor$,
  get$: get$,
  installCSS: installCSS,
  loadCSS$: loadCSS$,
  loadJS: loadJS,
  loadJS$: loadJS$,
  importJS$: importJS$,
  encodeQueryParams: encodeQueryParams
};


/***/ }),

/***/ "./util/logger.js":
/*!************************!*\
  !*** ./util/logger.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nop = __webpack_require__(/*! ./functions */ "./util/functions.js").nop;

function print(level) {
  // eslint-disable-next-line no-console
  return console[level].bind(
    console,
    '%cDr%cMax%c',
    'padding: 0.2em 0 0.2em 0.5em; font-weight:700; background: #111; color: #66ffcc',
    'padding: 0.2em 0.5em 0.2em 0; font-weight:700; background: #111; color: #9999ff',
    'background: inherit; color: inherit');
}

/**
 * Logger utility. They do nothing under production environment, so real implementation are under shim/dev.
 */
module.exports = {
  /**
   * Print an error message to the console
   * @param {String} level: error/warn/log
   * @return {Function} a logging function of corresponding level
   */
  print: print,
  /**
   * Print an error message to the console
   * @param {String} message
   */
  error: print('error'),
  /**
   * Print a warning message to the console
   * @param {String} message
   */
  warn: nop,
  /**
   * Print a message to the console
   * @param {String} message
   */
  log: nop
};


/***/ }),

/***/ "./util/node-insert-observer.js":
/*!**************************************!*\
  !*** ./util/node-insert-observer.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _hasAddedNodes(mutations) {
  for (var i = 0, len = mutations.length; i < len; i++) {
    if (mutations[i].addedNodes.length > 0) {
      return true;
    }
  }
  return false;
}

function _disconnect() {
  this._disconnect && this._disconnect();
  this._disconnect = undefined;
}

function ObserverBasedNodeInsertObserver(element, callback) {
  var observer = new MutationObserver(function(mutations) {
    _hasAddedNodes(mutations) && callback();
  });
  observer.observe(element, {
    childList: true,
    subtree: true
  });
  this._disconnect = observer.disconnect.bind(observer);
}

Object.assign(ObserverBasedNodeInsertObserver.prototype, {
  disconnect: _disconnect
});

var EVENT_NAME = 'DOMNodeInserted';
function EventBasedNodeInsertObserver(element, options, callback) {
  element.addEventListener(EVENT_NAME, callback, false);
  this._disconnect = element.removeEventListener.bind(element, EVENT_NAME, callback, false);
}

Object.assign(EventBasedNodeInsertObserver.prototype, {
  disconnect: _disconnect
});

module.exports = window.MutationObserver ? ObserverBasedNodeInsertObserver : EventBasedNodeInsertObserver;


/***/ }),

/***/ "./util/objects.js":
/*!*************************!*\
  !*** ./util/objects.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}

function asArray(object) {
  return (object === undefined || object === null) ? [] : Array.isArray(object) ? object : [object];
}

// remove null or undefined
function trim(obj) {
  return Object.keys(obj).reduce(function(acc, k) {
    var val = obj[k];
    if (val !== undefined && val !== null) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
}

function isFunction(v) {
  return typeof v === 'function';
}

function isPromise(v) {
  return typeof v === 'object' && isFunction(v.then);
}

module.exports = {
  inherit: inherit,
  asArray: asArray,
  trim: trim,
  isFunction: isFunction,
  isPromise: isPromise
};


/***/ }),

/***/ "./util/page-visibility.js":
/*!*********************************!*\
  !*** ./util/page-visibility.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var logger = __webpack_require__(/*! ./logger */ "./util/logger.js");

var KEY_HIDDEN, EVENT_NAME_VISIBILITY_CHANGE;
if (typeof document.hidden !== 'undefined') {
  KEY_HIDDEN = 'hidden';
  EVENT_NAME_VISIBILITY_CHANGE = 'visibilitychange';
/*
} else if (typeof document.msHidden !== 'undefined') {
  KEY_HIDDEN = 'msHidden';
  EVENT_NAME_VISIBILITY_CHANGE = 'msvisibilitychange';
*/
} else if (typeof document.webkitHidden !== 'undefined') {
  // Andriod 4.4
  KEY_HIDDEN = 'webkitHidden';
  EVENT_NAME_VISIBILITY_CHANGE = 'webkitvisibilitychange';
}

function isVisible() {
  return !document[KEY_HIDDEN];
}

function _deduplicate(callback) {
  var previousValue;
  return function(value) {
    if (value === previousValue) {
      return;
    }
    try {
      callback(value);
    } catch(err) {
      logger.error(err);
    }
    previousValue = value;
  };
}

// it's ok to have module global here
var _callbacks = [];
function _check() {
  var visible = isVisible();
  _callbacks.forEach(function(c) {
    c(visible);
  });
}

function _off(deduplicatedCallback) {
  var i = _callbacks.indexOf(deduplicatedCallback);
  if (i < 0) {
    return;
  }
  _callbacks.splice(i, 1);
  if (_callbacks.length === 0) {
    document.removeEventListener(EVENT_NAME_VISIBILITY_CHANGE, _check, false);
  }
}

function observe(callback) {
  var deduplicatedCallback = _deduplicate(callback);

  // init for the first one
  if (_callbacks.length === 0) {
    /*
     2022-11-30 :
      發現當 adcode 在 iframe 裡面的時候, 切換視窗會觸發 EVENT_NAME_VISIBILITY_CHANGE
      然後就會被送出 無法被辨識的 viewable event,
      -> 改成當 adcode 不在 iframe 裡面才加入這個 event
     */
    if (window.top === window) {
      document.addEventListener(EVENT_NAME_VISIBILITY_CHANGE, _check, false);
    }
  }
  _callbacks.push(deduplicatedCallback);

  // so it won't invoke before disconnection function is ready
  setTimeout(function() {
    deduplicatedCallback(isVisible());
  }, 0);

  // disconnect function
  return function disconnect() {
    _off(deduplicatedCallback);
  };
}

module.exports = {
  isVisible: isVisible,
  observe: observe
};


/***/ }),

/***/ "./util/polyfills.js":
/*!***************************!*\
  !*** ./util/polyfills.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Array.prototype.find !== 'function') {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(callback) {
      if (this === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      } else if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function');
      }
      var list = Object(this);
      // Makes sures is always has an positive integer as length.
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      for (var i = 0; i < length; i++) {
        var element = list[i];
        if ( callback.call(thisArg, element, i, list) ) {
          return element;
        }
      }
      return undefined;
    }
  });
}

// /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign */
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

// polyfill for IE11
if (!window.location.origin) {
  window.location.origin = window.location.protocol + '//' + window.location.hostname
    + (window.location.port ? ':' + window.location.port : '');
}

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, thisLen) {
    if (thisLen === undefined || thisLen > this.length) {
      thisLen = this.length;
    }
    return this.substring(thisLen - search.length, thisLen) === search;
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}


/***/ }),

/***/ "./util/promises.js":
/*!**************************!*\
  !*** ./util/promises.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var objs = __webpack_require__(/*! ./objects */ "./util/objects.js");
var fns = __webpack_require__(/*! ./functions */ "./util/functions.js");

function promisify$(value) {
  return objs.isPromise(value) ? value : Promise.resolve(value);
}

/**
 * Execute sync or async functions sequencially and return the first non-undefined value or its Promise.
 * @param {Array} functions - an array of functions
 * @return {*} the first non-undefined value, or a Promise of such.
 */
function first(functions) {
  switch(functions.length) {
  case 0:
    return undefined;
  case 1:
    return functions[0]();
  default:
    return functions.slice().reverse().reduce(function(acc, fn) {
      return function(value) {
        if (value !== undefined) {
          return acc(value);
        }
        var v = fn();
        return v === undefined ? acc() : objs.isPromise(v) && acc !== fns.identity ? v.then(acc) : v;
      };
    }, fns.identity)();
  }
}

function any$(promises) {
  return new Promise(function(resolve, reject) {
    var rejectCount = 0,
      rejects = [];
    for (var i = 0, length = promises.length; i < length; i++) {
      (function(j) { // IIFE, to give the index number a scope
        promises[j].then(function(v) {
          resolve({
            index: j,
            value: v
          });
        }, function(r) {
          rejects[j] = r;
          rejectCount++;
          if (rejectCount === length) {
            reject(rejects);
          }
        });
      })(i);
    }
  });
}

function wait$(fn, options) {
  options = options || {};
  var interval = options.interval || 100; // eslint-disable-line no-magic-numbers
  var retryLimit = options.retryLimit || 20; // eslint-disable-line no-magic-numbers
  return new Promise(function(resolve, reject) {
    var retryCount = 0, intervalId;
    function exit() {
      intervalId && clearInterval(intervalId);
    }
    function trial() {
      var value;
      try {
        value = fn();
      } catch(err) {
        exit();
        reject(err);
      }
      if (value !== undefined) {
        exit();
        resolve(value, retryCount);
      } else {
        if (retryCount >= retryLimit) {
          exit();
          reject(new Error('Reach maximum retry: ' + retryCount));
        }
        retryCount++;
      }
    }
    intervalId = setInterval(trial, interval);
    trial();
  });
}

module.exports = {
  promisify$: promisify$,
  first: first,
  any$: any$,
  wait$: wait$
};


/***/ }),

/***/ "./util/pseudo-weak-map.js":
/*!*********************************!*\
  !*** ./util/pseudo-weak-map.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var uuidv4 = __webpack_require__(/*! ./uuidv4 */ "./util/uuidv4.js");

function PseudoWeakMap(propKey) {
  // TODO: shall use Symbol when available
  this._propKey = propKey || uuidv4();
}

PseudoWeakMap.prototype = {
  delete: function(key) {
    delete key[this._propKey];
  },
  get: function(key) {
    return key[this._propKey];
  },
  has: function(key) {
    return Object.prototype.hasOwnProperty.call(key, this._propKey);
  },
  set: function(key, value) {
    key[this._propKey] = value;
  }
};

module.exports = PseudoWeakMap;


/***/ }),

/***/ "./util/rect.js":
/*!**********************!*\
  !*** ./util/rect.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

var _STRICTLY_EMPTY = Object.freeze({
  isEmpty: true,
  isStrcitlyEmpty: true,
  top: NaN,
  left: NaN,
  bottom: NaN,
  right: NaN,
  width: 0,
  height: 0,
  area: 0,
  intersect: function() {
    return _STRICTLY_EMPTY;
  },
  offset: function() {
    return _STRICTLY_EMPTY;
  },
  contain: function() {
    return false;
  },
  equals: function(other) {
    return other === _STRICTLY_EMPTY;
  }
});

function Rect(data) {
  if (data === _STRICTLY_EMPTY || data instanceof Rect) {
    return data;
  }
  if (data instanceof Window) {
    data = {
      top: 0,
      left: 0,
      bottom: data.innerHeight,
      right: data.innerWidth
    };
  } else if (data instanceof Element) {
    data = data.getBoundingClientRect();

    if (data.top === 0 && data.bottom === 0 &&
        data.left === 0 && data.right === 0 &&
        data.width === 0 && data.height === 0) {
      // consider this hidden element
      return _STRICTLY_EMPTY; // as factory
    }
  }

  this.top = data.top;
  this.left = data.left;
  this.bottom = data.bottom;
  this.right = data.right;
  this.width = this.right - this.left;
  this.height = this.bottom - this.top;
  this.isEmpty = this.width <= 0 || this.height <= 0;

  var strcitlyEmpty = this.isEmpty && (this.width < 0 || this.height < 0);
  if (strcitlyEmpty) {
    return _STRICTLY_EMPTY; // as factory
  } else {
    this.area = this.isEmpty ? 0 : (this.width * this.height);
  }

  Object.freeze(this);
}

Rect.strictlyEmpty = function() {
  return _STRICTLY_EMPTY;
};

Rect.prototype = {
  isStrcitlyEmpty: false,
  intersect: function(other) {
    if (!other) {
      return this;
    }
    if (other.isStrcitlyEmpty) {
      return Rect.strictlyEmpty();
    }
    return new Rect({
      top: Math.max(this.top, other.top),
      left: Math.max(this.left, other.left),
      bottom: Math.min(this.bottom, other.bottom),
      right: Math.min(this.right, other.right)
    });
  },
  offset: function(offset) {
    var top = offset.top || offset.y || 0;
    var left = offset.left || offset.x || 0;
    return new Rect({
      top: this.top + top,
      left: this.left + left,
      bottom: this.bottom + top,
      right: this.right + left,
    });
  },
  contain: function(other) {
    if (other.x !== undefined && other.y !== undefined) {
      other = new Rect({
        left: other.x,
        right: other.x,
        top: other.y,
        bottom: other.y
      });
    } else {
      other = new Rect(other);
    }
    return !other.isStrcitlyEmpty &&
      this.top <= other.top && this.bottom >= other.bottom &&
      this.left <= other.left && this.right >= other.right;
  },
  equals: function(other) {
    return other && other !== _STRICTLY_EMPTY &&
      this.top === other.top &&
      this.left === other.left &&
      this.bottom === other.bottom &&
      this.right === other.right;
  }
};

Rect.intersect = function() {
  return Array.prototype.reduce.call(arguments, function(acc, rect) {
    rect = new Rect(rect);
    return acc && acc.intersect(rect) || rect;
  });
};

module.exports = Rect;


/***/ }),

/***/ "./util/tracker.js":
/*!*************************!*\
  !*** ./util/tracker.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint no-magic-numbers: 0 */
var util = __webpack_require__(/*! ../util/common */ "./util/common.js");
var http = __webpack_require__(/*! ./http */ "./util/http.js");
var url = __webpack_require__(/*! ./url */ "./util/url.js");
var logger = __webpack_require__(/*! ./logger */ "./util/logger.js");
var AdcodeError = __webpack_require__(/*! ../adcodeError */ "./adcodeError.js");

// TODO: may move into rmaxads
var version = util.version;

function setVersion(ver) {
  version = ver;
}

function printCause(cause) {
  if (cause instanceof window.Event) {
    return '[' + cause.constructor.name + '] ' + cause.type + ': ' + cause.message;
  }
  return '' + cause;
}

function handleAdcodeError(endPoint, error, extraContext) {
  try {
    if (error === undefined || error === null) {
      error = new Error(); // TODO: how to deal with this?
    }
    if (!AdcodeError.isAdcodeError(error)) {
      // normailize to AdcodeError
      error = new AdcodeError(AdcodeError.TYPES.GENERAL_ERROR, error);
    }
    var type = error.type;
    var cause = error.cause;
    var errorCode = type.code || AdcodeError.TYPES.GENERAL_ERROR.code;
    var errorContext = error.context ? Object.assign({}, error.context ) : {}; // shallow copy
    errorContext.message = type.message + (cause && (' caused by: ' + printCause(cause)) || '');
    // errorContext.stack =
    if (errorCode === AdcodeError.TYPES.GENERAL_ERROR.code && cause && cause.stack) {
      // TODO: we need to beautify the stack
      // /* https://stackoverflow.com/questions/24637356/javascript-debug-stack-trace-with-source-maps */
      // errorContext.stack = cause.stack;
    }
    if (!type.sampling || Math.random() < type.sampling) {
      var requestBody = Object.assign({
        version: version,
        referer: url.getHostObject().hrefAsReferer,
        errorCode: errorCode,
        errorContext: errorContext
      }, extraContext || {});
      http.post(endPoint, requestBody);
    }
  } catch (error2) {
    // eats error here so it won't echo from uncaucht error handler
    logger.error(error2);
  }
  if (error && error.isUserError) {
    // user callback error, shall report to console even in production
    window.console.error(error.cause || error);
  } else {
    if (window.location.search.indexOf('debug') !== -1) {
      (error && error.isWarning ? logger.warn : logger.error)(error, extraContext);
    }
  }
}

module.exports = {
  error: handleAdcodeError,
  setVersion: setVersion
};


/***/ }),

/***/ "./util/url.js":
/*!*********************!*\
  !*** ./util/url.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* eslint no-magic-numbers: 0 */

// 抓取 url 規則
// 一般iframe: > top.location.href / doc.referrer
// 一般: link[rel='canonical'] > meta[property='og:url'] > location.href
// 以上都沒有的話就直接建 hostObj 看此頁面的 location
function getPageUrl(win) {
  win = win || window;
  var doc = win.document;
  var url = '';

  if (win.self !== win.top) { // for IE access denied issue
    try {
      doc = win.top.document; // in safeFrame will error
    } catch(e) {
      url = doc.referrer;
    }
  }

  /* ref: canonical link > og:url > location.href */
  if (!url && doc.querySelector('link[rel="canonical"]')) {
    url = doc.querySelector('link[rel="canonical"]').href;
  }

  if (!url && doc.querySelector('meta[property="og:url"]')) {
    url = doc.querySelector('meta[property="og:url"]').content;
  }
  if (!url) {
    url = doc.location.href;
  }

  url = url.replace(/([^:]\/)\/+/g, '$1'); // clean up

  // url === 'https://' or 'http://', then
  if (url.replace(/http[s]*:\/\//, '') === '') {
    url = doc.location.href;
  }

  return url;
}

var _hostObject;
function getCachedHostObject() {
  return _hostObject || (_hostObject = getHostObject());
}

function getHostObject(win) {
  win = win || window;

  var pageUrl = getPageUrl(win);
  var hostObj = win.document.createElement('a');
  hostObj.href = pageUrl;
  if (!hostObj.href.startsWith('file://')) { // TODO: refactor this
    hostObj.hrefAsReferer = hostObj.href;
  }

  if (!hostObj.origin) {
    hostObj.origin = hostObj.protocol + '//' + hostObj.hostname + (hostObj.port ? ':' + hostObj.port : '');
  }

  return hostObj;
}

function stripEndingSlash(url) {
  return url && url.endsWith('/') ? url.substring(0, url.length - 1) : url;
}

// KNOWN ISSUE: host with protocol in IE will have port value
function normalizeHost(host) {
  if (!window.document) {
    // drone build implementation, refactor later
    if (host.substring(0, 2) === '//') {
      host = 'http:' + host;
    }
    return host;
  }

  var hostObj = window.document.createElement('a');
  hostObj.href = host;

  var href = hostObj.href;
  if (href && href.startsWith('file://')) {
    var url = '//https://' + href.substring(7); // eslint-disable-line no-magic-numbers
    return stripEndingSlash(url);
  }
  if (hostObj.origin) {
    return hostObj.origin;
  }
  var protocol = hostObj.protocol;
  if (!protocol || protocol === ':') {
    protocol = window.location.protocol;
  }
  if (protocol !== 'http:' || protocol !== 'https:') {
    protocol = 'https:';
  }
  return protocol + '//' + hostObj.hostname + (hostObj.port ? ':' + hostObj.port : '');
}

module.exports = {
  hostObject: getCachedHostObject,
  getHostObject: getHostObject,
  normalizeHost: normalizeHost
};


/***/ }),

/***/ "./util/uuidv1-ts.js":
/*!***************************!*\
  !*** ./util/uuidv1-ts.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

function ts(uuid) {
  var arr = uuid.split('-');
  var str = arr[2].substring(1) + arr[1] + arr[0];
  return Math.floor((parseInt(str, 16) - 122192928000000000) / 10000); // eslint-disable-line no-magic-numbers
}

module.exports = ts;


/***/ }),

/***/ "./util/uuidv4.js":
/*!************************!*\
  !*** ./util/uuidv4.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* eslint no-magic-numbers: 0 */

function uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    // use high-precision timer if available
    d += performance.now();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

module.exports = uuid;


/***/ }),

/***/ "./util/visibility.js":
/*!****************************!*\
  !*** ./util/visibility.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Promise = __webpack_require__(/*! src/polyfill/promise */ "./polyfill/promise.js");
var CONSTANTS = __webpack_require__(/*! ../constants */ "./constants.js");
var fns = __webpack_require__(/*! ./functions */ "./util/functions.js");
var ContinuousStateObserver = __webpack_require__(/*! ./continuous-state-observer */ "./util/continuous-state-observer.js");
var PseudoWeakMap = __webpack_require__(/*! ./pseudo-weak-map */ "./util/pseudo-weak-map.js");
var util = __webpack_require__(/*! ./common */ "./util/common.js");
var logger = __webpack_require__(/*! ./logger */ "./util/logger.js");
var dom = __webpack_require__(/*! ./dom */ "./util/dom.js");
var device = __webpack_require__(/*! ./device */ "./util/device.js");
var Rect = __webpack_require__(/*! ./rect */ "./util/rect.js");
var pageVisibility = __webpack_require__(/*! ./page-visibility */ "./util/page-visibility.js");

var IntersectionObserver = window.IntersectionObserver;
var DataMap = window.WeakMap || PseudoWeakMap;

// TODO: export isAlwaysUndetermined instead
var isInRegularIframe = dom.isInIframe && !dom.isInSafeframe;

function _isElement(obj) {
  return obj instanceof Element;
}

function _asArray(obj) {
  return obj === undefined ? [] :
    Array.isArray(obj) ? obj.filter(_isElement) :
      obj.length ? Array.prototype.filter.call(obj, _isElement) : [obj];
}

function _dedupedCallback(callback) {
  var previousSignal;
  var previousUndetermined;
  return function(signal, undetermined, visibleRatio) {
    undetermined = !!undetermined;
    if (signal !== previousSignal || undetermined !== previousUndetermined) {
      try {
        callback(signal, undetermined, undetermined ? NaN : visibleRatio);
      } catch(err) {
        logger.error(err);
      }
      previousSignal = signal;
      previousUndetermined = undetermined;
    }
  };
}

function _thresholdedCallback(threshold, callback) {
  var dedupedCallback = _dedupedCallback(callback);
  return function(visibleRatio, undetermined) {
    // when undetermined, signal = false, visibleRatio = NaN
    var signal = !undetermined && !isNaN(visibleRatio) && visibleRatio > threshold;
    dedupedCallback(signal, undetermined, visibleRatio);
  };
}


// IntersectionObserver //
/*
 * Also works inside iframe.
 * Limitation: only works for single target.
 */
function SingleTargetVisibilityObserver(target, threshold, callback) {
  var thresholdedCallback = _thresholdedCallback(threshold, callback);
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      try {
        if (entry.target === target) {
          thresholdedCallback(entry.intersectionRatio);
        }
      } catch(err) {
        logger.error(err);
      }
    });
  }, {
    threshold: [0, threshold]
  });
  observer.observe(target);

  this.disconnect = function() {
    observer.disconnect();
  };
}

SingleTargetVisibilityObserver.prototype.update = fns.nop;

var INTERCEPTING_SIZE = 0.05;
var INTERCEPTING_THRESHOLDS = [];
for (var i = 0; i <= 1; i += INTERCEPTING_SIZE) {
  INTERCEPTING_THRESHOLDS.push(i);
}

function MultiTargetVisibilityObserver(targets, threshold, callback) {
  var areaMap = new DataMap();
  var thresholdedCallback = _thresholdedCallback(threshold, callback);
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var target = entry.target;
      var bcr = entry.boundingClientRect;
      var ir = entry.intersectionRect;
      areaMap.set(target, {
        visible: ir.width * ir.height,
        total: bcr.width * bcr.height
      });
    });
    var sums = targets.reduce(function(acc, target) {
      var area = areaMap.get(target);
      if(area) {
        acc[0] += area.visible;
        acc[1] += area.total;
      }
      return acc;
    }, [0, 0]);
    thresholdedCallback(sums[0] / sums[1]);
  }, {
    threshold: INTERCEPTING_THRESHOLDS
  });
  targets.forEach(observer.observe.bind(observer));

  this.disconnect = function() {
    observer.disconnect();
  };
}

MultiTargetVisibilityObserver.prototype.update = fns.nop;

function ModernVisibilityObserver(targets, options, callback) {
  // factory function
  var threshold = options.threshold;
  return targets.length === 1 ?
    new SingleTargetVisibilityObserver(targets[0], threshold, callback) :
    new MultiTargetVisibilityObserver(targets, threshold, callback);
}


// legacy //
/*
 * Return [visibleRatio, undetermined]
 */
function _computeVisiblePercentage(targets, viewport) {
  viewport = dom.isInIframe ? viewport : new Rect(window);
  if (!viewport) {
    return [NaN, true];
  }
  var rects = _asArray(targets)
    .map(function(r) {
      return new Rect(r);
    })
    .filter(function(r) {
      // exclude hidden targets
      return !r.isStrcitlyEmpty;
    });
  if (rects.length === 0) {
    return [NaN, false];
  }
  var areaSum = rects.reduce(function(acc, rect) {
    return acc + rect.area;
  }, 0);
  var visibleAreaSum = rects.reduce(function(acc, rect) {
    return acc + rect.intersect(viewport).area;
  }, 0);

  if (areaSum > 0) {
    // regular case: they have non-zero area sum
    return [visibleAreaSum / areaSum, false];
  }
  // they are all zero-size targets, in such case, every target inside viewport scores 1 point
  var inViewportCount = rects.reduce(function(acc, rect) {
    return acc + (viewport.contain(rect) ? 1 : 0);
  }, 0);

  return [inViewportCount / rects.length, false];
}

function LegacyVisibilityObserver(targets, options, callback) {
  var thresholdedCallback = _thresholdedCallback(options.threshold, callback);
  var self = this;
  var throttledCheck = this._throttledCheck = util.throttle(function() {
    var info = _computeVisiblePercentage(targets, self._viewport);
    thresholdedCallback(info[0], info[1]);
  }, CONSTANTS.THROTTLE_INTERVAL);

  if (!dom.isInIframe || this._viewport) {
    // if viewport is not ready, start to listen only after first update()
    this._listenOnWindowChange();
  }

  // avoid invoking callback inside constructor, as disconnect function is not ready yet
  setTimeout(throttledCheck, 0);
}

function _computeViewport(viewportInfo) {
  var windowSize = viewportInfo.window;
  var windowViewPort = new Rect({
    top: 0,
    left: 0,
    bottom: windowSize.height,
    right: windowSize.width
  });
  var iframe = viewportInfo.iframe;
  iframe.bottom = iframe.bottom || iframe.top + window.innerHeight;
  iframe.right = iframe.right || iframe.left + window.innerWidth;
  iframe = new Rect(iframe);
  return windowViewPort.intersect(iframe).offset({
    left: -iframe.left,
    top: -iframe.top
  });
}

LegacyVisibilityObserver.prototype._listenOnWindowChange = function() {
  if (this._disconnectWindowChange) {
    return;
  }
  this._disconnectWindowChange = dom.onWindowChange(this._throttledCheck, false);
};

LegacyVisibilityObserver.prototype.disconnect = function() {
  this._disconnectWindowChange && this._disconnectWindowChange();
  this._disconnectWindowChange = this._throttledCheck = undefined;
};

LegacyVisibilityObserver.prototype.update = function(viewportInfo) {
  if (!this._throttledCheck) { // disconnected
    return;
  }
  if (viewportInfo) {
    this._viewport = _computeViewport(viewportInfo);
    this._listenOnWindowChange(); // start to listen, if not yet
  }
  this._throttledCheck();
};


// SafeFrame //
var PERCENTAGE_DIVIDER = 100;
function SafeFrameVisibilityObserver(options, callback) {
  var threshold = options.threshold;
  var thresholdedCallback = _thresholdedCallback(threshold, callback);
  var cb = function() {
    thresholdedCallback(window.$sf.ext.inViewPercentage() / PERCENTAGE_DIVIDER);
  };
  this.disconnect = dom.listenToSafeFrameStatus(function(status, data) {
    if (status === 'geom-update') {
      cb();
    }
  });
  setTimeout(cb, 0); // defer to next event loop, for user is likely to call disconnect in the callback
}

SafeFrameVisibilityObserver.prototype.update = fns.nop;


// MRAID //
/*
var mraid = window.mraid;
function _onMRAIDReady(callback) {
  if (mraid.getState() === 'loading') {
    mraid.addEventListener('ready', callback);
  } else {
    callback();
  }
}

var PSEUDO_MRAID_VISIBILITY_THRESHOLD = 0.5;
function MRAIDVisibilityObserver(callback) {
  var thresholdedCallback = _thresholdedCallback(PSEUDO_MRAID_VISIBILITY_THRESHOLD, callback);
  var cb = function(viewable) {
    thresholdedCallback(viewable ? 1 : 0);
  };
  mraid.addEventListener('viewableChange', cb);
  this.disconnect = function() {
    mraid.removeEventListener('viewableChange', cb);
  };
  // defer to next event loop, for user is likely to call disconnect in the callback
  setTimeout(function() {
    _onMRAIDReady(function() {
      cb(mraid.isViewable());
    });
  }, 0);
}

MRAIDVisibilityObserver.prototype.update = fns.nop;
*/

// Chrome //
function ChromeVisibilityObserver(targets, options, callback) {
  callback = _dedupedCallback(callback);
  var self = this;
  this._disconnectPageObserver = pageVisibility.observe(this._onPageVisible.bind(this));
  this._modern = new ModernVisibilityObserver(targets, options, function() {
    // just in case Chrome is fixed in future version
    if (self._pageVisible !== false) {
      callback.apply(undefined, arguments);
    }
  });
  this._createLegacy = function() {
    return new LegacyVisibilityObserver(targets, options, callback);
  };
}

ChromeVisibilityObserver.prototype._onPageVisible = function(visible) {
  if (this._pageVisible === visible) {
    return;
  }
  this._pageVisible = visible;
  if (visible) {
    this._legacy && this._legacy.disconnect();
    this._legacy = undefined;
  } else {
    this._legacy = this._legacy || this._createLegacy();
    if (this._viewport) {
      this._legacy.update(this._viewport);
      this._viewport = undefined;
    }
  }
};

ChromeVisibilityObserver.prototype.update = function(viewport) {
  if (!viewport || this._disconnected) {
    return;
  }
  if (this._pageVisible) {
    // queue viewport information, so we have a value as soon as page is hidden
    this._viewport = viewport;
  } else {
    // direct update
    this._legacy && this._legacy.update(viewport);
  }
};

ChromeVisibilityObserver.prototype.disconnect = function() {
  if (this._disconnected) {
    return;
  }
  this._disconnected = true;
  this._disconnectPageObserver();
  this._modern.disconnect();
  this._legacy && this._legacy.disconnect();
  this._disconnectPageObserver = this._modern = this._legacy = undefined;
};


// VisibilityObserver entry point //
function VisibilityObserver(targets, options, callback) {
  // factory function
  targets = _asArray(targets);
  if (targets.length === 0) {
    // TODO
  }
  if (dom.isInSafeframe) {
    return new SafeFrameVisibilityObserver(options, callback);
  }
  if (IntersectionObserver) {
    return device.isChromeOrOpera ?
      new ChromeVisibilityObserver(targets, options, callback) :
      new ModernVisibilityObserver(targets, options, callback);
  }

  return new LegacyVisibilityObserver(targets, options, callback);
}


// viewable //
function ViewabilityObserver(targets, options) {
  var voOptions = {
    threshold: options.visibilityThreshold
  };
  var csoOptions = {
    threshold: options.timeoutThreshold
  };
  var fulfillAtUndetermined = options.fulfillAtUndetermined !== false; // default true
  var VisibilityObserverClass = options.VisibilityObserver || VisibilityObserver;
  var self = this;
  this.fulfilled$ = new Promise(function(resolve, reject) {
    var cso = new ContinuousStateObserver(csoOptions, function(state) {
      if (state) {
        fulfill(false);
      }
    });
    var vo = self._visibilityObserver =
      new VisibilityObserverClass(targets, voOptions, function(visible, undetermined) {
        if (fulfillAtUndetermined && undetermined) {
          fulfill(true);
          return;
        }
        cso.update(!undetermined && visible);
      });
    function fulfill(undetermined) {
      vo.disconnect();
      cso.disconnect();
      resolve(undetermined);
    }
  });
}

ViewabilityObserver.prototype.update = function(viewportInfo) {
  var observer = this._visibilityObserver;
  observer && observer.update && observer.update(viewportInfo);
};

module.exports = {
  isInRegularIframe: isInRegularIframe,
  VisibilityObserver: VisibilityObserver,
  ViewabilityObserver: ViewabilityObserver
};


/***/ }),

/***/ 0:
/*!*****************************************************!*\
  !*** multi ./util/polyfills.js ./entry/standard.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./util/polyfills.js */"./util/polyfills.js");
module.exports = __webpack_require__(/*! ./entry/standard.js */"./entry/standard.js");


/***/ })

/******/ });
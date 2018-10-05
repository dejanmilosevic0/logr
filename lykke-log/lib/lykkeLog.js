(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("lykkeLog", [], factory);
	else if(typeof exports === 'object')
		exports["lykkeLog"] = factory();
	else
		root["lykkeLog"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/structured-log/dist/structured-log.js":
/*!************************************************************!*\
  !*** ./node_modules/structured-log/dist/structured-log.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function (global, factory) {
     true ? factory(exports) :
    undefined;
}(this, (function (exports) { 'use strict';

const __assign = Object.assign || function (target) {
    for (var source, i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (var prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
    Object.assign = function (target, varArgs) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

/**
 * Represents the severity level of a log event.
 */

(function (LogEventLevel) {
    LogEventLevel[LogEventLevel["off"] = 0] = "off";
    LogEventLevel[LogEventLevel["fatal"] = 1] = "fatal";
    LogEventLevel[LogEventLevel["error"] = 3] = "error";
    LogEventLevel[LogEventLevel["warning"] = 7] = "warning";
    LogEventLevel[LogEventLevel["information"] = 15] = "information";
    LogEventLevel[LogEventLevel["debug"] = 31] = "debug";
    LogEventLevel[LogEventLevel["verbose"] = 63] = "verbose";
})(exports.LogEventLevel || (exports.LogEventLevel = {}));
/**
 * Checks if a log event level includes the target log event level.
 * @param {LogEventLevel} level The level to check.
 * @param {LogEventLevel} target The target level.
 * @returns True if the checked level contains the target level, or if the checked level is undefined.
 */
function isEnabled(level, target) {
    return typeof level === 'undefined' || (level & target) === target;
}
/**
 * Represents a log event.
 */
var LogEvent = /** @class */ (function () {
    /**
     * Creates a new log event instance.
     */
    function LogEvent(timestamp, level, messageTemplate, properties, error) {
        this.timestamp = timestamp;
        this.level = level;
        this.messageTemplate = messageTemplate;
        this.properties = properties || {};
        this.error = error || null;
    }
    return LogEvent;
}());

var tokenizer = /\{@?\w+}/g;
/**
 * Represents a message template that can be rendered into a log message.
 */
var MessageTemplate = /** @class */ (function () {
    /**
     * Creates a new MessageTemplate instance with the given template.
     */
    function MessageTemplate(messageTemplate) {
        if (messageTemplate === null || !messageTemplate.length) {
            throw new Error('Argument "messageTemplate" is required.');
        }
        this.raw = messageTemplate;
        this.tokens = this.tokenize(messageTemplate);
    }
    /**
     * Renders this template using the given properties.
     * @param {Object} properties Object containing the properties.
     * @returns Rendered message.
     */
    MessageTemplate.prototype.render = function (properties) {
        if (!this.tokens.length) {
            return this.raw;
        }
        properties = properties || {};
        var result = [];
        for (var i = 0; i < this.tokens.length; ++i) {
            var token = this.tokens[i];
            if (typeof token.name === 'string') {
                if (properties.hasOwnProperty(token.name)) {
                    result.push(this.toText(properties[token.name]));
                }
                else {
                    result.push(token.raw);
                }
            }
            else {
                result.push(token.text);
            }
        }
        return result.join('');
    };
    /**
     * Binds the given set of args to their matching tokens.
     * @param {any} positionalArgs Arguments.
     * @returns Object containing the properties.
     */
    MessageTemplate.prototype.bindProperties = function (positionalArgs) {
        var result = {};
        var nextArg = 0;
        for (var i = 0; i < this.tokens.length && nextArg < positionalArgs.length; ++i) {
            var token = this.tokens[i];
            if (typeof token.name === 'string') {
                var p = positionalArgs[nextArg];
                result[token.name] = this.capture(p, token.destructure);
                nextArg++;
            }
        }
        while (nextArg < positionalArgs.length) {
            var arg = positionalArgs[nextArg];
            if (typeof arg !== 'undefined') {
                result['a' + nextArg] = this.capture(arg);
            }
            nextArg++;
        }
        return result;
    };
    MessageTemplate.prototype.tokenize = function (template) {
        var tokens = [];
        var result;
        var textStart;
        while ((result = tokenizer.exec(template)) !== null) {
            if (result.index !== textStart) {
                tokens.push({ text: template.slice(textStart, result.index) });
            }
            var destructure = false;
            var token = result[0].slice(1, -1);
            if (token.indexOf('@') === 0) {
                token = token.slice(1);
                destructure = true;
            }
            tokens.push({
                name: token,
                destructure: destructure,
                raw: result[0]
            });
            textStart = tokenizer.lastIndex;
        }
        if (textStart >= 0 && textStart < template.length) {
            tokens.push({ text: template.slice(textStart) });
        }
        return tokens;
    };
    MessageTemplate.prototype.toText = function (property) {
        if (typeof property === 'undefined') {
            return 'undefined';
        }
        if (property === null) {
            return 'null';
        }
        if (typeof property === 'string') {
            return property;
        }
        if (typeof property === 'number') {
            return property.toString();
        }
        if (typeof property === 'boolean') {
            return property.toString();
        }
        if (typeof property.toISOString === 'function') {
            return property.toISOString();
        }
        if (typeof property === 'object') {
            var s = JSON.stringify(property);
            if (s.length > 70) {
                s = s.slice(0, 67) + '...';
            }
            return s;
        }
        return property.toString();
    };
    
    MessageTemplate.prototype.capture = function (property, destructure) {
        if (typeof property === 'function') {
            return property.toString();
        }
        if (typeof property === 'object') {
            // null value will be automatically stringified as "null", in properties it will be as null
            // otherwise it will throw an error
            if (property === null) {
                return property;
            }
            // Could use instanceof Date, but this way will be kinder
            // to values passed from other contexts...
            if (destructure || typeof property.toISOString === 'function') {
                return property;
            }
            return property.toString();
        }
        return property;
    };
    return MessageTemplate;
}());

/**
 * Logs events.
 */
var Logger = /** @class */ (function () {
    /**
     * Creates a new logger instance using the specified pipeline.
     */
    function Logger(pipeline, suppressErrors) {
        this.suppressErrors = true;
        this.pipeline = pipeline;
        this.suppressErrors = typeof suppressErrors === 'undefined' || suppressErrors;
    }
    Logger.prototype.fatal = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(exports.LogEventLevel.fatal, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(exports.LogEventLevel.fatal, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.error = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(exports.LogEventLevel.error, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(exports.LogEventLevel.error, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.warn = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(exports.LogEventLevel.warning, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(exports.LogEventLevel.warning, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.info = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(exports.LogEventLevel.information, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(exports.LogEventLevel.information, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.debug = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(exports.LogEventLevel.debug, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(exports.LogEventLevel.debug, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.verbose = function (errorOrMessageTemplate) {
        var properties = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            properties[_i - 1] = arguments[_i];
        }
        try {
            if (errorOrMessageTemplate instanceof Error) {
                this.write(exports.LogEventLevel.verbose, properties[0], properties.slice(1), errorOrMessageTemplate);
            }
            else {
                this.write(exports.LogEventLevel.verbose, errorOrMessageTemplate, properties);
            }
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    /**
     * Flushes the pipeline of this logger.
     * @returns A {Promise<any>} that will resolve when the pipeline has been flushed.
     */
    Logger.prototype.flush = function () {
        return this.suppressErrors
            ? this.pipeline.flush().catch(function () { })
            : this.pipeline.flush();
    };
    /**
     * Emits events through this logger's pipeline.
     */
    Logger.prototype.emit = function (events) {
        try {
            this.pipeline.emit(events);
            return events;
        }
        catch (error) {
            if (!this.suppressErrors) {
                throw error;
            }
        }
    };
    Logger.prototype.write = function (level, rawMessageTemplate, unboundProperties, error) {
        var messageTemplate = new MessageTemplate(rawMessageTemplate);
        var properties = messageTemplate.bindProperties(unboundProperties);
        var logEvent = new LogEvent(new Date().toISOString(), level, messageTemplate, properties, error);
        this.pipeline.emit([logEvent]);
    };
    return Logger;
}());

var ConsoleSink = /** @class */ (function () {
    function ConsoleSink(options) {
        this.options = options || {};
        var internalConsole = this.options.console || typeof console !== 'undefined' && console || null;
        var stub = function () { };
        // console.debug is no-op for Node, so use console.log instead.
        var nodeConsole = !this.options.console && typeof process !== 'undefined' && process.versions.node;
        this.console = {
            error: (internalConsole && (internalConsole.error || internalConsole.log)) || stub,
            warn: (internalConsole && (internalConsole.warn || internalConsole.log)) || stub,
            info: (internalConsole && (internalConsole.info || internalConsole.log)) || stub,
            debug: (internalConsole && ((!nodeConsole && internalConsole.debug) || internalConsole.log)) || stub,
            log: (internalConsole && internalConsole.log) || stub
        };
    }
    ConsoleSink.prototype.emit = function (events) {
        for (var i = 0; i < events.length; ++i) {
            var e = events[i];
            if (!isEnabled(this.options.restrictedToMinimumLevel, e.level))
                continue;
            switch (e.level) {
                case exports.LogEventLevel.fatal:
                    this.writeToConsole(this.console.error, 'Fatal', e);
                    break;
                case exports.LogEventLevel.error:
                    this.writeToConsole(this.console.error, 'Error', e);
                    break;
                case exports.LogEventLevel.warning:
                    this.writeToConsole(this.console.warn, 'Warning', e);
                    break;
                case exports.LogEventLevel.information:
                    this.writeToConsole(this.console.info, 'Information', e);
                    break;
                case exports.LogEventLevel.debug:
                    this.writeToConsole(this.console.debug, 'Debug', e);
                    break;
                case exports.LogEventLevel.verbose:
                    this.writeToConsole(this.console.debug, 'Verbose', e);
                    break;
                default:
                    this.writeToConsole(this.console.log, 'Log', e);
                    break;
            }
        }
    };
    ConsoleSink.prototype.flush = function () {
        return Promise.resolve();
    };
    ConsoleSink.prototype.writeToConsole = function (logMethod, prefix, e) {
        var output = "[" + prefix + "] " + e.messageTemplate.render(e.properties);
        if (this.options.includeTimestamps) {
            output = e.timestamp + " " + output;
        }
        var values = [];
        if (this.options.includeProperties) {
            for (var key in e.properties) {
                if (e.properties.hasOwnProperty(key)) {
                    values.push(e.properties[key]);
                }
            }
        }
        if (e.error instanceof Error) {
            values.push('\n', e.error);
        }
        logMethod.apply(void 0, [output].concat(values));
    };
    return ConsoleSink;
}());

var defaultBatchedSinkOptions = {
    maxSize: 100,
    period: 5,
    durableStore: null
};
var BatchedSink = /** @class */ (function () {
    function BatchedSink(innerSink, options) {
        this.durableStorageKey = 'structured-log-batched-sink-durable-cache';
        this.innerSink = innerSink || null;
        this.options = __assign({}, defaultBatchedSinkOptions, (options || {}));
        this.batchedEvents = [];
        this.cycleBatch();
        if (this.options.durableStore) {
            var initialBatch = [];
            for (var key in this.options.durableStore) {
                if (key.indexOf(this.durableStorageKey) === 0) {
                    var storedEvents = JSON.parse(this.options.durableStore.getItem(key))
                        .map(function (e) {
                        e.messageTemplate = new MessageTemplate(e.messageTemplate.raw);
                        return e;
                    });
                    initialBatch = initialBatch.concat(storedEvents);
                    this.options.durableStore.removeItem(key);
                }
            }
            this.emit(initialBatch);
        }
    }
    BatchedSink.prototype.emit = function (events) {
        if (this.batchedEvents.length + events.length <= this.options.maxSize) {
            (_a = this.batchedEvents).push.apply(_a, events);
            this.storeEvents();
        }
        else {
            var cursor = this.options.maxSize - this.batchedEvents.length;
            (_b = this.batchedEvents).push.apply(_b, events.slice(0, cursor));
            this.storeEvents();
            while (cursor < events.length) {
                this.cycleBatch();
                (_c = this.batchedEvents).push.apply(_c, events.slice(cursor, cursor = cursor + this.options.maxSize));
                this.storeEvents();
            }
        }
        return events;
        var _a, _b, _c;
    };
    BatchedSink.prototype.flush = function () {
        this.cycleBatch();
        var corePromise = this.flushCore();
        return corePromise instanceof Promise ? corePromise : Promise.resolve();
    };
    BatchedSink.prototype.emitCore = function (events) {
        return this.innerSink.emit(events);
    };
    BatchedSink.prototype.flushCore = function () {
        return this.innerSink.flush();
    };
    BatchedSink.prototype.cycleBatch = function () {
        var _this = this;
        clearTimeout(this.batchTimeout);
        if (this.batchedEvents.length) {
            var emitPromise = this.emitCore(this.batchedEvents.slice(0));
            if (this.options.durableStore) {
                var previousBatchKey_1 = this.batchKey;
                (emitPromise instanceof Promise ? emitPromise : Promise.resolve())
                    .then(function () { return _this.options.durableStore.removeItem(previousBatchKey_1); });
            }
            this.batchedEvents.length = 0;
        }
        this.batchKey = this.durableStorageKey + "-" + new Date().getTime();
        if (!isNaN(this.options.period) && this.options.period > 0) {
            this.batchTimeout = setTimeout(function () { return _this.cycleBatch(); }, this.options.period * 1000);
        }
    };
    BatchedSink.prototype.storeEvents = function () {
        if (this.options.durableStore) {
            this.options.durableStore.setItem(this.batchKey, JSON.stringify(this.batchedEvents));
        }
    };
    return BatchedSink;
}());

var FilterStage = /** @class */ (function () {
    function FilterStage(predicate) {
        this.predicate = predicate;
    }
    FilterStage.prototype.emit = function (events) {
        return events.filter(this.predicate);
    };
    FilterStage.prototype.flush = function () {
        return Promise.resolve();
    };
    return FilterStage;
}());

/**
 * Allows dynamic control of the logging level.
 */
var DynamicLevelSwitch = /** @class */ (function () {
    function DynamicLevelSwitch() {
        this.minLevel = null;
        /**
         * Gets or sets a delegate that can be called when the pipeline needs to be flushed.
         * This should generally not be modified, as it will be provided by the pipeline stage.
         */
        this.flushDelegate = function () { return Promise.resolve(); };
    }
    DynamicLevelSwitch.prototype.fatal = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = exports.LogEventLevel.fatal; });
    };
    DynamicLevelSwitch.prototype.error = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = exports.LogEventLevel.error; });
    };
    DynamicLevelSwitch.prototype.warning = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = exports.LogEventLevel.warning; });
    };
    DynamicLevelSwitch.prototype.information = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = exports.LogEventLevel.information; });
    };
    DynamicLevelSwitch.prototype.debug = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = exports.LogEventLevel.debug; });
    };
    DynamicLevelSwitch.prototype.verbose = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = exports.LogEventLevel.verbose; });
    };
    DynamicLevelSwitch.prototype.off = function () {
        var _this = this;
        return this.flushDelegate().then(function () { return _this.minLevel = exports.LogEventLevel.off; });
    };
    DynamicLevelSwitch.prototype.isEnabled = function (level) {
        return this.minLevel === null || isEnabled(this.minLevel, level);
    };
    return DynamicLevelSwitch;
}());
var DynamicLevelSwitchStage = /** @class */ (function (_super) {
    __extends(DynamicLevelSwitchStage, _super);
    function DynamicLevelSwitchStage(dynamicLevelSwitch) {
        var _this = _super.call(this, function (e) { return dynamicLevelSwitch.isEnabled(e.level); }) || this;
        _this.dynamicLevelSwitch = dynamicLevelSwitch;
        return _this;
    }
    /**
     * Sets a delegate that can be called when the pipeline needs to be flushed.
     */
    DynamicLevelSwitchStage.prototype.setFlushDelegate = function (flushDelegate) {
        this.dynamicLevelSwitch.flushDelegate = flushDelegate;
    };
    return DynamicLevelSwitchStage;
}(FilterStage));

var Pipeline = /** @class */ (function () {
    function Pipeline() {
        this.stages = [];
        this.eventQueue = [];
        this.flushInProgress = false;
    }
    /**
     * Adds a stage to the end of the pipeline.
     * @param {PipelineStage} stage The pipeline stage to add.
     */
    Pipeline.prototype.addStage = function (stage) {
        this.stages.push(stage);
    };
    /**
     * Emits events through the pipeline. If a flush is currently in progress, the events will be queued and will been
     * sent through the pipeline once the flush is complete.
     * @param {LogEvent[]} events The events to emit.
     */
    Pipeline.prototype.emit = function (events) {
        var _this = this;
        if (this.flushInProgress) {
            this.eventQueue = this.eventQueue.concat(events);
            return this.flushPromise;
        }
        else {
            if (!this.stages.length || !events.length) {
                return Promise.resolve();
            }
            var promise = Promise.resolve(this.stages[0].emit(events));
            var _loop_1 = function (i) {
                promise = promise.then(function (events) { return _this.stages[i].emit(events); });
            };
            for (var i = 1; i < this.stages.length; ++i) {
                _loop_1(i);
            }
            return promise;
        }
    };
    /**
     * Flushes events through the pipeline.
     * @returns A {Promise<any>} that resolves when all events have been flushed and the pipeline can accept new events.
     */
    Pipeline.prototype.flush = function () {
        var _this = this;
        if (this.flushInProgress) {
            return this.flushPromise;
        }
        this.flushInProgress = true;
        return this.flushPromise = Promise.resolve()
            .then(function () {
            if (_this.stages.length === 0) {
                return;
            }
            var promise = _this.stages[0].flush();
            var _loop_2 = function (i) {
                promise = promise.then(function () { return _this.stages[i].flush(); });
            };
            for (var i = 1; i < _this.stages.length; ++i) {
                _loop_2(i);
            }
            return promise;
        })
            .then(function () {
            _this.flushInProgress = false;
            var queuedEvents = _this.eventQueue.slice();
            _this.eventQueue = [];
            return _this.emit(queuedEvents);
        });
    };
    return Pipeline;
}());

var SinkStage = /** @class */ (function () {
    function SinkStage(sink) {
        this.sink = sink;
    }
    SinkStage.prototype.emit = function (events) {
        this.sink.emit(events);
        return events;
    };
    SinkStage.prototype.flush = function () {
        return this.sink.flush();
    };
    return SinkStage;
}());

var deepClone = function (obj) { return JSON.parse(JSON.stringify(obj)); };
var EnrichStage = /** @class */ (function () {
    function EnrichStage(enricher) {
        this.enricher = enricher;
    }
    EnrichStage.prototype.emit = function (events) {
        for (var i = 0; i < events.length; ++i) {
            var extraProperties = this.enricher instanceof Function
                ? this.enricher(deepClone(events[i].properties))
                : this.enricher;
            Object.assign(events[i].properties, extraProperties);
        }
        return events;
    };
    EnrichStage.prototype.flush = function () {
        return Promise.resolve();
    };
    return EnrichStage;
}());

/**
 * Configures pipelines for new logger instances.
 */
var LoggerConfiguration = /** @class */ (function () {
    function LoggerConfiguration() {
        var _this = this;
        /**
         * Sets the minimum level for any subsequent stages in the pipeline.
         */
        this.minLevel = Object.assign(function (levelOrSwitch) {
            if (typeof levelOrSwitch === 'undefined' || levelOrSwitch === null) {
                throw new TypeError('Argument "levelOrSwitch" is not a valid LogEventLevel value or DynamicLevelSwitch instance.');
            }
            else if (levelOrSwitch instanceof DynamicLevelSwitch) {
                var switchStage = new DynamicLevelSwitchStage(levelOrSwitch);
                var flush = _this.pipeline.flush;
                switchStage.setFlushDelegate(function () { return _this.pipeline.flush(); });
                _this.pipeline.addStage(switchStage);
                return _this;
            }
            else if (typeof levelOrSwitch === 'string') {
                var level_1 = exports.LogEventLevel[levelOrSwitch.toLowerCase()];
                if (typeof level_1 === 'undefined' || level_1 === null) {
                    throw new TypeError('Argument "levelOrSwitch" is not a valid LogEventLevel value.');
                }
                return _this.filter(function (e) { return isEnabled(level_1, e.level); });
            }
            else {
                return _this.filter(function (e) { return isEnabled(levelOrSwitch, e.level); });
            }
        }, {
            fatal: function () { return _this.minLevel(exports.LogEventLevel.fatal); },
            error: function () { return _this.minLevel(exports.LogEventLevel.error); },
            warning: function () { return _this.minLevel(exports.LogEventLevel.warning); },
            information: function () { return _this.minLevel(exports.LogEventLevel.information); },
            debug: function () { return _this.minLevel(exports.LogEventLevel.debug); },
            verbose: function () { return _this.minLevel(exports.LogEventLevel.verbose); }
        });
        this.pipeline = new Pipeline();
        this._suppressErrors = true;
    }
    /**
     * Adds a sink to the pipeline.
     * @param {Sink} sink The sink to add.
     */
    LoggerConfiguration.prototype.writeTo = function (sink) {
        this.pipeline.addStage(new SinkStage(sink));
        return this;
    };
    /**
     * Adds a filter to the pipeline.
     * @param {(e: LogEvent) => boolean} predicate Filter predicate to use.
     */
    LoggerConfiguration.prototype.filter = function (predicate) {
        if (predicate instanceof Function) {
            this.pipeline.addStage(new FilterStage(predicate));
        }
        else {
            throw new TypeError('Argument "predicate" must be a function.');
        }
        return this;
    };
    /**
     * Adds an enricher to the pipeline.
     */
    LoggerConfiguration.prototype.enrich = function (enricher) {
        if (enricher instanceof Function || enricher instanceof Object) {
            this.pipeline.addStage(new EnrichStage(enricher));
        }
        else {
            throw new TypeError('Argument "enricher" must be either a function or an object.');
        }
        return this;
    };
    /**
     * Enable or disable error suppression.
     */
    LoggerConfiguration.prototype.suppressErrors = function (suppress) {
        this._suppressErrors = typeof suppress === 'undefined' || !!suppress;
        return this;
    };
    /**
     * Creates a new logger instance based on this configuration.
     */
    LoggerConfiguration.prototype.create = function () {
        return new Logger(this.pipeline, this._suppressErrors);
    };
    return LoggerConfiguration;
}());

function configure() {
    return new LoggerConfiguration();
}

exports.configure = configure;
exports.LoggerConfiguration = LoggerConfiguration;
exports.Logger = Logger;
exports.ConsoleSink = ConsoleSink;
exports.BatchedSink = BatchedSink;
exports.DynamicLevelSwitch = DynamicLevelSwitch;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=structured-log.js.map

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _seqSink = _interopRequireDefault(__webpack_require__(/*! ./seq-sink */ "./src/seq-sink.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var structuredLog = __webpack_require__(/*! structured-log */ "./node_modules/structured-log/dist/structured-log.js");

var log =
/*#__PURE__*/
function () {
  function Log(options) {
    var _this = this;

    _classCallCheck(this, Log);

    if (!options.endpoint) {
      throw new Error("'options.endpoint' parameter is required.");
    }

    if (!options.batchPeriod) {
      throw new Error("'options.batchPeriod' parameter is required.");
    }

    if (!options.minLevel) {
      throw new Error("'options.minlevel' parameter is required.");
    }

    this.endpoint = options.endpoint;
    this.batchPeriod = options.batchPeriod;
    this.minLevel = options.minLevel;
    this.log = structuredLog.configure().suppressErrors(false).minLevel(this.minLevel).writeTo(new structuredLog.BatchedSink((0, _seqSink.default)({
      url: this.endpoint,
      compact: true,
      suppressErrors: false
    }), {
      period: this.batchPeriod
    })).create();
    ['info', 'warn', 'debug', 'verbose', 'warn', 'error'].forEach(function (method) {
      Log.prototype[method] = function () {
        var _this$log;

        (_this$log = _this.log)[method].apply(_this$log, arguments);
      };
    });
  }

  _createClass(Log, [{
    key: "attachErrors",
    value: function attachErrors() {
      var _this2 = this;

      if (typeof document != 'undefined') {
        if (window.lykke_log_deffered) {
          window.removeEventListener('error', window.lykke_log_deffered_handler, true);
          window.lykke_log_deffered.map(function (v) {
            _this2.log.error(v, v.message);
          });
        }

        window.addEventListener('error', function (e) {
          if (e.type == "error" && e.error) {
            this.log.error(e.error, e.message);
          } else if (e.type == "error") {
            this.log.error(new Error("Failed to load ".concat(e.target.tagName, " ").concat(e.target.src)));
          }

          return true;
        }, true);
      } else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
        ErrorUtils.setGlobalHandler(function (e) {
          this.log.error(e, e.message);
        });
      } else {//node
      }
    }
  }, {
    key: "takeOverConsole",
    value: function takeOverConsole() {
      var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var console = window.console;
      var self = this;
      if (!template) template = function template(message) {
        return message;
      };
      if (!console) return;

      function intercept(method) {
        var original = console[method];

        console[method] = function () {
          var _self$log;

          // do sneaky stuff
          method == "log" ? method = "info" : null;
          method == "trace" ? method = "verbose" : null;
          var message = Array.prototype.slice.apply(arguments).join(' ');

          (_self$log = self.log)[method].apply(_self$log, _toConsumableArray(template(message, method)));

          if (original.apply) {
            // Do this for normal browsers
            original.apply(console, arguments);
          } else {
            // Do this for IE
            original(message);
          }
        };
      }

      var methods = ['log', 'warn', 'error', 'debug', 'info', 'trace'];

      for (var i = 0; i < methods.length; i++) {
        intercept(methods[i]);
      }
    }
  }]);

  return Log;
}();

var _default = log;
exports.default = _default;
module.exports = exports["default"];

/***/ }),

/***/ "./src/seq-sink.js":
/*!*************************!*\
  !*** ./src/seq-sink.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SeqSinkFactory;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//Here need to fork and implement offline behaviour
function postToSeq(url, apiKey, compact, body, done) {
  var apiKeyParameter = apiKey ? "?apiKey=".concat(apiKey) : '';
  var promise = fetch("".concat(url, "/api/events/raw").concat(apiKeyParameter), {
    headers: {
      'content-type': compact ? 'application/vnd.serilog.clef' : 'application/json'
    },
    method: 'POST',
    body: body
  });
  return !done ? promise : promise.then(function (response) {
    return done(response);
  });
}

function mapLogLevel(logLevel) {
  // If the log level isn't numeric (structured-log < 0.1.0), return it as-is.
  if (isNaN(logLevel)) {
    return logLevel;
  } // Parse bitfield log level (structured-log >= 0.1.0-alpha).


  if (logLevel === 1) {
    return 'Fatal';
  } else if (logLevel === 3) {
    return 'Error';
  } else if (logLevel === 7) {
    return 'Warning';
  } else if (logLevel === 31) {
    return 'Debug';
  } else if (logLevel === 63) {
    return 'Verbose';
  } // Default to Information.


  return 'Information';
}

function logSuppressedError(reason) {
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('Suppressed error when logging to Seq: ' + reason);
  }
}

var SeqSink =
/*#__PURE__*/
function () {
  function SeqSink(options) {
    var _this = this;

    _classCallCheck(this, SeqSink);

    this.url = null;
    this.apiKey = null;
    this.durable = false;
    this.compact = false;
    this.levelSwitch = null;
    this.refreshLevelSwitchTimeoutId = null;
    this.refreshLevelSwitchTimeoutInterval = 2 * 60 * 1000;
    this.suppressErrors = true;

    if (!options) {
      throw new Error("'options' parameter is required.");
    }

    if (!options.url) {
      throw new Error("'options.url' parameter is required.");
    }

    this.url = options.url.replace(/\/$/, '');
    this.apiKey = options.apiKey;
    this.levelSwitch = options.levelSwitch || null;
    this.suppressErrors = options.suppressErrors !== false;

    if (options.durable && typeof localStorage === 'undefined') {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn("'options.durable' parameter was set to true, but 'localStorage' is not available.");
      }

      this.durable = false;
    } else {
      this.durable = !!options.durable;
    }

    this.compact = !!options.compact;

    if (this.durable) {
      var requests = {};

      for (var i = 0; i < localStorage.length; ++i) {
        var storageKey = localStorage.key(i);

        if (storageKey.indexOf('structured-log-seq-sink') !== 0) {
          continue;
        }

        var body = localStorage.getItem(storageKey);
        requests[storageKey] = postToSeq(this.url, this.apiKey, this.compact, body).then(function () {
          return localStorage.removeItem(k);
        }).catch(function (reason) {
          return _this.suppressErrors ? logSuppressedError(reason) : Promise.reject(reason);
        });
      }
    }

    if (this.levelSwitch !== null) {
      this.refreshLevelSwitchTimeoutId = setTimeout(function () {
        return _this.sendToServer([]);
      }, this.refreshLevelSwitchTimeoutInterval);
    }
  }

  _createClass(SeqSink, [{
    key: "toString",
    value: function toString() {
      return 'SeqSink';
    }
  }, {
    key: "emit",
    value: function emit(events, done) {
      var _this2 = this;

      var filteredEvents = this.levelSwitch ? events.filter(function (e) {
        return _this2.levelSwitch.isEnabled(e.level);
      }) : events;

      if (!filteredEvents.length) {
        return done ? Promise.resolve().then(function () {
          return done(null);
        }) : Promise.resolve();
      }

      return this.sendToServer(filteredEvents, done);
    }
  }, {
    key: "sendToServer",
    value: function sendToServer(events, done) {
      var _this3 = this;

      var seqEvents = this.compact ? events.reduce(function (s, e) {
        var mappedEvent = _objectSpread({
          '@l': mapLogLevel(e.level),
          '@mt': e.messageTemplate.raw,
          '@t': e.timestamp
        }, e.properties);

        if (e.error instanceof Error && e.error.stack) {
          mappedEvent['@x'] = e.error.stack;
        }

        return "".concat(s).concat(JSON.stringify(mappedEvent), "\n");
      }, '').replace(/\s+$/g, '') : events.map(function (e) {
        var mappedEvent = {
          Level: mapLogLevel(e.level),
          MessageTemplate: e.messageTemplate.raw,
          Properties: e.properties,
          Timestamp: e.timestamp
        };

        if (e.error instanceof Error && e.error.stack) {
          mappedEvent.Exception = e.error.stack;
        }

        return mappedEvent;
      });
      var body = this.compact ? seqEvents : JSON.stringify({
        Events: seqEvents
      });
      var storageKey;

      if (this.durable) {
        storageKey = "structured-log-seq-sink-".concat(new Date().getTime(), "-").concat(Math.floor(Math.random() * 1000000) + 1);
        localStorage.setItem(storageKey, body);
      }

      return postToSeq(this.url, this.apiKey, this.compact, body, done).then(function (response) {
        return response.json();
      }).then(function (json) {
        return _this3.updateLogLevel(json);
      }).then(function () {
        if (storageKey) localStorage.removeItem(storageKey);
      }).catch(function (reason) {
        return _this3.suppressErrors ? logSuppressedError(reason) : Promise.reject(reason);
      });
    }
  }, {
    key: "updateLogLevel",
    value: function updateLogLevel(response) {
      var _this4 = this;

      if (!this.levelSwitch) return;

      if (this.refreshLevelSwitchTimeoutId) {
        clearTimeout(this.refreshLevelSwitchTimeoutId);
        this.refreshLevelSwitchTimeoutId = setTimeout(function () {
          return _this4.sendToServer([]);
        }, this.refreshLevelSwitchTimeoutInterval);
      }

      if (response && response.MinimumLevelAccepted) {
        switch (response.MinimumLevelAccepted) {
          case 'Fatal':
            this.levelSwitch.fatal();
            break;

          case 'Error':
            this.levelSwitch.error();
            break;

          case 'Warning':
            this.levelSwitch.warning();
            break;

          case 'Information':
            this.levelSwitch.information();
            break;

          case 'Debug':
            this.levelSwitch.debug();
            break;

          case 'Verbose':
            this.levelSwitch.verbose();
            break;
        }
      }
    }
  }, {
    key: "flush",
    value: function flush() {
      return Promise.resolve();
    }
  }]);

  return SeqSink;
}();

function SeqSinkFactory(options) {
  return new SeqSink(options);
}

module.exports = exports["default"];

/***/ })

/******/ });
});
//# sourceMappingURL=lykkeLog.js.map
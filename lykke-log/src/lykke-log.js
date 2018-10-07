const structuredLog = require('structured-log');
import seqSink from './seq-sink'

const log = class Log {
    constructor(options) {

        if (!options.endpoint) {
            throw new Error(`'options.endpoint' parameter is required.`);
        }
        if (!options.batchPeriod) {
            throw new Error(`'options.batchPeriod' parameter is required.`);
        }
        if (!options.minLevel) {
            throw new Error(`'options.minlevel' parameter is required.`);
        }

        if (window.lykke_log_deffered && window.lykke_log_deffered.lykke_log_deffered_error_handler) {
            window.removeEventListener('error', window.lykke_log_deffered.lykke_log_deffered_error_handler, true);
        }
        if (window.lykke_log_deffered && window.lykke_log_deffered.console_original) {
            for (var i = 0; i < lykke_log_deffered.methods.length; i++)
                console[lykke_log_deffered.methods[i]] = lykke_log_deffered.console_original[lykke_log_deffered.methods[i]];
        }

        this.endpoint = options.endpoint;
        this.batchPeriod = options.batchPeriod;
        this.minLevel = options.minLevel;

        this.log = structuredLog.configure()
            .suppressErrors(false)
            .minLevel(this.minLevel)
            .writeTo(new structuredLog.ConsoleSink())
            .writeTo(new structuredLog.BatchedSink(seqSink({
                url: this.endpoint,
                compact: true,
                suppressErrors: false
            }), { period: this.batchPeriod }))
            .create();

        ['info', 'warn', 'debug', 'verbose', 'warn', 'error', 'fatal'].forEach((method) => {
            Log.prototype[method] = (...args) => {
                this.log[method](...args);
            }
        })

    }

    attachErrors(template = null) {
        if (!template)
            template = (message) => ([message]);

        if (typeof document != 'undefined') {

            if (window.lykke_log_deffered && window.lykke_log_deffered.errors.length > 0) {

                window.lykke_log_deffered.errors.map((v) => {

                    this.log.error(v, ...template(v.message, "error"));

                })
            }
            window.addEventListener('error', function (e) {

                if (e.type == "error" && e.error) {
                    this.log.error(e.error, ...template(e.message, "error"))
                }
                else if (e.type == "error") {
                    var target;
                    e.target.tagName == "SCRIPT" || e.target.tagName == "IMG" ? target = e.target.src : null;
                    e.target.tagName == "LINK" ? target = e.target.href : null
                    this.log.error(new Error(`Failed to load ${e.target.tagName} ${target}`), ...template(`Failed to load ${e.target.tagName} ${e.target.src}`, "error"));
                }
                return true;
            }, true);

        }
        else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {

            ErrorUtils.setGlobalHandler(function (e) {
                this.log.error(e, ...template(e.message, "error"));
            });
        }
        else {
            //node
        }
    }

    takeOverConsole(template = null) {

        var self = this;
        if (!template)
            template = (message) => ([message]);
        if (window.lykke_log_deffered && window.lykke_log_deffered.console.length > 0) {
            window.lykke_log_deffered.console.map((v) => {

                var message = Array.prototype.slice.apply(v.arguments).join(' ')
                self.log[v.method](...template(message, v.method));

            })
        }
        if (!console) return
        function intercept(method) {
            //var original = console[method]
            console[method] = function () {
                // do sneaky stuff
                method == "log" ? method = "info" : null;
                method == "trace" ? method = "verbose" : null;
                var message = Array.prototype.slice.apply(arguments).join(' ')
                self.log[method](...template(message, method));

                /*if (original.apply) {
                    // Do this for normal browsers
                    original.apply(console, arguments)
                } else {
                    // Do this for IE
                    original(message);
                }*/
            }
        }
        var methods = ['log', 'warn', 'error', 'debug', 'info', 'trace']
        for (var i = 0; i < methods.length; i++)
            intercept(methods[i])
    }

}

export default log;
const structuredLog = require('structured-log');
import seqSink from './seq-sink'

const log = class Log {
    constructor(options) {
        this.endpoint = options.endpoint;
        this.batchPeriod = options.batchPeriod;

        this.log = structuredLog.configure()
            .suppressErrors(false)
            .writeTo(new structuredLog.BatchedSink(seqSink({
                url: this.endpoint,
                compact: true,
                suppressErrors: false
            }), { period: this.batchPeriod }))
            .create();

        ['info', 'warn', 'debug', 'verbose', 'warn', 'error'].forEach((method) => {
            Log.prototype[method] = (...args) => {
                this.log[method](...args);
            }
        })

    }

    attachErrors() {
        if (typeof document != 'undefined') {

            if (window.lykke_log_deffered) {
                window.removeEventListener('error', window.lykke_log_deffered_handler, true);
                window.lykke_log_deffered.map((v) => {

                    this.log.error(v, v.message);

                })
            }
            window.addEventListener('error', function (e) {

                if (e.type == "error" && e.error) {
                    this.log.error(e.error, e.message)
                }
                else if (e.type == "error") {
                    this.log.error(new Error(`Failed to load ${e.target.tagName} ${e.target.src}`));
                }
                return true;
            }, true);

        }
        else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {

            ErrorUtils.setGlobalHandler(function (e) {
                this.log.error(e, e.message);
            });
        }
        else {
            //node
        }
    }

    takeOverConsole() {
        var console = window.console
        var self = this;
        if (!console) return
        function intercept(method) {
            var original = console[method]
            console[method] = function () {
                // do sneaky stuff
                method == "log" ? method = "info" : null;
                method == "trace" ? method = "verbose" : null;
                var message = Array.prototype.slice.apply(arguments).join(' ')
                self.log[method](message);

                if (original.apply) {
                    // Do this for normal browsers
                    original.apply(console, arguments)
                } else {
                    // Do this for IE
                    original(message);
                }
            }
        }
        var methods = ['log', 'warn', 'error', 'debug', 'info', 'trace']
        for (var i = 0; i < methods.length; i++)
            intercept(methods[i])
    }

}

export default log;
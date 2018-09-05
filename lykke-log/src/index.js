const structuredLog = require('structured-log');
import seqSink from 'structured-log-seq-sink'


var log = structuredLog.configure()
    .suppressErrors(false)
    .writeTo(new structuredLog.ConsoleSink())
    .writeTo(new structuredLog.BatchedSink(seqSink({
        url: "http://localhost:5001",
        compact: true,
        suppressErrors: false
    }), { period: 5 }))
    .create();


log.attachErrors = function () {
    if (typeof document != 'undefined') {

        window.log = log;

        if (window.lykke_log_deffered) {
            window.removeEventListener('error', window.lykke_log_deffered_handler, true);
            window.lykke_log_deffered.map((v) => {

                log.error(v, v.message);

            })
        }
        window.addEventListener('error', function (e) {

            if (e.type == "error" && e.error) {
                log.error(e.error, e.message)
            }
            else if (e.type == "error") {
                log.error(new Error(`Failed to load ${e.target.tagName} ${e.target.src}`));
            }
            return true;
        }, true);

    }
    else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {

        global.log = log;

        ErrorUtils.setGlobalHandler(function (e) {
            log.error(e, e.message);
        });
    }
    else {
        //node
    }
}

log.takeOverConsole = function () {
    var console = window.console
    if (!console) return
    function intercept(method) {
        var original = console[method]
        console[method] = function () {
            // do sneaky stuff
            method == "log" ? method = "info" : null;
            method == "trace" ? method = "verbose" : null;
            var message = Array.prototype.slice.apply(arguments).join(' ')
            log[method](message);

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

log.attachErrors();
log.takeOverConsole();
window.log = log;
export default log;
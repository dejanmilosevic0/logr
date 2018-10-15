'use strict';

const EVENT = 'html-webpack-plugin-alter-asset-tags';

/*const DEFAULT_OPTIONS = {};

const normalizeOptions = options => {
    if (!options) {
        return DEFAULT_OPTIONS;
    }
    return Object.assign({}, DEFAULT_OPTIONS, options);
};*/


function createTag(script) {
  return {
    tagName: 'script',
    attributes: { type: 'text/javascript' },
    closeTag: true,
    innerHTML: script,
  };
}

class LykkeLogWebpack {
  constructor(options) {
    // this.options = normalizeOptions(options);
    this.script = `for(var lykke_log_deffered={errors:[],console:[],console_original:{},methods:"log warn error debug info trace".split(" "),lykke_log_deffered_error_handler:function(a){var b;"SCRIPT"==a.target.tagName||"IMG"==a.target.tagName?b=a.target.src:null;"LINK"==a.target.tagName?b=a.target.href:null;lykke_log_deffered.errors.push(Error("Failed to load "+a.target.tagName+" "+b))},console_intercept:function(a){"log"==a?a="info":null;"trace"==a?a="verbose":null;lykke_log_deffered.console_original[a]=console[a];
    console[a]=function(){var b=Array.prototype.slice.apply(arguments).join(" ");lykke_log_deffered.console_original[a]?(lykke_log_deffered.console_original[a].apply(console,arguments),lykke_log_deffered.console.push({method:a,arguments:arguments})):(lykke_log_deffered.console_original[a](b),lykke_log_deffered.console.push(b))}}},i=0;i<lykke_log_deffered.methods.length;i++)lykke_log_deffered.console_intercept(lykke_log_deffered.methods[i]);
    window.addEventListener("error",lykke_log_deffered.lykke_log_deffered_error_handler,!0);`;
  }
  apply(compiler) {
    //const options = this.options;
    compiler.plugin('compilation', compilation => {
      compilation.plugin(EVENT, (pluginArgs, callback) => {
        try {
          pluginArgs.head.unshift(createTag(this.script));
        } catch (err) {
          callback(err);
        }
        callback(null, pluginArgs);
      });
    });
    compiler.plugin('emit', (compilation, callback) => {
      callback();
    });
  }
}

module.exports = LykkeLogWebpack;

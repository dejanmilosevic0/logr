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
    this.script = ` var lykke_log_deffered = [];
       var lykke_log_deffered_handler = function (e) {
           var target;
           e.target.tagName == "SCRIPT" || e.target.tagName == "IMG" ? target = e.target.src : null;
           e.target.tagName == "LINK" ? target = e.target.href : null

           lykke_log_deffered.push(new Error(\`Failed to load \${e.target.tagName} \${target}\`))
       }
       window.addEventListener('error', lykke_log_deffered_handler, true);`;
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

export default LykkeLogWebpack;

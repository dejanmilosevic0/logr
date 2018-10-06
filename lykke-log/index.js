'use strict';

import lykkeLogWebpack from './src/lykke-log-webpack.js';
import lykkeLog from './src/lykke-log';

module.exports = {
    webpackPlugin: lykkeLogWebpack,
    lykkeLog: lykkeLog
}
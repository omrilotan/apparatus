const path = require('path');

const dev = (env) => process.env.NODE_ENV === 'development' || typeof env !== 'undefined' && env === 'development';

const rules = [];

const plugins = [];

const entry = require('./webpack/entries');

const output = {
    path: path.resolve(__dirname, './'),
    filename: 'extension/[name]',
};

module.exports = (env) => {
    return {
        module: {rules},
        plugins,
        entry,
        output,
        devtool: dev(env) ? 'inline-source-map' : '',
    };
};

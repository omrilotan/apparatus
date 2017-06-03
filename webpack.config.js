const path = require('path');

const DEV = typeof env !== 'undefined' && env === 'development';
const PROD = !DEV;

const rules = [];

const entry = {
    'background.js': './src/background.js',
};

const output = {
    path: path.resolve(__dirname, './'),
    filename: 'extension/[name]',
};

const devtool = 'inline-source-map';

module.exports = (env) => {
    const config = {
        module: {rules},
        entry,
        output,
    };

    if (DEV) {
        Object.assign(config, {
            devtool
        });
    }

    return config;
}

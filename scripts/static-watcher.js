const fs = require('fs');
const Watcher = require('./watcher');

const SOURCE = './src/';
const TARGET = './extension/';

fs.mkdir(TARGET, () => {
    rootFiles();
    images();
});

function rootFiles() {
    (new Watcher(
        SOURCE,
        TARGET,
        [
            'manifest.json',
            'index.html',
        ],
    )).start();
}

function images() {
    const imagesDir = 'images/';

    (new Watcher(
        `${SOURCE}${imagesDir}`,
        `${TARGET}${imagesDir}`,
    )).start();
}
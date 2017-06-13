const fs = require('fs');

const interpolate = require('./interpolate');
const Operation = require('./operation');
const packageData = require('./package-data');

const Watcher = require('./watcher');

const SOURCE = './src/';
const TARGET = './extension/';

let operations = 0;
let appData = {};
const placeAppData = (string) => interpolate(string.toString(), appData);


const operation = new Operation(() => {
    rootFiles();
    images();
});

operation.register((next) => {
    packageData((result) => {
        appData = result;
        next();
    });
});

operation.register((next) => fs.mkdir(TARGET, next));

function rootFiles() {
    (new Watcher(
        SOURCE,
        TARGET,
        [
            'manifest.json',
            'index.html',
        ],
        placeAppData,
    )).start();
}

function images() {
    const imagesDir = 'images/';

    (new Watcher(
        `${SOURCE}${imagesDir}`,
        `${TARGET}${imagesDir}`,
    )).start();
}
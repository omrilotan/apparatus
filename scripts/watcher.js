const fs = require('fs');

module.exports = class Watcher {
    constructor(source = './', target = './', files = [], processor = (data) => data) {
        this.source = source;
        this.target = target;
        this.files = files;
        this.processor = processor;

        this.copy = this.copy.bind(this);
    }

    start() {
        fs.mkdir(this.target, () => {
            this.makeCopies();
            this.watch();
        });
    }

    makeCopies() {
        fs.readdir(this.source, (err, files) => {
            if (err) {
                console.error(err);
                return;
            }

            [...files].forEach(this.copy);
        })
    }

    watch() {
        fs.watch(this.source, { encoding: 'buffer' }, this.respond.bind(this));
    }

    respond(eventType, filename) {
        this.copy(filename.toString());
    }

    copy(filename) {

        if (this.files.length && !this.files.includes(filename)) {
            return;
        }

        Watcher.read(`${this.source}${filename}`)
            .then((fileData) => {
                Watcher.write(
                        `${this.target}${filename}`,
                        this.processor(fileData)
                    )
                    .then(() => console.log(`${filename} written`))
                    .catch(console.error);
            })
            .catch(console.error);
    }

    static read(filename = '') {
        return new Promise(
            (resolve, reject) => {
                fs.readFile(
                    filename,
                    (err, fileData) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(fileData);
                    }
                );
        });
    }

    static write(filename, fileData) {
        return new Promise(
            (resolve, reject) => {
                fs.writeFile(
                    filename,
                    fileData,
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve();
                    }
                );
            }
        );
    }
}
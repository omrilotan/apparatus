module.exports = class Operation {
    constructor(callback) {
        this.callback = callback;
        this.stack = 0;

        this.progress = this.progress.bind(this);
    }

    register(fn) {
        this.stack++;
        fn(this.progress);
    }

    progress() {
        if (--this.stack) {
            return;
        }

        this.callback();
    }
}

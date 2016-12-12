class Flow {
    constructor() {
        this.stack = [];
    }
    step(fn) {
        this.stack.push(fn);
        return this;
    }
    go() {
        if (this.stack.length < 1) {
            return;
        }

        [].push.call(arguments, this.go.bind(this));
        [].unshift.call(arguments, this.stack.shift(), null);
        let fn = [].shift.call(arguments);

        return fn.bind.apply(fn, arguments)();
    }
}
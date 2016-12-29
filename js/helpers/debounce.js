function debounce(subscriber, delay = 200) {
    let timer = 0;

    function debounced() {
        clearTimeout(timer);
        let args = arguments;
        [].unshift.call(args, this);
        timer = setTimeout(Function.prototype.bind.apply(register, args), delay);
    }

    function register() {
        timer = 0;
        subscriber.apply(this, arguments);
    }
    return debounced;
};

const VALID_RESULT_TYPES = Object.seal(['string', 'number']);

module.exports = (string = '', data) => {
    if (typeof string !== 'string') {
        throw new TypeError(`futile#interpolate expects first argument to be a string, got a ${typeof string}`);
    }

    if (!data) {
        return string;
    }

    function replace(haystack, needle) {
        const replacement = data[needle.trim()];

        return ~VALID_RESULT_TYPES.indexOf(typeof replacement) ? replacement : haystack;

    }

    return string
        .replace(/{{([^{}]*)}}/gm, replace)
        ;
};
const build = (function() {
    'use strict';

    function _fragment() {
        return document.createDocumentFragment();
    }

    function _element(tag = 'span', text = '', values = {}, attributes = {}) {
        let ele = document.createElement(tag);
        text && ele.appendChild(document.createTextNode(text));
        Object.keys(values).forEach((key) => ele[key] = values[key] );
        Object.keys(attributes).forEach((key) => ele.setAttribute(key, attributes[key]) );
        return ele;
    }

    return {
        _fragment,
        _element
    };
})();

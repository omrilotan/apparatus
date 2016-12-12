(function crocodile () {
    'use strict';

    const APP_NAME = 'apparatus';
    const PREFIX = jiberish();

    function retrieveWindowVariables() {
        const body = document.body;
        const script = document.createElement('script');
        const scriptContent = [].map.call(arguments, (variable) => `if (typeof ${variable} !== 'undefined') document.body.setAttribute(${PREFIX}${sanitise(variable)}', ${variable});` ).join('\n');
        const variables = {};

        script.appendChild(document.createTextNode(scriptContent));
        body.appendChild(script);

        [].forEach.call(arguments, (variable) => {
            let name = sanitise(variable);
            variables[name] = body.getAttribute(`${PREFIX}${name}`);
            body.removeAttribute(`${PREFIX}${name}`);
        });

        body.removeChild(script);
        return variables;
    }

    function sanitise(string = '') {
        return string.replace(/[^a-zA-Z]/g, '');
    }

    function jiberish(num = 1000) {
        return btoa(parseInt(Math.random() * num) + num).replace(/\=/g, '').toLowerCase();
    }

    const actions = {
        init: init,
        reload: reload,
        run: run
    };

    function init(sendResponse) {
        sendResponse();
    }

    function reload() {
        document.location.reload();
    }

    function run(sendResponse, args) {
        var success = true,
            message;
        try {
            message = eval(args.script);
        } catch (e) {
            success = false;
            message = `${e.name}: ${e.message}`;
        }
        sendResponse({
            status: success,
            message: message
        });
    }

    function listen(request, sender, sendResponse) {
        if (request.source !== APP_NAME) {
            return;
        }

        if (typeof actions[request.action] === 'function' ) {
            actions[request.action](sendResponse, request.args);
        }
    }

    chrome.runtime.onMessage.addListener(listen);
}());

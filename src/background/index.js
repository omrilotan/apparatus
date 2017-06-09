import retrieveWindowVariables from './retrieve-window-variables';

const APP_NAME = 'apparatus';

const actions = {
    init: (sendResponse) => sendResponse(),
    reload: () => document.location.reload(),
    run
};

function run(sendResponse, args) {
    let success = true;
    let message;

    try {
        message = eval(args.script);
    } catch (e) {
        success = false;
        message = `${e.name}: ${e.message}`;
    }

    sendResponse({
        status: success,
        message
    });
}

chrome.runtime.onMessage.addListener(listen);

function listen(request, sender, sendResponse) {
    if (request.source !== APP_NAME) {
        return;
    }

    if (typeof actions[request.action] === 'function' ) {
        actions[request.action](sendResponse, request.args);
    }
}

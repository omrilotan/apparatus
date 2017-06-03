var app = (function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', start);
    listen();
    main();

    /**
     * Initialise the application:
     * Set global variables from selected tab, call init
     * No return value
     */
    function start(next = noop) {
        chrome.tabs.getSelected(null, (tab) => {
            let url = new URL(tab.url)
            globals.tab = tab;
            globals.origin = url.origin;
            globals.host   = url.host;
            globals.domain = url.hostname;
            init();
        });
    };

    /**
     * Create a handshake with page's background script
     * No return value
     */
    function init(next = noop) {
        message({
            action: 'init'
        }, next);
    }

    /**
     * Update listeners
     */
    function listen(next = noop) {
        DAL.listen('list', build.list, next);
    }

    /**
     * Main flow
     */
    function main(next = noop) {
        DAL.getColour(build.colour);

        (new Flow())
            .step(DAL.getStoredList)
            .step(build.settings)
            .step(DAL.getStoredData)
            .step(build.list)
            .step(focus)
            .step(DAL.syncLocalAndRemote)
            .step(next)
            .go();
    }

    function clear(next = noop) {
        build.settings();
        build.list();
        next();
    }

    function focus(next = noop) {
        setTimeout(focus_unless_settings, 200);
        next();
    }

    function focus_unless_settings() {
        if (document.body.classList.contains('settings')) {
            return;
        }

        if (!document.body.classList.contains('list')) {
            return;
        }

        document.querySelector('input[target="listsearch"]').focus()
    }

    return {
        main,
        clear,
        focus
    };
}());
(function (document) {
    document.body.addEventListener('click', callback);
    document.body.addEventListener('submit', callback);
    document.body.addEventListener('focus', callback);
    document.body.addEventListener('keyup', callback);
    document.body.addEventListener('search', callback);

    function callback(evt) {
        let tag = evt.target.tagName.toLowerCase();

        if (tagActions.hasOwnProperty(tag)) {
            tagActions[tag].apply(evt.target, arguments);
        }
    }

    let tagActions = {};

    ['h2', 'a', 'form', 'input'].forEach((tag) => {
        tagActions[tag] = function(evt) {
            if (tagActions[tag].hasOwnProperty(evt.type)) {
                tagActions[tag][evt.type].call(evt.target, evt);
            }
        }
    });

    /**
     * H2 tag callbacks
     * @param  {Event} DOM submit event
     * No return value
     */
    tagActions.h2.click = function(evt) {
        let target = evt.target;
        let parent = target.parentNode;

        if (parent.firstChild !== target) {
            return;
        }
        parent.classList.toggle('fold');

        DAL.store(`section_${parent.getAttribute('data-section')}_fold`, parent.classList.contains('fold'));
    }

    /**
     * A tag callbacks
     * @param  {Event} DOM submit event
     * No return value
     */
    tagActions.a.click = function(evt) {
        let target = evt.target;
        let targetAttr = target.getAttribute('target');
        let href = target.getAttribute('href');

        if (tagActions.a.click.hasOwnProperty(targetAttr)) {
            evt.preventDefault();
            tagActions.a.click[targetAttr].call(evt, target, href);
            return;
        }

        // Default link behaviour
        chrome.tabs.create({ url: href });
    }

    tagActions.a.click.cookie = function (target, href) {
        let pair = href.split(':');
        let name = pair[0];
        let value = pair[1] || 'true';

        chrome.cookies.get({
            url: globals.origin,
            name: name
        }, (biscuit) => toggleCookie(biscuit, name, value, notify) );
    }

    tagActions.a.click.script = function(target, script) {
        message({
            action: 'run',
            args: { script: script }
        }, notifyMessageResponse);
    };

    function notifyMessageResponse(e) {
        notify(
            typeof e.message === 'string' ?
                e.message :
                `The operation was a ${e.status ? 'success' : 'failure!'}`
        );
    }

    tagActions.a.click.settings = function() {
        document.body.classList.toggle('settings');
    }

    tagActions.a.click.purge = function() {
        (new Flow())
            .step(DAL.purge)
            .step(app.clear)
            .step(() => document.body.classList.remove('settings'))
            .go();
    }

    tagActions.a.click.colour = function(target, value) {
        build.colour(value);
        DAL.setColour(value);
        document.body.classList.remove('settings');
    }

    /**
     * Form submit callbacks
     * @param  {Event} DOM submit event
     * No return value
     */
    tagActions.form.submit = function(evt) {
        let target = evt.target;
        let targetAttr = target.getAttribute('target');
        let action = target.action;

        if (tagActions.form.submit.hasOwnProperty(targetAttr)) {
            evt.preventDefault();
            tagActions.form.submit[targetAttr].call(evt, target, action);
        }
    }

    tagActions.form.submit.search = function(target, action) {
        let value = [].find.call(target, (item) => item.name === 'query').value;

        chrome.tabs.create({ url: `${action}${value}` });
    };

    tagActions.form.submit.sheet = function(target, action) {
        let value = [].find.call(target, (item) => item.name === 'url').value;
        DAL.updateSheet(value);
        document.body.classList.remove('settings');
        DAL.syncLocalAndRemote(app.main);
    };

    /**
     * Input focus callbacks
     * @param  {Event} DOM submit event
     * No return value
     */
    tagActions.input.focus = function(evt) {
        evt.target.getAttribute('autohighlight') !== null && evt.target.select();
    }

    tagActions.input.search =
    tagActions.input.keyup = function(evt) {
        let target = evt.target;
        let targetAttr = target.getAttribute('target');
        let action = target.action;

        if (tagActions.input.keyup.hasOwnProperty(targetAttr)) {
            tagActions.input.keyup[targetAttr].call(evt, target, action);
        }
    }

    let lastlistsearch = '';
    tagActions.input.keyup.listsearch = debounce((target, action) => {
        if (target.value === lastlistsearch) {
            return;
        }

        switch (target.value) {
            case '':
                (new Flow())
                    .step(DAL.getStoredData)
                    .step(build.list)
                    .go();
                break;
            default:
                (new Flow())
                    .step(DAL.getStoredData)
                    .step((list, next) => DAL.filter(list, target.value, next) )
                    .step(build.list)
                    .go();
                break;
        }

        lastlistsearch = target.value;
    });

}(document));

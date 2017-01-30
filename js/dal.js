var DAL = (function() {
    'use strict';

    const STORAGE_NS = 'sync';
    const DATA_KEY = 'listdata';
    const SHEET_KEY = 'sheetdata';
    const THEME_KEY = 'theme';
    const TABLE_TITLES = [
        'label',
        'type',
        'title',
        'value'
    ];
    const memoiser = { list: null, sheet: null };


    ///////////////
    // Interface //
    ///////////////
    const _interface = {
        listen,

        purge,
        excerpt,
        store,

        worksheetURL,
        updateSheet,
        getStoredList,
        filter,
        getStoredData,
        syncLocalAndRemote,

        setColour,
        getColour
    };


    function worksheetURL(url) {
        if (!url) {
            return '';
        }

        return WORKSHEET_TEMPLATE.replace('{{ID}}', extractSheetId(url));
    }

    function sheetDataURI(url) {
        return SHEET_TEMPLATE.replace('{{ID}}', extractSheetId(url));
    }

    function extractSheetId(url) {
        let matches = url.match(SHEET_ID_MATCH);

        return matches === null ? '' : matches[0];
    }

    /**
     * Memoise items in global scope
     * @param  {String}   key
     * @param  {Any}      value
     * @param  {Function} callback
     * No return value
     */
    function memoise(key, value, next = noop) {
        memoiser[key] = value;
        next(value);
    }

    memoise.get = function memoise$get (key, next = noop) {
        return memoiser[key];
    }

    memoise.clear = function memoise$clear(next = noop) {
        empty(memoiser, next)
    }

    ///////
    //   //
    ///////
    function getStoredData(next = noop) {
        (new Flow())
            .step((next) => chrome.storage[STORAGE_NS].get(DATA_KEY, next) )
            .step((items, next) => next(items && items[DATA_KEY]) )
            .step((list) => memoise('list', list, next) )
            .go();
    }

    function filter(list, filter, next = noop) {
        let filtered = list.filter((item) => item[0].title.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
        if (list.length > 0 && filtered.length === 0) {
            filtered.unshift([{ type: 'plain', value: 'no results' }]);
        }
        next(filtered);
    }

    function getStoredList(next = noop) {
        (new Flow())
            .step((next) => chrome.storage[STORAGE_NS].get(SHEET_KEY, next) )
            .step((items, next) => next(items && items[SHEET_KEY]) )
            .step((sheet, next) => memoise('sheet', sheet, next) )
            .step((sheet) => next(sheet))
            .go();
    }

    function purge(next = noop) {
        memoise.clear();
        chrome.storage[STORAGE_NS].clear();
        next();
    }

    function store(key, value, next = noop) {
        chrome.storage[STORAGE_NS].set({ [key]: value }, next);
    }

    function setColour(value, next = noop) {
        chrome.storage[STORAGE_NS].set({ [THEME_KEY]: value }, next);
    }

    function getColour(next = noop) {
        chrome.storage[STORAGE_NS].get(THEME_KEY, (items) => {
            next(items[THEME_KEY]);
        });
    }

    function updateSheet(value, next = noop) {
        memoise('sheet', value);
        store(SHEET_KEY, extractSheetId(value), next)
    }

    function updateList(value, next = noop) {
        store(DATA_KEY, value, next)
    }

    function excerpt(key, next = noop) {
        chrome.storage[STORAGE_NS].get(key, (items) => {
            next(items[key])
        });
    }

    ///////////////////////
    // Remote Data Fetch //
    ///////////////////////
    function syncLocalAndRemote(next = noop) {
        if (!memoiser.sheet) {
            next();
            return;
        }

        let url = sheetDataURI(memoiser.sheet || '');

        try {
            fetch(url)
                .then((response) => response.json())
                .then((res) => storeRemoteList(res, next) );
        } catch (e) {
            notify('Error reading file');
            next();
        }
    }

    function storeRemoteList(res, next) {
        const feed = res.feed;
        const list = getList(feed);
        const link = getLink(feed);

        compare(memoise.get('data'), list, next, () => updateList(list, next));
    }

    function compare(a, b, identical, different) {
        (JSON.stringify(a) === JSON.stringify(b) ? identical : different)();
    }

    function getList(feed) {
        return feed.entry.map(getLine).map(parseItem);
    }

    function getLine(entry) {
        return entry.content.$t;
    }

    // Defining the titles search explicitly so we can support ': ' and ', ' in strings
    function parseItem(line) {
        return [
            TABLE_TITLES.map((title, i) => {
                line = line.replace(`${title}: `, '');
                let next = TABLE_TITLES[i + 1];
                let value;

                if (next) {
                    let index = line.indexOf(`${next}: `);
                    value = line.substr(0, index - 2); // remove ', ' at the end
                    line = line.substr(index);
                } else {
                    value = line;
                }

                return {[title]: value};
            }).reduce((a, b) => Object.assign(a, b))
        ];
    }

    function getLink(feed) {
        let link = feed.link.find((entry) => entry.rel === 'alternate');
        return link.href.replace(/\/pubhtml$/, '');
    }

    ////////////////////////
    // Remote Data Update //
    ////////////////////////
    function listen(type, callback) {
        if (!iDictionary.hasOwnProperty(type)) {
            return;
        }

        iDictionary[type].callbacks.push(callback);
    }

    const iDictionary = {
        sheet: {
            storageKey: SHEET_KEY,
            callbacks: [],
            updateMessage: 'New list',
            local: 'sheet'
        },
        list: {
            storageKey: DATA_KEY,
            callbacks: [],
            updateMessage: 'List updating',
            local: 'list'
        }
    };

    chrome.storage.onChanged.addListener(storageChanged);

    function storageChanged(changes, namespace) {
        if (namespace !== STORAGE_NS) {

            // No changes, keep silent
            return;
        }

        Object.keys(iDictionary).forEach((key) => updatedStorage(changes, iDictionary[key]) );
    }

    function updatedStorage(changes, dictionary) {
        changes[dictionary.storageKey] && triggerUpdate(dictionary, changes);
    }

    function triggerUpdate(dictionary, changes) {
        notify(dictionary.updateMessage);

        memoise(dictionary.local, changes[dictionary.storageKey].newValue);

        let callbacks = dictionary.callbacks;
        let i = callbacks.length;

        while (--i > -1) {
            callbacks[i].call(null, memoise.get(dictionary.local));
        }
    }

    return _interface;
}());
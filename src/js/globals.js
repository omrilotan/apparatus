/*
 * Global variables
 */
const globals = { name: 'apparatus' };

const SHEET_TEMPLATE = 'https://spreadsheets.google.com/feeds/list/{{ID}}/od6/public/basic?alt=json';
const WORKSHEET_TEMPLATE = 'https://docs.google.com/spreadsheets/d/{{ID}}';
const SHEET_ID_MATCH = /(\w|\_|\-){30,}/;

const FOLD_KEY = 'section_${name}_fold';

/**
 * Delete all keys from an object
 * @param  {Object}   object
 * @param  {Function} next
 * No return value
 */
function empty(object = {}, next = noop) {
    Object.keys(object).forEach((key) => delete object[key] );
    next(object);
}

/**
 * Operation that does nothing
 */
function noop() {}

/**
 * Communicate with page's background script
 * @param  {Object} data: {action: String, *args: {}}
 * @param  {Function} *callback
 * No return value
 */
function message(data, callback = noop) {
    if (!data || !globals.tab) {
        return;
    }

    data.source = globals.name;
    data.args = data.args || {};
    chrome.tabs.sendMessage(globals.tab.id, data, callback);
};

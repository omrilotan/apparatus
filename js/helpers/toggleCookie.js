function toggleCookie(biscuit, name, value, notify) {
    if (biscuit && biscuit.value === value) {

        chrome.cookies.remove({
            url: globals.origin,
            name: name
        }, () => notify(`removed cookie ${name}`) );
        return;
    }

    chrome.cookies.set({
        url: globals.origin,
        domain: globals.domain,
        path: '/',
        name: name,
        value: value
    }, () => notify(`set cookie ${name}: ${value}`) );
}
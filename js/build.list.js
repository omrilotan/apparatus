build.list = (function(
    _fragment,
    _element
) {
    'use strict';

    const GENERAL = 'GENERAL_LABEL';
    const nav = document.querySelector('nav');
    const fragments = {};
    const dictionary = {
        note: _note,
        link: _link,
        cookie: _cookie,
        script: _script,
        search: _search,
        listsearch: _listsearch
    };

    function buildList(items = [], next = noop) {
        nav.innerHTML = '';
        empty(fragments);

        if (!items || !items.length) {
            nav.appendChild(emptyNav());
            next();
            return;
        }

        if (items.filter((item) => item[0].type === 'listsearch').length === 0) {
            appendToFragemnt(_listsearch({ value: '' }));
        }

        items.map(buildRecord).forEach(appendToFragemnt);
        group(fragments, (res) => nav.appendChild(res) );

        setTimeout(() => nav.querySelector('input[target="listsearch"]').focus(), 200);

        next();
    }

    function emptyNav() {
        let fragment = _fragment();

        fragment.appendChild(_element(
            'div',
            '',
            {
                className: 'point',
                innerHTML: '&#10548;'
            }
        ));
        fragment.appendChild(_element('br'));
        fragment.appendChild(_element('h1', 'Start using Apparatus'));
        fragment.appendChild(_element('p', 'Add a link in the settings menu'));

        return fragment;
    }

    function appendToFragemnt(element) {
        let label = element.label || GENERAL;

        fragments[label] = fragments[label] || _fragment();
        fragments[label].appendChild(element);
    }

    function buildRecord(record) {
        let item = Object.assign.apply({}, record);

        item.type = item.type || '';
        let type = item.type.trim().toLowerCase();

        return dictionary.hasOwnProperty(type) ? dictionary[type](item) : _fragment();
    }

    function _listsearch(data) {
        return _element(
            'input',
            '',
            {
                name: 'listsearch',
                type: 'search',
                value: data.value || ''
            },
            {
                placeholder: 'Filter this list',
                target: 'listsearch'
            }
        );
    }

    function _link(data) {
        return _element(
            'a',
            data.hasOwnProperty('title') ? data.title : ' ',
            {
                href: data.value || '',
                label: data.label || '',
                className: data.className || ''
            }
        );
    }

    function _cookie(data) {
        return _element(
            'a',
            data.title,
            {
                href: data.value,
                label: data.label,
                className: data.className
            },
            {
                target: 'cookie'
            }
        );
    }

    function _script(data) {
        return _element(
            'a',
            data.title,
            {
                href: data.value,
                label: data.label,
                className: data.className
            },
            {
                target: 'script'
            }
        );
    }

    function _search(data) {
        let f = _element(
            'form',
            '',
            {
                action: data.value,
                method: 'GET',
                label: data.label
            },
            {
                target: 'search'
            }
        );

        let div = _element('div');

        let i = _element(
            'input',
            '',
            {
                name: 'query',
                type: 'search'
            },
            {
                placeholder: data.title
            }
        );

        div.appendChild(i);
        f.appendChild(_element('button', '', { innerHTML: '&#128270;' }));
        f.appendChild(div);
        return f;
    }

    function _note(data) {
        let article = document.createElement('article');
        article.className = 'note';
        if (data.title) {
            let h = document.createElement('h3');
            h.appendChild(document.createTextNode(data.title));
            article.appendChild(h);
        }

        (data.value || '').split('\\n').forEach((line) => {
            if (!line) {
                return;
            }

            let p = document.createElement('p');
            p.appendChild(document.createTextNode(line));
            article.appendChild(p);
        });

        return article.children.length ? article : _fragment();
    }

    function group(fragments, next = noop) {
        let wrap = _fragment();
        let len = fragments.length;

        Object.keys(fragments).forEach((name) => {
            section(name, fragments[name], (res) => {
                wrap.appendChild(res);
                if (!--len) {
                    next(wrap);
                }
            });
        });
    }

    function section(title, fragment, next = noop) {
        let wrap = document.createElement('section');

        wrap.setAttribute('data-section', title);
        if (title !== GENERAL) {
            wrap.appendChild(_element('h2', title));
        }
        wrap.appendChild(fragment);

        if (title === GENERAL) {
            next(wrap);
            return;
        }

        // FOLD_KEY.replace(/${name}/, title)
        let key = `section_${title}_fold`;

        DAL.excerpt(key, (folded) => {
            wrap.classList.toggle('fold', (typeof folded === 'boolean' ? folded : true));
            next(wrap);
        });
    }

    return buildList;
}(
    build._fragment,
    build._element
));
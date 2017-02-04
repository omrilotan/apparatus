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
        plain: _plain,
        link: _link,
        cookie: _cookie,
        script: _script,
        search: _search
    };

    let tabindex = 0;

    function buildList(items = [], next = noop) {
        nav.innerHTML = '';
        empty(fragments);

        if (!items || !items.length) {
            nav.appendChild(emptyNav());
            document.body.classList.remove('list');
            next();
            return;
        }

        tabindex = 0;

        items.map(buildRecord).forEach(appendToFragemnt);
        group(fragments, (res) => nav.appendChild(res) );
        setTimeout(() => document.body.classList.add('list'), 500);

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

    function _link(data) {
        return _element(
            'a',
            data.hasOwnProperty('title') ? data.title : ' ',
            {
                href: data.value || '',
                label: data.label || '',
                className: data.className || ''
            },
            {
                tabindex: ++tabindex
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
                target: 'cookie',
                tabindex: ++tabindex
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
                target: 'script',
                tabindex: ++tabindex
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
                placeholder: data.title,
                tabindex: ++tabindex
            }
        );

        div.appendChild(i);
        f.appendChild(_element('button', '', { innerHTML: '&#128270;' }, {tabindex: '-1'}));
        f.appendChild(div);
        return f;
    }

    function _note(data) {
        let article = _element('article', '', { className: 'note' });

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

    function _plain(data) {
        return _element('span', data.value);
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
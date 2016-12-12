build.settings = (function(
    _fragment,
    _element
) {
    'use strict';
    const settings = document.querySelector('aside');

    function buildSettings(url = '', next = noop) {
        let fragment = _fragment();
        settings.innerHTML = '';

        fragment.appendChild(sheetForm(url));
        fragment.appendChild(preferenceForm(url));
        fragment.appendChild(about());

        settings.appendChild(fragment);

        next();
    }

    function sheetForm(url) {
        let section = document.createElement('section');
        let docURL = DAL.worksheetURL(url);
        let form = _element(
            'form',
            '',
            {
                className: 'sheet-form',
                action: 'sheet',
                method: 'GET',
                label: 'sheet'
            }, {
                target: 'sheet'
            }
        );

        section.appendChild(_element(
            'h4',
            'Sheet settings'
        ));

        docURL && form.appendChild(purge());
        docURL && form.appendChild(sheetLink(docURL));
        form.appendChild(sheetEdit(docURL));
        section.appendChild(form);

        return section;
    }

    function sheetEdit(url) {
        let div = _element('div');

        let i = _element(
            'input',
            '',
            {
                name: 'url',
                type: 'url',
                value: url
            }, {
                autohighlight: 'true',
                placeholder: 'Enter sheet URL'
            }
        );

        div.appendChild(i);

        return div;
    }

    function sheetLink(url) {
        return _element(
            'a',
            '',
            {
                href: url,
                innerHTML: '&#9997;'
            }
        );
    }

    function purge() {
        return _element(
            'a',
            '',
            {
                href: '#!',
                innerHTML: '&times;'
            }, {
                target: 'purge'
            }
        );
    }


    function preferenceForm() {
        let fragment = _fragment();

        fragment.appendChild(_element('h4', 'Select theme'));

        [
            '#1abc9c',
            '#3498db',
            '#2c3e50',
            '#8e44ad',
            '#d35400'
        ].forEach((hex) => fragment.appendChild(colour(hex)));

        return fragment;
    }

    function colour(hex) {
        return _element(
            'a',
            '',
            {
                innerHTML: '&nbsp;',
                href: hex,
                className: 'colour',
                style: `color:#fff; background:${hex};`
            },
            {
                target: 'colour'
            }
        );
    }

    function about() {
        let fragment = _fragment();

        fragment.appendChild(_element('h4', 'About Apparatus'));

        let summary = _element('p');
        summary.appendChild(document.createTextNode('Apparatus is an '));
        summary.appendChild(_element(
            'a',
            'open source',
            {
                href: 'https://github.com/omrilotan/apparatus'
            }
        ));
        summary.appendChild(document.createTextNode(' bookmark and collaboration tool. Create your spreadsheet and start collaborating!'));
        summary.appendChild(_element('br'));
        summary.appendChild(_element(
            'a',
            'Instructions are available in the repo.',
            {
                href: 'https://github.com/omrilotan/apparatus#readme'
            }
        ));

        fragment.appendChild(summary);

        return fragment;
    }

    return buildSettings;
}(
    build._fragment,
    build._element
));
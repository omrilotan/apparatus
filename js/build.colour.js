build.colour = (function(
    _fragment,
    _element
) {
    'use strict';

    function setColour(value) {
        if (!value) {
            return;
        }

        document.styleSheets[0].removeRule(0);
        document.styleSheets[0].addRule(':root', `--theme-colour:${value}`, 0);
    }

    return setColour;
}(
    build._fragment,
    build._element
));
import sanitise from '../helpers/sanitise';

export default function retrieveWindowVariables(...variables) {
    const prefix = btoa(parseInt(Math.random() * 1000) + 1000).replace(/\=/g, '').toLowerCase();

    const script = document.createElement('script');
    const results = {};

    script.appendChild(document.createTextNode(scriptContent(variables, prefix)));
    document.body.appendChild(script);

    variables.forEach((variable) => results[name] = takeVariableFromBody(variable, prefix));

    document.body.removeChild(script);
    return results;
}

function takeVariableFromBody(variable, prefix = '') {
    const name = sanitise(variable);

    result = document.body.getAttribute(`${prefix}${name}`);
    document.body.removeAttribute(`${prefix}${name}`);

    return result;
}

const scriptContent = (variables, prefix = '') => arguments.map((variable) => `if (typeof ${variable} !== 'undefined') document.body.setAttribute(${prefix}${sanitise(variable)}', ${variable});` ).join('\n');

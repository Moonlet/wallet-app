export function sanitizeObject(originalObj) {
    const obj = JSON.parse(JSON.stringify(originalObj));
    const result = {};

    for (const key of Object.keys(obj)) {
        if (isPropSafe(key)) {
            typeof obj[key] === 'object'
                ? (result[key] = sanitizeObject(obj[key]))
                : (result[key] = obj[key]);
        }
    }

    return result;
}

export function filterObjectProps(originalObj, propsList) {
    const obj = JSON.parse(JSON.stringify(originalObj));
    return filterProps(obj, parseProps(propsList));
}

function filterProps(obj, propsObject = {}) {
    const result = {};
    for (const prop of Object.keys(propsObject)) {
        if (obj[prop] && Object.keys(propsObject[prop]).length > 0) {
            result[prop] = filterProps(obj[prop], propsObject[prop]);
        }

        if (['string', 'boolean', 'number'].indexOf(typeof obj[prop]) >= 0) {
            result[prop] = obj[prop];
        }
    }
    return result;
}

function isPropSafe(prop) {
    const wordsBlackList = [
        /user(names?)?/gi,
        /pass(words?)?/gi,
        /mnemonics?/gi,
        /.*secret.*/gi,
        /pin_?(codes?)?/gi,
        /.*(token).*/gi,
        /address/gi,
        /.*key.*/gi,
        /.*private.*/gi,
        /.*seed.*/gi,
        /.*encrypt.*/gi,
        /.*decrypt.*/gi
    ];

    let propElements = prop.split('.');
    const propElementLength = propElements.length;
    for (const regexp of wordsBlackList) {
        propElements = propElements.filter(p => !p.match(regexp));
        if (propElements.length !== propElementLength) {
            return false;
        }
    }
    return propElements.length === propElementLength;
}

function parseProps(props) {
    const splittedProps = props.filter(p => isPropSafe(p)).map(p => p.split('.'));
    const propsObject = {};
    for (const propList of splittedProps) {
        let iterator = propsObject;
        for (const prop of propList) {
            if (!iterator[prop]) {
                iterator[prop] = {};
            }
            iterator = iterator[prop];
        }
    }
    return propsObject;
}

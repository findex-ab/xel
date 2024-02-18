export var isFunction = function (v) {
    if (!v)
        return false;
    return typeof v === 'function';
};
export var isArray = function (x) {
    if (isUndefined(x) || x === null)
        return false;
    return Array.isArray(x);
};
export var isNumber = function (x) { return typeof x === 'number'; };
export var isString = function (x) { return typeof x === 'string'; };
export var isBoolean = function (x) { return typeof x === 'boolean'; };
export var isFactor = function (x) { return isNumber(x) || isString(x) || isBoolean(x) || isDate(x); };
export var isUndefined = function (x) { return (typeof x === 'undefined'); };
export var isDigit = function (c) {
    if (isUndefined(c) || c === null)
        return false;
    var n = c.codePointAt(0) || 0;
    return n >= 48 && n <= 57;
};
export var isNumerical = function (c) {
    var digits = Array.from(c).filter(isDigit);
    return digits.length >= c.length;
};
export var isFloat = function (x) { return isNumber(x) && x.toString().includes('.'); };
export var isHTMLElement = function (x) {
    if (!x)
        return false;
    return !!x.appendChild || !!x.addEventListener;
};
export var isHTMLString = function (x) {
    if (!x)
        return false;
    if (!isString(x))
        return false;
    return x.includes('<') && x.includes('>');
};
export var isDate = function (x) {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return !!x.getDay;
};
export var isSvgTag = function (name) { return ['svg', 'path', 'line', 'circle', 'g', 'clipPath', 'mask', 'view'].includes(name); };
export var isPromise = function (x) {
    if (!x)
        return false;
    return (!!x.then || !!x.catch);
};
export var isInf = function (x) { return !isFinite(x); };
export var isError = function (x) {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return !!x.stack;
};
export var isNullish = function (x) {
    if (isUndefined(x))
        return true;
    if (x === null)
        return true;
    if (isString(x) && x.trim().length <= 0)
        return true;
    return false;
};
export var isNotNullish = function (x) { return !isNullish(x); };
//# sourceMappingURL=is.js.map
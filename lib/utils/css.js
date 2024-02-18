import { camelToKebab } from '../utils/camel';
var formatValue = function (key, v) {
    return key === 'content' ? "\"".concat(v, "\"") : "".concat(v);
};
export var cssPropsToString = function (style) {
    return Object.entries(style)
        .map(function (_a) {
        var k = _a[0], v = _a[1];
        return "".concat(camelToKebab(k), ": ").concat(formatValue(k, v), ";");
    })
        .join('\n')
        .trimEnd();
};
//# sourceMappingURL=css.js.map
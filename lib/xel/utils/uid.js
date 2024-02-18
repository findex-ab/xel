import { range } from "./array";
import { hashu32, toUint32 } from "./hash";
import { isFunction, isNumber, isString } from "./is";
export var genUid = function (seed) {
    var chars = Array.from("abcdefghijklmnopqrstuvwxyz0123456789");
    var h = 0;
    if (isFunction(seed)) {
        seed = JSON.stringify(seed);
    }
    if (isString(seed)) {
        for (var _i = 0, _a = Array.from(seed); _i < _a.length; _i++) {
            var c = _a[_i];
            var d = toUint32(c.codePointAt(0));
            d ^= d << toUint32(17);
            d ^= d >> toUint32(13);
            d ^= d << toUint32(5);
            d = toUint32(d);
            d *= 7683;
            d = toUint32(d);
            h += d;
            h = toUint32(h);
        }
    }
    else if (isNumber(seed)) {
        h += hashu32(toUint32(seed));
    }
    h = toUint32(hashu32(toUint32(h)));
    return range(24)
        .map(function (i) { return chars[toUint32(i + h * 45 + hashu32(i + h)) % chars.length]; })
        .join("");
};
//# sourceMappingURL=uid.js.map
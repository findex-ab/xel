import { isFloat } from "./is";
export var floatBitsToUint = function (f) {
    var buffer = new ArrayBuffer(4);
    var view = new DataView(buffer);
    view.setFloat32(0, f);
    return view.getUint32(0);
};
export var toUint32 = function (f) {
    var buffer = new ArrayBuffer(4);
    var view = new DataView(buffer);
    view.setUint32(0, isFloat(f) ? floatBitsToUint(f) : f);
    return view.getUint32(0);
};
export var hashu32 = function (i) {
    i = toUint32(i);
    var s = ((i >> 3) * 12);
    var k = ~i + ~s;
    i ^= i << 17;
    i ^= i >> 13;
    i ^= i << 5;
    i += (i ^ k) + i * k;
    i *= 1013;
    i ^= (i >> 4);
    return toUint32(i * k + i + i * k + k);
};
//# sourceMappingURL=hash.js.map
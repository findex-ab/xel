var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { isArray, isFunction, isHTMLElement, isNumber, isString, isSvgTag, } from "./utils/is";
import { cssPropsToString } from "./utils/css";
import { xReactive } from "./utils/reactivity/reactive";
import { range } from "./utils/array";
import { hashu32, toUint32 } from "./utils/hash";
var SVG_NS = "http://www.w3.org/2000/svg";
export var isXElementLoaded = function (x) { return !!x && !!x.el; };
var assignElement = function (x, el) {
    if (!isHTMLElement(el))
        return el;
    if (x.el) {
        x.el.replaceWith(el);
    }
    x.el = el;
    setAttributes(x, { state: x.state, x: x, el: el }, x.el);
    return x.el;
};
var addChild = function (xel, child) {
    child.getParent = function () { return xel; };
    var existing = xel.children.find(function (child) { return isXElement(child) && child.uid === child.uid; });
    if (existing) {
        assignElement(existing, child.el);
        var idx_1 = xel.children.indexOf(existing);
        xel.children = xel.children.map(function (ch, i) { return (i === idx_1 ? child : ch); });
    }
    else {
        xel.children = __spreadArray(__spreadArray([], xel.children, true), [child], false);
    }
};
var setAttribute = function (x, el, key, value) {
    if (!el.setAttribute)
        return;
    key = key.toString();
    if ([
        "render",
        "el",
        "magic",
        "state",
        "name",
        "initialState",
        "children",
    ].includes(key))
        return;
    if (key.startsWith("on") && isFunction(value)) {
        el.addEventListener(Array.from(key).splice(2).join(""), value);
        return 1;
    }
    if (key.startsWith("inner")) {
        try {
            el[key] = value;
        }
        catch (e) { }
        return;
    }
    if (key === "style" && isHTMLElement(el)) {
        var css = cssPropsToString(value);
        el.setAttribute("style", css);
        return;
    }
    if (key === "className" || key === "class") {
        el.className = (Array.isArray(value) ? value.join(" ") : value) + "";
        return;
    }
    var replaceAll = function (haystack, needle, repl) {
        while (true) {
            if (!haystack.includes(needle))
                break;
            haystack = haystack.replace(needle, repl);
        }
        return haystack;
    };
    if (key === "stylesheet" && isHTMLElement(el)) {
        var clazz_1 = ".c-".concat(x.uid);
        var csskeys = Object.keys(value);
        var specialKeys_1 = csskeys.filter(function (ck) { return ck.startsWith(":") || ck.includes("&"); });
        var normalKeys = csskeys.filter(function (ck) { return !specialKeys_1.includes(ck); });
        var pseudoObjects = specialKeys_1
            .map(function (k) {
            if (k.includes("&")) {
                return "".concat(replaceAll(k, "&", clazz_1), " { ").concat(cssPropsToString(value[k]), " }");
            }
            return ".c-".concat(x.uid).concat(k, " { ").concat(cssPropsToString(value[k]), " }");
        })
            .join("\n");
        var normalObject = Object.assign.apply(Object, __spreadArray([{}], normalKeys.map(function (k) {
            var _a;
            return (_a = {}, _a[k] = value[k], _a);
        }), false));
        var styleID = "style-".concat(x.uid);
        var styleEl = x.styleEl || document.getElementById(styleID);
        var exists = !!styleEl;
        styleEl = styleEl || document.createElement('style');
        styleEl.setAttribute('id', styleID);
        styleEl.innerText = ".c-".concat(x.uid, " {").concat(cssPropsToString(normalObject), " }\n") + pseudoObjects;
        if (!exists) {
            document.head.append(styleEl);
        }
        //x.config.children = [
        //  ...(x.config.children || []),
        //  X("style", {
        //    type: "text/css",
        //    innerText:
        //      `.c-${x.uid} {${cssPropsToString(normalObject)} }\n` + pseudoObjects,
        //  }),
        //];
        return;
    }
    try {
        el.setAttribute(key, value);
    }
    catch (e) {
        console.error({ element: el });
        console.warn(e);
    }
};
export var isXElement = function (x) {
    return !!x &&
        Array.isArray(x) === false &&
        typeof x === "object" &&
        !!x.magic &&
        x.magic === "x";
};
export var isXFunction = function (x) { return isFunction(x); };
export var xRender_number = function (x, callee) {
    return document.createTextNode("".concat(x));
};
export var xRender_string = function (x, callee) {
    return document.createTextNode("".concat(x));
};
export var xRender_function = function (x, callee) {
    var f = x.bind(callee.x || {});
    var ret = f(callee.args || {}, callee.state, callee);
    if (isXElement(ret) && callee.x) {
        addChild(callee.x, ret);
    }
    return xRender(ret, callee);
};
export var xRender_element = function (x, callee) { return x; };
var pushClass = function (attr, cls) {
    if (isString(attr))
        return ["".concat(attr, " ").concat(cls)];
    if (isArray(attr))
        return __spreadArray(__spreadArray([], attr, true), [cls], false);
    return [cls];
};
var setAttributes = function (x, callee, el) {
    el = (el || x.el);
    if (!el || !isHTMLElement(el))
        return;
    callee = __assign(__assign({}, callee), { args: __assign(__assign({}, (callee.args || {})), (x.config || {})) });
    var attributes = __assign({}, (callee.args || {}));
    attributes.className = pushClass(attributes.className, "c-".concat(x.uid)).join(" ");
    for (var _i = 0, _a = Object.entries(attributes); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        setAttribute(x, el, key, value);
    }
};
//class: `c-${x.uid}`
export var xRender_x = function (x, callee) {
    var _a;
    callee = __assign(__assign({}, callee), { args: __assign(__assign({}, (callee.args || {})), (x.config || {})) });
    var tag = x.config.name || "div";
    var el = isSvgTag(tag)
        ? document.createElementNS(SVG_NS, tag)
        : document.createElement(tag);
    var attributes = __assign({}, (callee.args || {}));
    attributes.className = pushClass(attributes.className, "c-".concat(x.uid)).join(" ");
    for (var _i = 0, _b = Object.entries(attributes); _i < _b.length; _i++) {
        var _c = _b[_i], key = _c[0], value = _c[1];
        setAttribute(x, el, key, value);
    }
    var children = ((_a = callee.args) === null || _a === void 0 ? void 0 : _a.children) || x.config.children || [];
    for (var _d = 0, children_1 = children; _d < children_1.length; _d++) {
        var child = children_1[_d];
        var args = isXElement(child) ? child.config || {} : {};
        if (isXElement(child)) {
            addChild(x, child);
        }
        mount(child, { callee: __assign(__assign({}, callee), { args: args }), target: el });
    }
    return assignElement(x, el);
};
var isVNode = function (value) {
    return value ? value.__v_isVNode === true : false;
};
var xRender_ = function (x, callee) {
    if (callee === void 0) { callee = { state: {} }; }
    if (isXFunction(x))
        return xRender_function(x, callee);
    if (isNumber(x))
        return xRender_number(x, callee);
    if (isString(x))
        return xRender_string(x, callee);
    if (isHTMLElement(x))
        return xRender_element(x, callee);
    if (isXElement(x)) {
        if (x.config.render && isXFunction(x.config.render))
            return xRender(x.config.render, { state: x.state, args: x.config, x: x });
        return xRender_x(x, callee);
    }
    var y = x;
    if (isVNode(y)) {
        if (y.el)
            return xRender_element(y.el, callee);
        if (y.outerHTML)
            return xRender_string(y.outerHTML, callee);
        return xRender("Error", callee);
    }
    return xRender_string(x.toString ? x.toString() : "?", callee); //JSON.stringify(x), callee);
};
export var xRender = function (x, callee) {
    return xRender_(x, callee);
};
export var X = function (tag, config) {
    var nextConfig = config;
    if (isXElement(config)) {
        nextConfig = { children: [config] };
    }
    else if (Array.isArray(config)) {
        nextConfig = { children: config };
    }
    else if (isXFunction(config)) {
        nextConfig = { render: config };
    }
    var cfg = __assign(__assign({}, nextConfig), { name: tag });
    var state = xReactive(cfg.initialState || {}, function (target, oldValue, nextValue) {
        if (!xel.el)
            return;
        var el = xel.el;
        if (!isHTMLElement(el))
            return;
        mount(xel, {
            replace: true,
            target: el,
            callee: {
                state: state,
                args: cfg,
                el: el,
                oldValue: oldValue,
                nextValue: nextValue
            },
        });
    });
    var genUid = function () {
        var err = new Error();
        var chars = Array.from("abcdefghijklmnopqrstuvwxyz0123456789");
        var h = 0;
        //const auid = (cfg.render ? 'Y' : 'N') + (cfg.children ? cfg.children.length.toString() : '0');
        var cname = cfg.cname || '';
        for (var _i = 0, _a = Array.from(JSON.stringify({
            a: cfg.cname,
            b: cfg.name,
            c: (cfg.children || []).length
        })); _i < _a.length; _i++) {
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
        h = toUint32(hashu32(toUint32(h)));
        return range(24)
            .map(function (i) { return chars[toUint32(i + h * 45 + hashu32(i + h)) % chars.length]; })
            .join("");
    };
    var xel = xReactive({
        config: cfg,
        magic: "x",
        state: state,
        children: [],
        call: function (props) {
            return X(tag, typeof props === "object" ? __assign(__assign({}, cfg), props) : cfg);
        },
        uid: genUid(),
        getParent: function () { return undefined; }
    });
    return xel;
};
export var mount = function (x, options) {
    var callee = __assign({}, (options.callee || { state: {} }));
    if (isXElement(x)) {
        callee.x = x;
    }
    var target = options.target;
    var el = undefined;
    el = xRender(x, callee);
    if (target) {
        if (options.replace) {
            target.replaceWith(el);
        }
        else {
            target.append(el);
        }
    }
    if (isXElement(x)) {
        assignElement(x, el);
        //if (x.config.ref) {
        // const cloned = {...x, config: {}};
        // x.config.ref.value = cloned;
        // }
        if (x.config.onMount && isXElementLoaded(x)) {
            x.config.onMount(x);
        }
        if (x.config.onUpdate && isXElementLoaded(x)) {
            x.config.onUpdate(x);
        }
    }
    return el;
};
//# sourceMappingURL=index.js.map
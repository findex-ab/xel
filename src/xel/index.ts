import {
  isArray,
  isFunction,
  isHTMLElement,
  isNumber,
  isString,
  isSvgTag,
  isUndefined,
} from "./utils/is";
import { cssPropsToString, CSSProperties } from "./utils/css";
import { XRef, xReactive, xState } from "./utils/reactivity/reactive";
import { range } from "./utils/array";
import { hashu32, toUint32 } from "./utils/hash";

const SVG_NS = "http://www.w3.org/2000/svg";

type Merged<A, B> = (A | B) | (A & B);

export type XAnyObject = { [key: string | symbol]: any };

export type XNativeProps = Omit<Partial<HTMLElement>, "children" | "style">;

export type XUserProps<T extends XAnyObject = XAnyObject> =
  | Partial<Merged<T, XNativeProps>>
  | T
  | any;

export type XNativeRenderableFactor =
  | Text
  | Element
  | HTMLElement
  | SVGElement
  | SVGSVGElement;
export type XRenderableFactor = XNativeRenderableFactor | string | number;

export type XFunction<
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
> = (
  this: XElement<CustomPropsType, StateType>,
  config: XElementConfig<CustomPropsType, StateType> & CustomPropsType,
  state: StateType,
  callee: XCallee<CustomPropsType, StateType>
) => XNativeRenderableFactor | XRenderable;

export type XFunctional<
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
> = (
  config: XElementConfig<CustomPropsType, StateType> & CustomPropsType,
  state?: StateType,
  callee?: XCallee<CustomPropsType, StateType>
) => XNativeRenderableFactor | XRenderable;

export interface XElementAttributes<
  CustomPropsType extends XAnyObject = XAnyObject,
  StateType extends XAnyObject = XAnyObject
> {
  name?: string;
  cname?: string;
  render?: XFunction<CustomPropsType, xState<StateType>>;
  children?: XRenderable[];
  initialState?: StateType;
  style?: CSSProperties;
  stylesheet?: CSSProperties;
  onMount?: (x: XElementLoaded<CustomPropsType, StateType>) => void;
  onUpdate?: (x: XElementLoaded<CustomPropsType, StateType>) => void;
  type?: string;
  innerText?: string;
  innerHTML?: string;
  ref?: XRef<XElement | undefined>;
  [key: string | symbol]: any;
}
//export type XElementAttributes<
//  CustomPropsType extends XAnyObject = XNativeProps,
//  StateType extends XAnyObject = XAnyObject
//> = Partial<WindowEventMap> | CustomPropsType & Partial<XNativeProps>  & {
//  name?: string;
//  cname?: string;
//  render?: XFunction<CustomPropsType, StateType>;
//  children?: XRenderable[];
//  initialState?: StateType;
//  style?: CSSProperties;
//  stylesheet?: CSSProperties;
//  onMount?: (x: XElementLoaded<CustomPropsType, StateType>) => void;
//  type?: string;
//  innerText?: string;
//  innerHTML?: string;
//}

export type XElementConfig<
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
> = XElementAttributes<CustomPropsType, StateType>;

export type XElementInit<
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
> = XElementAttributes<CustomPropsType, StateType> | CustomPropsType;
//| Omit<XElementConfig<CustomPropsType, StateType>, "name">
//| XElementAttributes<CustomPropsType, StateType>
//| Partial<XElement>
//| Partial<XElement>[]
//| XFunction<CustomPropsType, StateType>

export type XElementLoaded<
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
> = Omit<XElement<CustomPropsType, StateType>, "el"> & {
  el: XNativeRenderableFactor;
};

export type XElement<
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
> = {
  state: xState<StateType>;
  config: XElementConfig<CustomPropsType, StateType>;
  magic: "x";
  children: XRenderable[];
  el?: XNativeRenderableFactor;
  styleEl?: HTMLStyleElement;
  call: (
    props: XElementInit<CustomPropsType, StateType> | Partial<CustomPropsType>
  ) => XElement;
  uid: string;
  getParent: (() => XElement | undefined);
};

export const isXElementLoaded = (
  x: XElement | XElementLoaded
): x is XElementLoaded => !!x && !!x.el;

export type XRenderable<
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
> =
  | XNativeRenderableFactor
  | XRenderableFactor
  | XFunction<CustomPropsType, StateType>
  | XElement<CustomPropsType, StateType>;

export type XCallee<
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
> = {
  args?: XElementConfig<CustomPropsType, StateType>;
  el?: XNativeRenderableFactor;
  x?: XElement;
  oldValue?: any;
  nextValue?: any;
  state: StateType;
};

const assignElement = (x: XElement, el: XNativeRenderableFactor) => {
  if (!isHTMLElement(el)) return el;
  if (x.el) {
    x.el.replaceWith(el);
  }


  x.el = el;


  setAttributes(x, { state: x.state, x, el }, x.el);

  return x.el;
}

const addChild = (xel: XElement, child: XElement) => {
  child.getParent = () => xel;
  
  const existing = xel.children.find(
    (child) => isXElement(child) && child.uid === child.uid
  );
  if (existing) {
    assignElement(existing as XElement, child.el);
    const idx = xel.children.indexOf(existing);
    xel.children = xel.children.map((ch, i) => (i === idx ? child : ch));
  } else {
    xel.children = [...xel.children, child];
  }
};

const setAttribute = (
  x: XElement,
  el: Element,
  key: string | Symbol,
  value: any
) => {
  if (!el.setAttribute) return;
  
  key = key.toString();

  if (
    [
      "render",
      "el",
      "magic",
      "state",
      "name",
      "initialState",
      "children",
    ].includes(key)
  )
    return;

  if (key.startsWith("on") && isFunction(value)) {
    el.addEventListener(
      Array.from(key).splice(2).join(""),
      value as EventListener
    );
    return 1;
  }

  if (key.startsWith("inner")) {
    try {
      (el as any)[key] = value;
    } catch (e) {}
    return;
  }

  if (key === "style" && isHTMLElement(el)) {
    const css = cssPropsToString(value);
    el.setAttribute("style", css);
    return;
  }

  if (key === "className" || key === "class") {
    el.className = (Array.isArray(value) ? value.join(" ") : value) + "";
    return;
  }

  const replaceAll = (haystack: string, needle: string, repl: string) => {
    while (true) {
      if (!haystack.includes(needle)) break;
      haystack = haystack.replace(needle, repl);
    }
    return haystack;
  };

  if (key === "stylesheet" && isHTMLElement(el)) {
    const clazz = `.c-${x.uid}`;
    const csskeys = Object.keys(value);
    const specialKeys = csskeys.filter(
      (ck) => ck.startsWith(":") || ck.includes("&")
    );
    const normalKeys = csskeys.filter((ck) => !specialKeys.includes(ck));

    const pseudoObjects = specialKeys
      .map((k): string => {
        if (k.includes("&")) {
          return `${replaceAll(k, "&", clazz)} { ${cssPropsToString(
            value[k]
          )} }`;
        }
        return `.c-${x.uid}${k} { ${cssPropsToString(value[k])} }`;
      })
      .join("\n");

    const normalObject = Object.assign(
      {},
      ...normalKeys.map((k) => ({ [k]: value[k] }))
    );


    const styleID = `style-${x.uid}`;
    let styleEl = x.styleEl || document.getElementById(styleID);

    const exists = !!styleEl;

    styleEl = styleEl || document.createElement('style')
    styleEl.setAttribute('id', styleID);
   
    
    styleEl.innerText = `.c-${x.uid} {${cssPropsToString(normalObject)} }\n` + pseudoObjects;

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
  } catch (e) {
    console.error({ element: el });
    console.warn(e);
  }
};

export const isXElement = (x: any): x is XElement =>
  !!x &&
  Array.isArray(x) === false &&
  typeof x === "object" &&
  !!x.magic &&
  x.magic === "x";
export const isXFunction = (x: any): x is XFunction => isFunction(x);

export const xRender_number = (x: number, callee: XCallee): Text =>
  document.createTextNode(`${x}`);
export const xRender_string = (x: string, callee: XCallee): Text =>
  document.createTextNode(`${x}`);
export const xRender_function = (
  x: XFunction,
  callee: XCallee
): XNativeRenderableFactor => {
  const f = x.bind(callee.x || {});

  const ret = f(callee.args || {}, callee.state, callee);

  if (isXElement(ret) && callee.x) {
    addChild(callee.x, ret);
  }

  return xRender(ret, callee);
};
export const xRender_element = (x: Element, callee: XCallee): Element => x;

const pushClass = (attr: any, cls: string): string[] => {
  if (isString(attr)) return [`${attr} ${cls}`];
  if (isArray(attr)) return [...attr, cls] as string[];
  return [cls];
};


const setAttributes = (x: XElement, callee: XCallee, el?: Element) => {
  el = (el || x.el) as HTMLElement;
  if (!el || !isHTMLElement(el)) return;
  callee = { ...callee, args: { ...(callee.args || {}), ...(x.config || {}) } };
  let attributes = { ...(callee.args || {}) };
  attributes.className = pushClass(attributes.className, `c-${x.uid}`).join(
    " "
  );
  for (const [key, value] of Object.entries(attributes)) {
    setAttribute(x, el, key, value);
  }
}



//class: `c-${x.uid}`
export const xRender_x = (
  x: XElement,
  callee: XCallee
): XNativeRenderableFactor => {
  callee = { ...callee, args: { ...(callee.args || {}), ...(x.config || {}) } };
  const tag = x.config.name || "div";
  const el = isSvgTag(tag)
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);
  let attributes = { ...(callee.args || {}) };
  attributes.className = pushClass(attributes.className, `c-${x.uid}`).join(
    " "
  );
  for (const [key, value] of Object.entries(attributes)) {
    setAttribute(x, el, key, value);
  }
  const children = callee.args?.children || x.config.children || [];

  for (const child of children) {
    const args = isXElement(child) ? child.config || {} : {};
    if (isXElement(child)) {
      addChild(x, child);
    }
    mount(child, { callee: { ...callee, args: args }, target: el });
  }

  return assignElement(x, el);
};

const isVNode = (value: any): boolean => {
  return value ? value.__v_isVNode === true : false;
};

const xRender_ = (
  x: XRenderable,
  callee: XCallee = { state: {} }
): XNativeRenderableFactor => {
  if (isXFunction(x)) return xRender_function(x, callee);
  if (isNumber(x)) return xRender_number(x, callee);
  if (isString(x)) return xRender_string(x, callee);
  if (isHTMLElement(x)) return xRender_element(x, callee);
  if (isXElement(x)) {
    if (x.config.render && isXFunction(x.config.render))
      return xRender(x.config.render, { state: x.state, args: x.config, x });
    return xRender_x(x, callee);
  }
  const y = x as unknown as any;

  if (isVNode(y)) {
    if (y.el) return xRender_element(y.el as HTMLElement, callee);
    if (y.outerHTML) return xRender_string(y.outerHTML as string, callee);
    return xRender("Error", callee);
  }

  return xRender_string(x.toString ? x.toString() : "?", callee); //JSON.stringify(x), callee);
};

export const xRender = (
  x: XRenderable,
  callee: XCallee
): XNativeRenderableFactor => {
  return xRender_(x, callee);
};

export const X = <
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
>(
  tag: string,
  config: XElementInit<CustomPropsType, StateType>
): XElement<CustomPropsType, StateType> => {
  let nextConfig: XElementInit = config;

  if (isXElement(config)) {
    nextConfig = { children: [config] };
  } else if (Array.isArray(config)) {
    nextConfig = { children: config };
  } else if (isXFunction(config)) {
    nextConfig = { render: config };
  }

  const cfg: XElementConfig<CustomPropsType, StateType> = {
    ...nextConfig,
    name: tag,
  };

  const state: xState<StateType> = xReactive<StateType>(
    cfg.initialState || ({} as StateType),
    (target, oldValue, nextValue) => {
      if (!xel.el) return;
      const el = xel.el;
      if (!isHTMLElement(el)) return;
      mount(xel, {
        replace: true,
        target: el,
        callee: {
          state,
          args: cfg,
          el,
          oldValue,
          nextValue
        },
      });
    }
  );

  const genUid = () => {
    const err = new Error();
    const chars = Array.from("abcdefghijklmnopqrstuvwxyz0123456789");
    let h = 0;


    //const auid = (cfg.render ? 'Y' : 'N') + (cfg.children ? cfg.children.length.toString() : '0');

    const cname = cfg.cname || '';
    for (const c of Array.from(JSON.stringify({
      a: cfg.cname,
      b: cfg.name,
      c: (cfg.children || []).length
    }))) {
      let d = toUint32(c.codePointAt(0));
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
      .map((i) => chars[toUint32(i + h * 45 + hashu32(i + h)) % chars.length])
      .join("");
  };

  const xel = xReactive<XElement<CustomPropsType, StateType>>({
    config: cfg,
    magic: "x",
    state: state,
    children: [],
    call: (
      props: XElementInit<CustomPropsType, StateType> & Partial<CustomPropsType>
    ) => {
      return X(tag, typeof props === "object" ? { ...cfg, ...props } : cfg);
    },
    uid: genUid(),
    getParent: () => undefined
  });

  return xel;
};


export type XMountOptions = {
  target?: Element | null | undefined;
  callee?: XCallee;
  replace?: boolean;
};

export const mount = <
  CustomPropsType extends XUserProps = XUserProps,
  StateType extends XAnyObject = XAnyObject
>(
  x: XRenderable<CustomPropsType, StateType>,
  options: XMountOptions
): XNativeRenderableFactor => {
  const callee = {...(options.callee || { state: {} })};
  if (isXElement(x)) {
    callee.x = x;
  }
  
  const target = options.target;

  let el: XRenderableFactor | undefined = undefined;
  el = xRender(x, callee) as HTMLElement;
  


  if (target) {
    if (options.replace) {
      target.replaceWith(el);
    } else {
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

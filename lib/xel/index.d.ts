import { CSSProperties } from "./utils/css";
import { XRef, xState } from "./utils/reactivity/reactive";
type Merged<A, B> = (A | B) | (A & B);
export type XAnyObject = {
    [key: string | symbol]: any;
};
export type XNativeProps = Omit<Partial<HTMLElement>, "children" | "style">;
export type XUserProps<T extends XAnyObject = XAnyObject> = Partial<Merged<T, XNativeProps>> | T | any;
export type XNativeRenderableFactor = Text | Element | HTMLElement | SVGElement | SVGSVGElement;
export type XRenderableFactor = XNativeRenderableFactor | string | number;
export type XFunction<CustomPropsType extends XUserProps = XUserProps, StateType extends XAnyObject = XAnyObject> = (this: XElement<CustomPropsType, StateType>, config: XElementConfig<CustomPropsType, StateType> & CustomPropsType, state: StateType, callee: XCallee<CustomPropsType, StateType>) => XNativeRenderableFactor | XRenderable;
export type XFunctional<CustomPropsType extends XUserProps = XUserProps, StateType extends XAnyObject = XAnyObject> = (config: XElementConfig<CustomPropsType, StateType> & CustomPropsType, state?: StateType, callee?: XCallee<CustomPropsType, StateType>) => XNativeRenderableFactor | XRenderable;
export interface XElementAttributes<CustomPropsType extends XAnyObject = XAnyObject, StateType extends XAnyObject = XAnyObject> {
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
export type XElementConfig<CustomPropsType extends XUserProps = XUserProps, StateType extends XAnyObject = XAnyObject> = XElementAttributes<CustomPropsType, StateType>;
export type XElementInit<CustomPropsType extends XUserProps = XUserProps, StateType extends XAnyObject = XAnyObject> = XElementAttributes<CustomPropsType, StateType> | CustomPropsType;
export type XElementLoaded<CustomPropsType extends XUserProps = XUserProps, StateType extends XAnyObject = XAnyObject> = Omit<XElement<CustomPropsType, StateType>, "el"> & {
    el: XNativeRenderableFactor;
};
export type XElement<CustomPropsType extends XUserProps = XUserProps, StateType extends XAnyObject = XAnyObject> = {
    state: xState<StateType>;
    config: XElementConfig<CustomPropsType, StateType>;
    magic: "x";
    children: XRenderable[];
    el?: XNativeRenderableFactor;
    call: (props: XElementInit<CustomPropsType, StateType> | Partial<CustomPropsType>) => XElement;
    uid: string;
    getParent: (() => XElement | undefined);
};
export declare const isXElementLoaded: (x: XElement | XElementLoaded) => x is XElementLoaded<any, XAnyObject>;
export type XRenderable<CustomPropsType extends XUserProps = XUserProps, StateType extends XAnyObject = XAnyObject> = XNativeRenderableFactor | XRenderableFactor | XFunction<CustomPropsType, StateType> | XElement<CustomPropsType, StateType>;
export type XCallee<CustomPropsType extends XUserProps = XUserProps, StateType extends XAnyObject = XAnyObject> = {
    args?: XElementConfig<CustomPropsType, StateType>;
    el?: XNativeRenderableFactor;
    x?: XElement;
    oldValue?: any;
    nextValue?: any;
    state: StateType;
};
export declare const isXElement: (x: any) => x is XElement<any, XAnyObject>;
export declare const isXFunction: (x: any) => x is XFunction<any, XAnyObject>;
export declare const xRender_number: (x: number, callee: XCallee) => Text;
export declare const xRender_string: (x: string, callee: XCallee) => Text;
export declare const xRender_function: (x: XFunction, callee: XCallee) => XNativeRenderableFactor;
export declare const xRender_element: (x: Element, callee: XCallee) => Element;
export declare const xRender_x: (x: XElement, callee: XCallee) => XNativeRenderableFactor;
export declare const xRender: (x: XRenderable, callee: XCallee) => XNativeRenderableFactor;
export declare const X: <CustomPropsType extends unknown = any, StateType extends XAnyObject = XAnyObject>(tag: string, config: XElementInit<CustomPropsType, StateType>) => XElement<CustomPropsType, StateType>;
export type XMountOptions = {
    target?: Element | null | undefined;
    callee?: XCallee;
    replace?: boolean;
};
export declare const mount: <CustomPropsType extends unknown = any, StateType extends XAnyObject = XAnyObject>(x: XRenderable<CustomPropsType, StateType>, options: XMountOptions) => XNativeRenderableFactor;
export {};

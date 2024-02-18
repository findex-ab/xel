export type xReactiveWatchFunc<T> = (target: T, oldValue: T[keyof T], nextValue: T[keyof T]) => (void | Promise<void>);
export type xState<T extends {
    [key: string | symbol]: any;
} = {
    [key: string | symbol]: any;
}> = T;
export declare const xReactive: <T extends {
    [key: string]: any;
    [key: symbol]: any;
} = {
    [key: string]: any;
    [key: symbol]: any;
}>(obj: T, onChange?: xReactiveWatchFunc<T>, rest?: Partial<ProxyHandler<T>>) => T;
export type XRef<T = any> = xState<{
    value: T;
}>;
export declare const xRef: <T = any>(initial: T, fun?: (value: T) => void) => {
    value: T;
};

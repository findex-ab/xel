export declare const xReactive: <T extends {
    [key: string]: any;
    [key: symbol]: any;
} = {
    [key: string]: any;
    [key: symbol]: any;
}>(obj: T, onChange?: (target: T, oldValue: T[keyof T], nextValue: T[keyof T]) => (void | Promise<void>), rest?: Partial<ProxyHandler<T>>) => T;

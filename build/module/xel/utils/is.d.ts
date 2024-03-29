export declare const isFunction: (v?: any) => v is CallableFunction;
export declare const isArray: <T = any>(x: any) => x is T[];
export declare const isNumber: (x: any) => x is number;
export declare const isString: (x: any) => x is string;
export declare const isBoolean: (x: any) => x is boolean;
export declare const isFactor: (x: any) => x is string | number | boolean | Date;
export declare const isUndefined: (x?: any) => x is undefined;
export declare const isDigit: (c: string) => boolean;
export declare const isNumerical: (c: string) => boolean;
export declare const isFloat: (x: any) => x is number;
export declare const isHTMLElement: (x: any) => x is HTMLElement;
export declare const isHTMLString: (x: any) => x is string;
export declare const isDate: (x: any) => x is Date;
export declare const isSvgTag: (name: string) => name is string;
export declare const isPromise: <T = any>(x: any) => x is Promise<T>;
export declare const isInf: (x: number) => boolean;
export declare const isError: (x: any) => x is Error;
export declare const isNullish: (x: any) => x is null;
export declare const isNotNullish: (x: any) => x is any;

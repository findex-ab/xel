export const isFunction = (v?: any): v is CallableFunction => {
  if (!v) return false;
  return typeof v === 'function';
}

export const isArray = <T = any>(x: any): x is T[] => {
  if (isUndefined(x) || x === null) return false;
  return Array.isArray(x);
}

export const isNumber = (x: any): x is number => typeof x === 'number';
export const isString = (x: any): x is string => typeof x === 'string';
export const isBoolean = (x: any): x is boolean => typeof x === 'boolean';
export const isFactor = (x: any): x is number | string | boolean | Date => isNumber(x) || isString(x) || isBoolean(x) || isDate(x);
export const isUndefined = (x?: any): x is undefined => (typeof x === 'undefined');
export const isDigit = (c: string): boolean => {
  if (isUndefined(c) || c === null) return false;
  const n = c.codePointAt(0) || 0;
  return n >= 48 && n <= 57;
}

export const isNumerical = (c: string): boolean => {
  const digits = Array.from(c).filter(isDigit);
  return digits.length >= c.length;
}

export const isFloat = (x: any): x is number => isNumber(x) && x.toString().includes('.');


export const isHTMLElement = (x: any): x is HTMLElement => {
  if (!x) return false;
  return !!x.appendChild || !!x.addEventListener;
}

export const isHTMLString = (x: any): x is string => {
  if (!x) return false;
  if (!isString(x)) return false;

  return x.includes('<') && x.includes('>');
}


export const isDate = (x: any): x is Date => {
  if (!x) return false;
  if (typeof x !== 'object') return false;
  return !!x.getDay;
}

export const isSvgTag = (name: string): name is string => ['svg', 'path', 'line', 'circle', 'g', 'clipPath', 'mask', 'view'].includes(name);


export const isPromise = <T = any>(x: any): x is Promise<T> => {
  if (!x) return false;
  return (!!x.then || !!x.catch);
}

export const isInf = (x: number): boolean => !isFinite(x);

export const isError = (x: any): x is Error => {
  if (!x) return false;
  if (typeof x !== 'object') return false;
  return !!x.stack;
}

export const isNullish = (x: any): x is (undefined | null) => {
  if (isUndefined(x)) return true;
  if (x === null) return true;
  if (isString(x) && x.trim().length <= 0) return true; 
  return false;
}

export const isNotNullish = (x: any): x is Exclude<typeof x, null | undefined> => !isNullish(x)

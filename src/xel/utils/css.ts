import { camelToKebab } from '../utils/camel';

export type CSSProperties = {[key: string]: any};

const formatValue = (key: string, v: CSSProperties[keyof CSSProperties]): string => {
  return key === 'content' ? `"${v}"` : `${v}`;
}

export const cssPropsToString = (style: CSSProperties): string => {
  return Object.entries(style)
    .map(([k, v]) => `${camelToKebab(k)}: ${formatValue(k, v)};`)
    .join('\n')
    .trimEnd()
}

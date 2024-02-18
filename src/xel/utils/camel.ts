export const camelToKebab = (input: string): string => input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

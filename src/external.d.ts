declare module JSX {
  type Element = string;
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  // @ts-ignore
  const React = {};
}

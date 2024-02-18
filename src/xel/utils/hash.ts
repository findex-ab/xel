import { isFloat } from "./is"

export const floatBitsToUint = (f: number): number => {
  const buffer = new ArrayBuffer(4)
  const view = new DataView(buffer)
  view.setFloat32(0, f)
  return view.getUint32(0)
}

export const toUint32 = (f: number): number => {
  const buffer = new ArrayBuffer(4)
  const view = new DataView(buffer)
  view.setUint32(0, isFloat(f) ? floatBitsToUint(f) : f)
  return view.getUint32(0)
}

export const hashu32 = (i: number) => {
  i = toUint32(i)
  let s = ((i >> 3) * 12); let k = ~i + ~s;
  i ^= i << 17; i ^= i >> 13; i ^= i << 5;
  i += (i ^ k) + i * k; i *= 1013; i ^= (i >> 4);
  return toUint32(i * k + i + i * k + k);
}

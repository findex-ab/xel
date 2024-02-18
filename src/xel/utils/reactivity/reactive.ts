export type xReactiveWatchFunc<T> = (
    target: T,
    oldValue: T[keyof T],
    nextValue: T[keyof T]) => (void | Promise<void>);

export type xState<T extends {[key: string | symbol]: any} = {[key: string | symbol]: any}> = T

export const xReactive = <T extends {[key: string | symbol]: any} = {[key: string | symbol]: any}>(
  obj: T,
  onChange?: xReactiveWatchFunc<T>,
  rest?: Partial<ProxyHandler<T>>
):xState<T> => {

  type TE = xState<T>;
  
  return new Proxy<TE>(obj as TE, {
    get(target, p, receiver) {
      return target[p as keyof TE] as T[keyof T];
    },
    set(target, p, newValue, receiver) {
      const old = target[p as keyof T] as T[keyof T];
      const changed = JSON.stringify(old) !== JSON.stringify(newValue);
      target[p as keyof TE] = (newValue as T[keyof T]);

      if (changed && onChange) {
        const f = async () => {
          await onChange(target, old, newValue);
        }
        f().catch(e => console.error(e));
      }
      return true;
    },
    ...(rest || {})
  });
} 

export type XRef<T = any> = xState<{ value: T }>
export const xRef = <T = any>(initial: T, fun?: ((value: T) => void)): XRef<T> => xReactive({ value: initial }, (target) => {
  if (fun) {
    fun(target.value);
  }
});

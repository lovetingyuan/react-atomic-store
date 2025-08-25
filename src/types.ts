export type GetSetKey<K, O extends 'get' | 'set'> = K extends `${infer L}${infer R}`
  ? `${O}${Uppercase<L>}${R}`
  : never
/**
 * type of getters object according the store value.
 */
export type AtomicStoreGettersType<
  T extends Record<string, unknown>,
  K extends keyof T = keyof T
> = {
  [k in K as GetSetKey<k, 'get'>]: () => T[k]
}

/**
 * type of setters object according the store value.
 */
export type AtomicStoreSettersType<
  T extends Record<string, unknown>,
  K extends keyof T = keyof T
> = {
  [k in K as GetSetKey<k, 'set'>]: (
    newValue: T[k] extends (...v: infer A) => infer R
      ? (o: (...v: A) => R) => (...v: A) => R
      : T[k] | ((v: T[k]) => T[k])
  ) => void
}

/**
 * type of getter and setters of store
 */
export type AtomicStoreMethodsType<
  T extends Record<string, unknown>,
  K extends keyof T = keyof T
> = Omit<AtomicStoreSettersType<T, K> & AtomicStoreGettersType<T, K>, ''>

/**
 * type of atomic store value(return type of `useStore`)
 */
export type AtomicStoreValueType<T extends Record<string, unknown>> = Omit<
  T & AtomicStoreMethodsType<T>,
  ''
>

/**
 * type of subscribeStore callback param
 */
export type SubscribeCallbackType<T extends Record<string, unknown>> = (
  mutation: {
    [K in keyof T]: { key: K; value: T[K]; oldValue: T[K] }
  }[keyof T]
) => void

export interface CreateStoreReturnType<T extends Record<string, unknown>> {
  /**
   * get store state and get/set methods
   */
  useStore: () => AtomicStoreValueType<T>
  /**
   * get current store state
   */
  getStoreState: () => T
  /**
   * get current store get/set methods
   */
  getStoreMethods: () => AtomicStoreMethodsType<T>
  /**
   * get readonly snapshot of current store state
   */
  getStateSnapshot: (warn?: boolean) => Readonly<T>
  /**
   * subscribe store state change
   * @param callback callback when store changes, receive changed key, new value and old value.
   */
  subscribeStore(callback: SubscribeCallbackType<T>): () => void
}

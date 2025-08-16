import { useDebugValue, useSyncExternalStore } from 'react'
import {
  AtomicStoreMethodsType,
  AtomicStoreValueType,
  CreateStoreReturnType,
  SubscribeCallbackType,
} from './types'
import { name as libName } from '../package.json'

const checkParam = (initValue: Record<string, unknown>) => {
  if (Object.prototype.toString.call(initValue) !== '[object Object]') {
    throw new Error(`${libName}: initValue passed to createStore must be an object.`)
  }
  return initValue
}

/**
 * create a global store
 * @param name name of store
 * @param initValue initial object value of store
 */
export function createStore<T extends Record<string, unknown>>(
  initValue: T
): CreateStoreReturnType<T>
export function createStore<T extends Record<string, unknown>>(
  name: string,
  initValue: T
): CreateStoreReturnType<T>
export function createStore<T extends Record<string, unknown>>(name: string | T, initValue?: T) {
  let storeName = ''
  if (typeof name === 'string') {
    storeName = name
    checkParam(initValue!)
    initValue = initValue!
  } else {
    checkParam(name)
    initValue = name
  }
  const keys = Object.keys(initValue) as (keyof T)[]
  const snapshot = { ...initValue }
  const methods: AtomicStoreMethodsType<T> = Object.create(null)
  const store: AtomicStoreValueType<T> = Object.create(methods)
  const subscribers = new Set<SubscribeCallbackType<T>>()
  for (const key of keys) {
    const listeners = new Set<() => void>()
    const getValue = () => snapshot[key]
    const subscribe = (cb: () => void) => {
      listeners.add(cb)
      return () => {
        listeners.delete(cb)
      }
    }
    const Key = `${(key as string)[0].toUpperCase()}${(key as string).slice(1)}`
    // @ts-expect-error good
    methods[`set${Key}`] = (val: T[keyof T]) => {
      const oldValue = snapshot[key]
      const value = typeof val === 'function' ? val(oldValue) : val
      snapshot[key] = value
      for (const cb of listeners) {
        cb()
      }
      for (const sub of subscribers) {
        sub({ key, value, oldValue })
      }
    }
    // @ts-expect-error good
    methods[`get${Key}`] = () => snapshot[key]
    Object.defineProperty(store, key, {
      get: function getStoreValue() {
        const value = useSyncExternalStore(subscribe, getValue)
        useDebugValue(value, val => ({ name: storeName, key, value: val }))
        return value
      },
    })
  }
  return {
    useStore: () => store,
    getStoreMethods: () => methods,
    getStoreState: () => snapshot,
    getSnapshot: (warn = true) => {
      if (warn) {
        console.warn(
          `${name}: The "getSnapshot" method is only used for development to inspect the current store value.`
        )
      }
      return Object.freeze({ ...snapshot })
    },
    subscribeStore(callback: SubscribeCallbackType<T>) {
      subscribers.add(callback)
      return () => {
        subscribers.delete(callback)
      }
    },
  } satisfies CreateStoreReturnType<T>
}

export type { AtomicStoreMethodsType, AtomicStoreValueType, SubscribeCallbackType }

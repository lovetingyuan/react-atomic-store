import { useDebugValue, useSyncExternalStore } from 'react'
import {
  AtomicStoreMethodsType,
  AtomicStoreValueType,
  CreateStoreReturnType,
  SubscribeCallbackType,
} from './types'
import { name as libName } from '../package.json'

// @ts-ignore
const devtools = globalThis.__REACT_ATOMIC_STORE_DEV_TOOLS__

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
export function createStore<T extends Record<string, unknown>>(storeName: string, initValue: T) {
  checkParam(initValue)
  const snapshot =
    typeof structuredClone === 'function' ? structuredClone(initValue) : { ...initValue }
  const keys = Object.keys(snapshot) as (keyof T)[]

  const methods: AtomicStoreMethodsType<T> = Object.create({})
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
    const setStoreValue = (val: T[keyof T]) => {
      const oldValue = snapshot[key]
      const value = typeof val === 'function' ? val(oldValue) : val
      if (!Object.is(oldValue, value)) {
        snapshot[key] = value
        for (const cb of listeners) {
          cb()
        }
        for (const sub of subscribers) {
          sub({ key, value, oldValue })
        }
      }
    }
    // @ts-expect-error good
    methods[`set${Key}`] = setStoreValue
    // @ts-expect-error good
    methods[`get${Key}`] = () => snapshot[key]
    Object.defineProperty(store, key, {
      get: function getStoreValue() {
        const value = useSyncExternalStore(subscribe, getValue)
        useDebugValue(value, val => ({ name: storeName, key, value: val }))
        if (typeof devtools === 'object' && devtools?.enabled) {
          const err = new Error()
          if (err.stack) {
            const stacks = err.stack.split('\n') ?? []
            // console.log(9999, 'stacks', storeName, key, stacks)
            let index = stacks.indexOf('react_stack_bottom_frame')
            if (index === -1) {
              index = stacks.indexOf('react-stack-bottom-frame')
            }
            if (index === -1) {
              index = stacks.indexOf('renderWithHooks')
            }

            if (index > 1) {
              const componentName = stacks[index - 1].trim() //.split(" ")[1];
              devtools.send('trackPropertyUsage', {
                storeName,
                keyName: key,
                component: componentName,
              })
            }
            // componentTraceMap[key] ??= new Set();
            // componentTraceMap[key].add(componentName);
          }
        }
        return value
      },
    })
  }
  const _store = {
    useStore: () => store,
    getStoreMethods: () => methods,
    getStoreState: () => snapshot,
    getStateSnapshot: (warn = true) => {
      if (warn) {
        console.warn(
          `${name}: The "getStateSnapshot" method is only used for development to inspect the current store value.`
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
  if (typeof devtools === 'object' && devtools?.enabled) {
    devtools.send('createStore', {
      storeName,
      initValue,
      stack: new Error().stack,
    })
    devtools.methods[storeName] = methods
    devtools.initialValues[storeName] = initValue
    _store.subscribeStore(changeInfo => {
      devtools.send('changeStore', {
        changeInfo,
        storeName,
      })
    })
  }
  return _store
}

export type { AtomicStoreMethodsType, AtomicStoreValueType, SubscribeCallbackType }

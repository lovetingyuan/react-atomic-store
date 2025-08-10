import { useDebugValue, useSyncExternalStore } from 'react'
import { AtomicContextMethodsType, AtomicContextValueType, ContextOnChangeType } from './types'
import { name } from '../package.json'

export function createStore<T extends Record<string, unknown>>(
  initValue: T,
  options?: {
    name?: string
    onChange?: ContextOnChangeType<T>
  }
) {
  const keys = Object.keys(initValue) as (keyof T)[]
  const snapshot = { ...initValue }
  const methods: AtomicContextMethodsType<T> = Object.create({
    get(warn = true) {
      if (warn) {
        console.warn(
          `${name}: The "get()" method is only used for development to inspect the current store value.`
        )
      }
      return Object.freeze({ ...snapshot })
    },
  })
  const store: AtomicContextValueType<T> = Object.create(methods)
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
      snapshot[key] = val
      options?.onChange?.({ key, oldValue, value: val }, methods)
      for (const cb of listeners) {
        cb()
      }
    }
    // @ts-expect-error good
    methods[`get${Key}`] = () => snapshot[key]
    Object.defineProperty(store, key, {
      get: function getStoreValue() {
        const value = useSyncExternalStore(subscribe, getValue)
        useDebugValue(value, val => {
          const debugInfo: any = { key, value: val }
          if (options?.name) {
            debugInfo.name = options?.name
          }
          return debugInfo
        })
        return value
      },
    })
  }
  return () => store
}

export type { AtomicContextMethodsType, AtomicContextValueType, ContextOnChangeType }

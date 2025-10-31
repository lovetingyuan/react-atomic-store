import { createStore } from 'react-atomic-store'
import type { MenuItemType } from './pages/_components/SideMenu'
import { im } from './utils'
import { MenuName } from './constant'
type StoreValueType = Record<string, unknown>

interface ChangeInfo {
  key: string
  value: unknown
  oldValue: unknown
}

export const { useStore, getStoreMethods, getStateSnapshot } = createStore('appstore', {
  initialValues: {} as Record<string, StoreValueType>,
  currentValues: {} as Record<string, StoreValueType>,
  changeLogs: {} as Record<string, ChangeInfo[]>,
  storeMeta: {} as Record<
    string,
    {
      source: string
      activeMenu: string
    }
  >,
  trackUsage: {} as Record<string, Record<string, string[]>>,
  activeStoreName: '',
})

export function useStoreMeta() {
  const { activeStoreName, storeMeta } = useStore()
  return storeMeta[activeStoreName]
}

export function useMenus() {
  const { activeStoreName, initialValues } = useStore()
  const value = initialValues[activeStoreName]
  const menus: Record<string, MenuItemType> = {
    initValue: {
      title: 'Initial Value',
      name: MenuName.initStoreValue,
    },
    currentValue: {
      title: 'Current Value',
      name: MenuName.currentStoreValue,
    },
    changeHistory: {
      title: 'Change History',
      name: MenuName.changeLogs,
    },
    properties: {
      name: MenuName.properties,
      title: 'Properties',
      open: true,
      children: [],
    },
  }
  if (value) {
    menus.properties.children = Object.keys(value).map(k => {
      return {
        name: MenuName.properties + '.' + k,
        title: k,
      }
    })
  }
  return menus
}

export function setActiveMenuAction(menuName: string) {
  const { getActiveStoreName, setStoreMeta } = getStoreMethods()
  setStoreMeta(
    im(val => {
      const storeName = getActiveStoreName()
      val[storeName].activeMenu = menuName
    })
  )
}

if (import.meta.env.DEV) {
  Object.defineProperty(window, '_store', {
    get() {
      return getStateSnapshot(false)
    },
  })
}

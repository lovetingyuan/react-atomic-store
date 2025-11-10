import { MenuName } from '../../constant'
import { setActiveMenuAction, useMenus, useStoreMeta } from '../../store'

export interface MenuItemType {
  title: string
  name: string // (typeof MenuName)[keyof typeof MenuName];
  children?: MenuItemType[]
  open?: boolean
}

function MenuItem(props: { item: MenuItemType }) {
  const { activeMenu } = useStoreMeta()

  if (props.item.children?.length) {
    return (
      <li>
        <details open={!!props.item.open}>
          <summary>{props.item.title}</summary>
          <ul>
            {props.item.children.map(child => {
              return <MenuItem item={child} key={child.name} />
            })}
          </ul>
        </details>
      </li>
    )
  }
  return (
    <li>
      <a
        data-menu={props.item.name}
        className={activeMenu === props.item.name ? 'menu-active' : ''}
        onClick={() => {
          setActiveMenuAction(props.item.name)
        }}
      >
        {props.item.name.startsWith(MenuName.properties + '.') ? (
          <code>{props.item.title}</code>
        ) : (
          props.item.title
        )}
      </a>
    </li>
  )
}

export default function SideMenu() {
  const menus = Object.values(useMenus())
  return (
    <ul className="menu bg-base-200 rounded-box w-48 gap-1">
      {menus.map(item => {
        return <MenuItem item={item} key={item.name} />
      })}
    </ul>
  )
}

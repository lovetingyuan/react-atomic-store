import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { Outlet } from "react-router";

export default function Home() {
  return (
    <div className="flex flex-col h-dvh">
      <div className="navbar bg-base-300 shadow-sm p-4 h-12 min-h-12">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2">
            <Icon
              icon="eos-icons:atom-electron"
              className="text-[rgb(8,126,164)]"
              width={24}
              height={24}
            ></Icon>
            <span>react-atomic-store devtool</span>
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/about">about</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 bg-base-100 overflow-hidden flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}

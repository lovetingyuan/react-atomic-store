import { Link } from 'react-router'

export default function NavBar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          home
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/main" className="link link-hover">
              main page
            </Link>
          </li>
          <li>
            <Link to="/main/foo" className="link link-hover">
              foo page
            </Link>
          </li>
          <li>
            <Link to="/main/foo/bar" className="link link-hover">
              bar page
            </Link>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="bg-base-100 rounded-t-none p-2">
                <li>
                  <Link to="/about" className="link link-hover">
                    about
                  </Link>
                </li>
                <li>
                  <Link to="/main/api-test/12345" className="link link-hover">
                    api test
                  </Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}

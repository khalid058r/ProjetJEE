import { NavLink } from "react-router-dom";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const links = [
  { name: "Dashboard", to: "/dashboard", icon: HomeIcon },
  { name: "Products", to: "/products", icon: CubeIcon },
  { name: "Categories", to: "/categories", icon: TagIcon },
  { name: "Users", to: "/users", icon: UsersIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-xl border-r border-gray-200">
      <div className="px-6 py-6 text-2xl font-bold tracking-tight">
        SalleManager
      </div>

      <nav className="mt-4 space-y-2 px-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition 
              hover:bg-gray-100 ${isActive ? "bg-gray-100 font-semibold" : ""}`
            }
          >
            <link.icon className="h-5 w-5 text-gray-600" />
            {link.name}
          </NavLink>
        ))}
        <NavLink
            to="/sales"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <BuildingOfficeIcon className="h-5 w-5" />
            <span>Sales</span>
          </NavLink>
      </nav>
    </aside>
  );
}

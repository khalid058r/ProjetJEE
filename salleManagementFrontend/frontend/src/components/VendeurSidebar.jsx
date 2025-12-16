import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  BuildingOfficeIcon,
  ChartBarSquareIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const mainLinks = [
  { name: "Dashboard", to: "/vendeur/dashboard", icon: HomeIcon },
  { name: "Products", to: "/vendeur/products", icon: CubeIcon },
  { name: "Categories", to: "/vendeur/categories", icon: TagIcon },
  { name: "Sales", to: "/vendeur/sales", icon: BuildingOfficeIcon },
  { name: "Invoices", to: "/vendeur/invoices", icon: DocumentTextIcon },
];

const analyticsLinks = [
  { name: "Overview", to: "/vendeur/analytics", icon: ChartBarSquareIcon },
  { name: "Products Analytics", to: "/vendeur/analytics/products", icon: PresentationChartLineIcon },
  { name: "Categories Analytics", to: "/vendeur/analytics/categories", icon: ChartPieIcon },
  { name: "Sales Analytics", to: "/vendeur/analytics/sales", icon: ArrowTrendingUpIcon },
];

export default function VendeurSidebar() {
  return (
    <aside className="w-64 bg-white shadow-xl border-r border-gray-200 min-h-screen flex flex-col">
      
      {/* LOGO */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight">Vendeur Space</h1>
      </div>

      <nav className="flex-1 px-4 space-y-8">

        {/* MAIN LINKS */}
        <div className="space-y-1">
          {mainLinks.map(({ name, to, icon: IconComponent }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all 
                text-sm font-medium
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "text-gray-700 hover:bg-gray-100"
                }
                `
              }
            >
              <IconComponent className="h-5 w-5 text-gray-500" />
              {name}
            </NavLink>
          ))}
        </div>

        {/* ANALYTICS SECTION */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">
            Analytics
          </p>

          <div className="space-y-1">
            {analyticsLinks.map(({ name, to, icon: IconComponent }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                  transition-all
                  ${
                    isActive
                      ? "bg-purple-50 text-purple-700 border border-purple-100"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                  `
                }
              >
                <IconComponent className="h-5 w-5 text-gray-500" />
                {name}
              </NavLink>
            ))}
          </div>
        </div>

      </nav>
    </aside>
  );
}

import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface SidebarLayoutProps {
  children: ReactNode;
}

// Default layout: left sidebar nav + main content. Best for multi-section
// apps with several pages. Edit the NavLink list below to match the routes
// you wire up in App.tsx.
export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex h-full min-h-0">
      <aside className="w-52 shrink-0 border-r border-stone-200 bg-white">
        <div className="px-4 py-4 text-sm font-medium text-stone-700">
          Dashboard
        </div>
        <nav className="flex flex-col gap-1 px-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded px-2.5 py-1.5 text-xs ${
                isActive
                  ? "bg-stone-100 text-stone-900"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`
            }
          >
            Overview
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto px-6 py-5">{children}</main>
    </div>
  );
}

import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface TopNavLayoutProps {
  children: ReactNode;
}

// Top navbar with horizontal nav links + full-width content below. Best for
// marketing-style reports, single-purpose dashboards, or anything where the
// content wants to span the full viewport width. Edit the NavLink list to
// match the routes wired in App.tsx.
export default function TopNavLayout({ children }: TopNavLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6 py-3">
        <div className="text-sm font-medium text-stone-700">Dashboard</div>
        <nav className="flex items-center gap-1">
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
      </header>
      <main className="flex-1 min-w-0 overflow-auto px-6 py-5">{children}</main>
    </div>
  );
}

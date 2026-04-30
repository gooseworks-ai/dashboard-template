import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface TopNavTabsLayoutProps {
  children: ReactNode;
}

// Top header bar + tabbed sub-nav (Stripe Dashboard / settings-page style).
// Best for sectioned dashboards where each tab is a distinct view of the
// same workspace. Edit the tab list to match routes wired in App.tsx.
export default function TopNavTabsLayout({ children }: TopNavTabsLayoutProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center border-b border-stone-200 bg-white px-6 py-3">
        <div className="text-sm font-medium text-stone-700">Dashboard</div>
      </header>
      <nav className="flex shrink-0 items-center gap-4 border-b border-stone-200 bg-white px-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `border-b-2 px-1 py-2.5 text-xs ${
              isActive
                ? "border-stone-700 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`
          }
        >
          Overview
        </NavLink>
      </nav>
      <main className="flex-1 min-w-0 overflow-auto px-6 py-5">{children}</main>
    </div>
  );
}

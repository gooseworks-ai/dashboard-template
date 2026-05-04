import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

const NAV = [
  { to: "/",              label: "Overview",        end: true  },
  { to: "/change-feed",   label: "Change Feed",     end: false },
  { to: "/weekly-briefs", label: "Weekly Briefs",   end: false },
  // Conditional — remove entries whose tracking_area is disabled in config.md
  { to: "/hiring",        label: "Hiring Tracker",  end: false },
  { to: "/ads",           label: "Ad Gallery",      end: false },
  { to: "/pricing",       label: "Pricing History", end: false },
];

export default function SidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0">
      <aside className="w-60 shrink-0 border-r border-stone-100 bg-stone-50">
        <div className="px-3 py-4 text-xs font-medium uppercase tracking-wide text-stone-400">
          Competitor Intel
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-9 items-center rounded-lg px-3 text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-stone-100 text-stone-900 font-medium"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto px-6 py-6">{children}</main>
    </div>
  );
}

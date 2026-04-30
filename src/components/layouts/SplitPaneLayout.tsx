import type { ReactNode } from "react";

interface SplitPaneLayoutProps {
  list: ReactNode;
  detail: ReactNode;
}

// Two-pane layout: scrollable list on the left, scrollable detail on the
// right. Best for inbox/CRM/chat-style apps where the user picks an item
// from the list and reads it on the right. Pass `list` and `detail` as
// separate ReactNodes from App.tsx — typically the list pane is route-
// agnostic and the detail pane swaps via <Routes>.
export default function SplitPaneLayout({ list, detail }: SplitPaneLayoutProps) {
  return (
    <div className="flex h-full min-h-0">
      <aside className="w-72 shrink-0 overflow-auto border-r border-stone-200 bg-white">
        {list}
      </aside>
      <main className="flex-1 min-w-0 overflow-auto bg-stone-50/40 px-6 py-5">
        {detail}
      </main>
    </div>
  );
}

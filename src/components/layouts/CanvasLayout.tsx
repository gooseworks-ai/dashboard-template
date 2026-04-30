import type { ReactNode } from "react";

interface CanvasLayoutProps {
  children: ReactNode;
}

// Full-bleed canvas with no chrome — no nav, no header, just centered
// content with a max width. Best for one-page reports, embeds, or
// public-facing single screens where chrome would only add noise.
export default function CanvasLayout({ children }: CanvasLayoutProps) {
  return (
    <div className="h-full min-h-0 overflow-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}

import type { ReactNode } from "react";

interface CenteredLayoutProps {
  children: ReactNode;
}

// One focused box in the middle of the screen. Best for login screens,
// onboarding forms, or single-action surfaces where you want the user's
// attention on one thing. Drops a hairline-bordered card around children.
export default function CenteredLayout({ children }: CenteredLayoutProps) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-lg border border-stone-200 bg-white px-6 py-6">
        {children}
      </div>
    </div>
  );
}

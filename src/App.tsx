import { Routes, Route, Navigate } from "react-router-dom";
// Pick the layout that fits what you're building. See src/components/layouts/
// for the other shells (TopNavLayout, TopNavTabsLayout, SplitPaneLayout,
// CanvasLayout, CenteredLayout). Default = SidebarLayout.
import SidebarLayout from "./components/layouts/SidebarLayout";
// Two-way URL sync with the Gooseworks parent page (App tab + /embed/...).
// Renders nothing — keep it mounted so navigation propagates both ways.
import ParentNavBridge from "./components/ParentNavBridge";
import Overview from "./pages/Overview";

export default function App() {
  return (
    <>
      <ParentNavBridge />
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SidebarLayout>
    </>
  );
}

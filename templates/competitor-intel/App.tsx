import { Routes, Route, Navigate } from "react-router-dom";
import ParentNavBridge from "./components/ParentNavBridge";
import SidebarLayout from "./components/layouts/SidebarLayout";
import CompetitorOverview from "./pages/CompetitorOverview";
import ChangeFeed from "./pages/ChangeFeed";
import WeeklyBriefs from "./pages/WeeklyBriefs";
// Conditional pages — remove any whose tracking_area is disabled in config.md
import HiringTracker from "./pages/HiringTracker";
import AdGallery from "./pages/AdGallery";
import PricingHistory from "./pages/PricingHistory";

export default function App() {
  return (
    <>
      <ParentNavBridge />
      <SidebarLayout>
        <Routes>
          <Route path="/"               element={<CompetitorOverview />} />
          <Route path="/change-feed"    element={<ChangeFeed />} />
          <Route path="/weekly-briefs"  element={<WeeklyBriefs />} />
          {/* Remove routes below if the matching tracking_area is off */}
          <Route path="/hiring"         element={<HiringTracker />} />
          <Route path="/ads"            element={<AdGallery />} />
          <Route path="/pricing"        element={<PricingHistory />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </SidebarLayout>
    </>
  );
}

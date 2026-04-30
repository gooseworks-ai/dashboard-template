import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Two-way nav sync between this dashboard (running inside the agent's
// sandbox iframe) and the Gooseworks parent page. The parent embeds us
// cross-origin (Daytona/E2B preview subdomain), so neither side can read
// the other's URL directly — postMessage is the only option.
//
// Protocol: { type: "gw-dashboard-nav", source: "iframe" | "parent", path }
//   source:"iframe" → child telling parent "I navigated to <path>"
//   source:"parent" → parent telling child "please navigate to <path>"
//
// Origin: we send to "*" because the parent origin varies (localhost in dev,
// gooseworks.ai in prod, an embedder's site for public embeds). We gate on
// message.type so foreign messages from other postMessage senders are ignored.
//
// This component renders nothing. Drop it inside <BrowserRouter> in App.tsx
// (or wherever your router lives) and the bridge runs for the app's lifetime.

const NAV_MESSAGE_TYPE = "gw-dashboard-nav";

interface NavMessage {
  type: typeof NAV_MESSAGE_TYPE;
  source: "iframe" | "parent";
  path: string;
}

export default function ParentNavBridge() {
  const location = useLocation();
  const navigate = useNavigate();

  // Remember the path we just received from the parent so we don't echo it
  // back as an "iframe" message — that would bounce indefinitely between the
  // two sides on every navigation.
  const lastParentPathRef = useRef<string | null>(null);

  // Inner → outer: tell the parent every time react-router navigates.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.parent === window) return; // not in an iframe; nothing to do
    const path = location.pathname + location.search + location.hash;
    if (lastParentPathRef.current === path) {
      // Just navigated in response to a parent message — don't echo back.
      lastParentPathRef.current = null;
      return;
    }
    const message: NavMessage = {
      type: NAV_MESSAGE_TYPE,
      source: "iframe",
      path,
    };
    window.parent.postMessage(message, "*");
  }, [location.pathname, location.search, location.hash]);

  // Outer → inner: navigate when the parent asks us to.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event: MessageEvent) => {
      const data = event.data as NavMessage | undefined;
      if (!data || data.type !== NAV_MESSAGE_TYPE) return;
      if (data.source !== "parent") return;
      if (typeof data.path !== "string" || !data.path) return;
      const current = location.pathname + location.search + location.hash;
      if (current === data.path) return;
      lastParentPathRef.current = data.path;
      navigate(data.path, { replace: true });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [navigate, location.pathname, location.search, location.hash]);

  return null;
}

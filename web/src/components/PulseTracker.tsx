"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logPulse } from "@/app/actions/pulse";

export default function PulseTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTracked = useRef<string | null>(null);

  useEffect(() => {
    // Generate or get a session ID from local storage
    let sessionID = localStorage.getItem("dolakha_session_id");
    if (!sessionID) {
      sessionID = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("dolakha_session_id", sessionID);
    }

    const track = async () => {
      // Don't track on localhost to keep production data clean
      if (window.location.hostname === "localhost") return;

      // Don't track admin pages to keep logs clean
      if (pathname.startsWith("/admin")) return;

      const currentTrackKey = `${pathname}-${searchParams.toString()}`;
      if (hasTracked.current === currentTrackKey) return;
      hasTracked.current = currentTrackKey;

      let eventType = "page_view";
      let eventData: any = {};

      // Detect Search Intent
      if (pathname === "/search" || searchParams.has("q") || searchParams.has("query")) {
        eventType = "search";
        eventData.query = searchParams.get("q") || searchParams.get("query") || "unknown";
      }

      // Detect Product View (Path pattern)
      if (pathname.startsWith("/product/")) {
        eventType = "product_view";
        eventData.slug = pathname.split("/").pop();
      }

      // Detect Cart/Checkout Intent
      if (pathname === "/checkout" || pathname === "/cart") {
        eventType = "intent_to_buy";
      }

      await logPulse({
        path: pathname,
        sessionID,
        eventType,
        eventData,
        referrer: document.referrer || "direct",
        location: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    };

    track();
  }, [pathname, searchParams]);

  return null; 
}

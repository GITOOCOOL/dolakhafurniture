"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logPulse } from "@/app/actions/pulse";

export default function PulseTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTracked = useRef<string | null>(null);
  const startTime = useRef<number>(Date.now());
  const maxScroll = useRef<number>(0);

  useEffect(() => {
    // 1. Session & Returning Detection
    let sessionID = localStorage.getItem("dolakha_session_id");
    const isReturning = !!localStorage.getItem("dolakha_has_visited");
    
    if (!sessionID) {
      sessionID = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("dolakha_session_id", sessionID);
    }
    localStorage.setItem("dolakha_has_visited", "true");

    // 2. Scroll Depth Tracking
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const percentage = Math.round((scrolled / total) * 100);
      if (percentage > maxScroll.current) maxScroll.current = percentage;
    };
    window.addEventListener("scroll", handleScroll);

    // 3. Track Initial Landing
    const trackLanding = async () => {
      // SECURITY: Block localhost from polluting production data
      if (window.location.hostname === "localhost") return;
      if (pathname.startsWith("/admin")) return;

      const currentTrackKey = `${pathname}-${searchParams.toString()}`;
      if (hasTracked.current === currentTrackKey) return;
      hasTracked.current = currentTrackKey;

      let eventType = "page_view";
      let eventData: any = { isReturning };

      if (pathname === "/search" || searchParams.has("q")) {
        eventType = "search";
        eventData.query = searchParams.get("q") || "unknown";
      } else if (pathname.startsWith("/product/")) {
        eventType = "product_view";
        eventData.slug = pathname.split("/").pop();
      } else if (pathname === "/checkout" || pathname === "/cart") {
        eventType = "intent_to_buy";
      }

      await logPulse({
        path: pathname,
        sessionID: sessionID!,
        eventType,
        eventData,
        referrer: document.referrer || "direct",
        location: Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "unknown",
      });
    };

    // 4. Track Exit / Engagement (Time & Scroll)
    const trackExit = async () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      
      // Log exit if they spent > 2 seconds
      if (duration < 2) return;
      
      // SECURITY: Block localhost from polluting production data
      if (window.location.hostname === "localhost") return;

      await logPulse({
        path: pathname,
        sessionID: sessionID!,
        eventType: "engagement_ping",
        duration,
        scrollDepth: maxScroll.current,
        eventData: { isReturning },
        referrer: "session_internal"
      });
    };

    trackLanding();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      trackExit();
    };
  }, [pathname, searchParams]);

  return null; 
}

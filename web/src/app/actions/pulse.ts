"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function logPulse(data: {
  path: string;
  sessionID: string;
  eventType?: string;
  eventData?: any;
  referrer?: string;
  location?: string;
  duration?: number;
  scrollDepth?: number;
}) {
  try {
    const supabase = await createClient();
    const headerList = await headers();
    
    // Cloudflare & Vercel headers for geolocation
    const city = headerList.get("cf-ipcity") || headerList.get("x-vercel-ip-city") || "Unknown City";
    const isp = headerList.get("cf-ipisp") || "Unknown ISP";
    const userAgent = headerList.get("user-agent") || "unknown";

    const isReturning = data.eventData?.isReturning || false;

    const { error } = await supabase
      .from("traffic_pulse")
      .insert({
        path: data.path,
        session_id: data.sessionID,
        event_type: data.eventType || "page_view",
        event_data: data.eventData || {},
        referrer: data.referrer || "direct",
        location_hint: data.location || "unknown",
        user_agent: userAgent,
        city: city,
        isp: isp,
        duration_seconds: data.duration || 0,
        scroll_depth: data.scrollDepth || 0,
        is_returning: isReturning
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Supabase Omniscient Pulse failed:", error);
    return { success: false };
  }
}

import React from "react";
import { createClient } from "@/utils/supabase/server";
import AdminPulseClient from "@/components/admin/AdminPulseClient";

export const dynamic = "force-dynamic";

export default async function AdminPulsePage() {
  const supabase = await createClient();
  
  const { data: pulses, error } = await supabase
    .from("traffic_pulse")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Pulse fetch error:", error);
  }

  // Map Supabase field names to what the Client expects (or update client)
  const mappedPulses = (pulses || []).map((p: any) => ({
    _id: p.id,
    timestamp: p.created_at,
    path: p.path,
    sessionID: p.session_id,
    referrer: p.referrer,
    location: p.location_hint,
    eventType: p.event_type,
    eventData: p.event_data,
  }));

  return <AdminPulseClient initialPulses={mappedPulses} />;
}

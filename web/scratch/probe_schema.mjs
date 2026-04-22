import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Manually parse .env.local since dotenv might not be global
const env = fs.readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL="(.*?)"/)[1];
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY="(.*?)"/)[1];

const supabase = createClient(url, key);

async function probe() {
  const { data, error } = await supabase.from("profiles").select("*").limit(1);
  if (error) {
    console.error("Schema Probe Error:", error);
  } else {
    console.log("Profile Schema Keys:", Object.keys(data[0] || {}));
    console.log("Full Sample Data:", data[0]);
  }
}
probe();

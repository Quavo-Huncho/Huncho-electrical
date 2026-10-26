// lib/getSettings.js
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function getSettings() {
  noStore();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .single();

  if (error) {
    console.error("getSettings failed:", error.message);
    return null;
  }

  return data;
}
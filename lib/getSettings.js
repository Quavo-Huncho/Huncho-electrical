import { createClient } from "@/lib/supabase-server";

export async function getSettings() {
  const supabase = await createClient();

  const response = await supabase
    .from("settings")
    .select("*")
    .single();

  console.log("SETTINGS RESPONSE:", response);

  return response.data;
}
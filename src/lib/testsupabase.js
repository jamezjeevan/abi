import { supabase } from "./supabase";

export async function testSupabase() {
  if (!supabase) {
    console.warn("[Supabase] Client is not initialized. Please verify your environment variables.");
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);

    if (error) {
      console.warn("[Supabase] Query notice:", error.message);
      return null;
    }
    console.log("[Supabase] Connection test successful:", data);
    return data;
  } catch (err) {
    console.warn("[Supabase] Connection test error:", err);
    return null;
  }
}

testSupabase();
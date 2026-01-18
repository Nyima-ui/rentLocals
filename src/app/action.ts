"use server"
import { createClient } from "@/lib/supabase/server";

export async function getListingsForHome() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*, prices (price_day)");
  if (error) throw error;
  return data;
}

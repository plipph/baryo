import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function isFavorite(businessId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAuthenticated: false, isFavorite: false };
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("profile_id", user.id)
    .eq("business_id", businessId)
    .maybeSingle();

  if (error) {
    console.error("Unable to load favorite", error);
  }

  return { isAuthenticated: true, isFavorite: !!data };
}

import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getProfileFavoriteIds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAuthenticated: false, businessIds: [] as string[] };
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("business_id")
    .eq("profile_id", user.id);

  if (error) {
    console.error("Unable to load favorites", error);
    return { isAuthenticated: true, businessIds: [] as string[] };
  }

  return {
    isAuthenticated: true,
    businessIds: (data ?? []).map((favorite) => favorite.business_id),
  };
}

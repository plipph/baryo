import "server-only";

import { createClient } from "@/lib/supabase/server";

export type FavoriteBusiness = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  industry: string | null;
  city: string | null;
  province: string | null;
  opening_hours: string | null;
  logo_url: string | null;
  cover_url: string | null;
};

export async function getProfileFavorites(): Promise<FavoriteBusiness[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(
      "created_at, businesses (id, slug, name, description, industry, city, province, opening_hours, logo_url, cover_url)"
    )
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load profile favorites", error);
    return [];
  }

  return (data ?? []).flatMap((favorite) => {
    const business = favorite.businesses;
    return business && !Array.isArray(business) ? [business as FavoriteBusiness] : [];
  });
}

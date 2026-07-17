import "server-only";

import { createClient } from "@/lib/supabase/server";

import { BusinessReview } from "./get-business-reviews";

export async function getProfileReview(businessId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAuthenticated: false, review: null as BusinessReview | null };
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, profile_id, business_id, rating, review, created_at, updated_at")
    .eq("profile_id", user.id)
    .eq("business_id", businessId)
    .maybeSingle();

  if (error) {
    console.error("Unable to load profile review", error);
  }

  return { isAuthenticated: true, review: data ?? null };
}

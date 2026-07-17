import "server-only";

import { createClient } from "@/lib/supabase/server";

export type BusinessReview = {
  id: string;
  profile_id: string;
  business_id: string;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
};

export async function getBusinessReviews(businessId: string): Promise<BusinessReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, profile_id, business_id, rating, review, created_at, updated_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load business reviews", error);
    return [];
  }

  return data ?? [];
}

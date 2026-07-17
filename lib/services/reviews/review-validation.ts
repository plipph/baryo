import "server-only";

import { createClient } from "@/lib/supabase/server";

export type ReviewInput = {
  rating: number;
  review: string;
};

export function validateReviewInput(input: ReviewInput) {
  const review = input.review.trim();

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return { error: "Choose a rating from 1 to 5 stars." };
  }

  if (!review) {
    return { error: "Write a review before submitting." };
  }

  return { error: null, review };
}

export async function getReviewerContext(businessId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in to write a review." };
  }

  const { data: business, error } = await supabase
    .from("businesses")
    .select("id, owner_id")
    .eq("id", businessId)
    .maybeSingle();

  if (error || !business) {
    return { error: "This business is no longer available." };
  }

  if (business.owner_id === user.id) {
    return { error: "Business owners cannot review their own business." };
  }

  return { error: null, supabase, user };
}

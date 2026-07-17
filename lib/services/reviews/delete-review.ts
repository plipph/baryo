"use server";

import { getReviewerContext } from "./review-validation";

export async function deleteReview(reviewId: string, businessId: string) {
  const context = await getReviewerContext(businessId);

  if (context.error || !context.supabase || !context.user) {
    return { error: context.error ?? "Unable to validate this review." };
  }

  const { data, error } = await context.supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("profile_id", context.user.id)
    .eq("business_id", businessId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "This review is no longer available to delete." };
  }

  return { error: null };
}

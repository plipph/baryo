"use server";

import { getReviewerContext, ReviewInput, validateReviewInput } from "./review-validation";

export async function updateReview(
  reviewId: string,
  businessId: string,
  input: ReviewInput
) {
  const validation = validateReviewInput(input);

  if (validation.error) {
    return validation;
  }

  const context = await getReviewerContext(businessId);

  if (context.error || !context.supabase || !context.user) {
    return { error: context.error ?? "Unable to validate this review." };
  }

  const { data, error } = await context.supabase
    .from("reviews")
    .update({ rating: input.rating, review: validation.review })
    .eq("id", reviewId)
    .eq("profile_id", context.user.id)
    .eq("business_id", businessId)
    .select("id, profile_id, business_id, rating, review, created_at, updated_at")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "This review is no longer available to edit." };
  }

  return { error: null, review: data };
}

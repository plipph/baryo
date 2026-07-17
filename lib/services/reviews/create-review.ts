"use server";

import { getReviewerContext, ReviewInput, validateReviewInput } from "./review-validation";

export async function createReview(businessId: string, input: ReviewInput) {
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
    .insert({
      profile_id: context.user.id,
      business_id: businessId,
      rating: input.rating,
      review: validation.review,
    })
    .select("id, profile_id, business_id, rating, review, created_at, updated_at")
    .single();

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "You have already reviewed this business."
          : error.message,
    };
  }

  return { error: null, review: data };
}

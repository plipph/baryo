"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createReview } from "@/lib/services/reviews/create-review";
import { deleteReview } from "@/lib/services/reviews/delete-review";
import { BusinessReview } from "@/lib/services/reviews/get-business-reviews";
import { updateReview } from "@/lib/services/reviews/update-review";

type ReviewsSectionProps = {
  businessId: string;
  reviews: BusinessReview[];
  currentReview: BusinessReview | null;
  isAuthenticated: boolean;
};

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" aria-label="Choose a rating">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="rounded-full p-1 text-[#FB923C] transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C]"
          aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
          aria-pressed={value === rating}
        >
          <Star
            className={`h-6 w-6 ${rating <= value ? "fill-current" : ""}`}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({
  businessId,
  review,
  onComplete,
  onCancel,
}: {
  businessId: string;
  review: BusinessReview | null;
  onComplete: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [text, setText] = useState(review?.review ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = review
        ? await updateReview(review.id, businessId, { rating, review: text })
        : await createReview(businessId, { rating, review: text });

      if (result.error) {
        setError(result.error);
        return;
      }

      onComplete();
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 rounded-2xl bg-[#F9FAFB] p-5">
      <label className="text-sm font-bold text-[#111827]">Your rating</label>
      <StarSelector value={rating} onChange={setRating} />

      <label htmlFor="review" className="mt-5 block text-sm font-bold text-[#111827]">
        Your review
      </label>
      <textarea
        id="review"
        value={text}
        onChange={(event) => setText(event.target.value)}
        required
        rows={4}
        placeholder="Share your experience with this business."
        className="mt-2 w-full resize-y rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-green-100"
      />

      {error && (
        <p className="mt-3 text-sm font-medium text-[#DC2626]" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : review ? "Update Review" : "Submit Review"}
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-3 text-sm font-bold text-[#6B7280] transition hover:bg-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export function ReviewsSection({
  businessId,
  reviews,
  currentReview,
  isAuthenticated,
}: ReviewsSectionProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!currentReview) {
      return;
    }

    setError("");
    startTransition(async () => {
      const result = await deleteReview(currentReview.id, businessId);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-[#E5E7EB]/80 bg-white p-6 shadow-[0_18px_50px_-32px_rgba(17,24,39,0.45)] md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#16A34A]">
            Community
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#111827]">
            Reviews
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-[#FFF7ED] px-4 py-3 text-sm font-bold text-[#9A3412]">
          <Star className="h-5 w-5 text-[#FB923C]" />
          Average rating coming soon
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="mt-6 rounded-2xl bg-[#F9FAFB] p-5">
          <h3 className="text-lg font-black text-[#111827]">Share your experience</h3>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            Log in to leave a review for this local business.
          </p>
          <Button type="button" className="mt-4" onClick={() => router.push("/login")}>
            Log in to review
          </Button>
        </div>
      ) : currentReview ? (
        <div className="mt-6 rounded-2xl bg-[#F9FAFB] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black text-[#111827]">Your review</p>
              <div className="mt-2 flex gap-1 text-[#FB923C]" aria-label={`${currentReview.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-4 w-4 ${rating <= currentReview.rating ? "fill-current" : "text-[#D1D5DB]"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
            {!isEditing && (
              <div className="flex gap-3 text-sm font-bold">
                <button type="button" onClick={() => setIsEditing(true)} className="text-[#14532D]">
                  Edit
                </button>
                <button type="button" onClick={handleDelete} disabled={isPending} className="text-[#DC2626] disabled:opacity-60">
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
          {!isEditing && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{currentReview.review}</p>}
          {isEditing && (
            <ReviewForm
              businessId={businessId}
              review={currentReview}
              onComplete={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          )}
          {error && <p className="mt-3 text-sm font-medium text-[#DC2626]" role="alert">{error}</p>}
        </div>
      ) : (
        <ReviewForm businessId={businessId} review={null} onComplete={() => undefined} />
      )}

      <div className="mt-8 border-t border-[#E5E7EB] pt-6">
        <h3 className="text-xl font-black text-[#111827]">From the community</h3>
        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-[#6B7280]">No reviews yet. Be the first to share your experience.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-[#E5E7EB] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-[#111827]">
                    {review.id === currentReview?.id ? "Your review" : "Community member"}
                  </p>
                  <div className="flex gap-1 text-[#FB923C]" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star key={rating} className={`h-4 w-4 ${rating <= review.rating ? "fill-current" : "text-[#D1D5DB]"}`} aria-hidden="true" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{review.review}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

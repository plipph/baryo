"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import { addFavorite } from "@/lib/services/favorites/add-favorite";
import { removeFavorite } from "@/lib/services/favorites/remove-favorite";

type FavoriteButtonProps = {
  businessId: string;
  isAuthenticated: boolean;
  initialIsFavorite: boolean;
  className?: string;
};

export function FavoriteButton({
  businessId,
  isAuthenticated,
  initialIsFavorite,
  className = "",
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();

  function handleFavorite() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const previousValue = isFavorite;
    setIsFavorite(!previousValue);

    startTransition(async () => {
      const result = previousValue
        ? await removeFavorite(businessId)
        : await addFavorite(businessId);

      if (result.error) {
        setIsFavorite(previousValue);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleFavorite}
      disabled={isPending}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Save to favorites"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#14532D] shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <Heart
        className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}

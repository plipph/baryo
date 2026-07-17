import {
  MapPin,
  ExternalLink,
  BadgeCheck,
  Star,
  Tag,
  Clock3,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorites/favorite-button";

type Business = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  industry?: string | null;
  city?: string | null;
  province?: string | null;
  opening_hours?: string | null;

  logo_url?: string | null;
  cover_url?: string | null;

  is_verified?: boolean;
  is_featured?: boolean;
  rating?: number | null;
  is_open?: boolean | null;

  has_offer?: boolean;
};

type Props = {
  business: Business;
  isAuthenticated?: boolean;
  isFavorite?: boolean;
};

export function BusinessCard({
  business,
  isAuthenticated = false,
  isFavorite = false,
}: Props) {
  const rating = business.rating ?? null;
  const status =
    typeof business.is_open === "boolean"
      ? business.is_open
        ? "Open now"
        : "Closed"
      : business.opening_hours
      ? "Hours listed"
      : "Local business";

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-42px_rgba(17,24,39,0.55)]">
      <div className="relative h-56 overflow-hidden bg-[#F3F4F6]">
        {business.cover_url ? (
          <img
            src={business.cover_url}
            alt={business.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#14532D] via-[#16A34A] to-[#FB923C] text-5xl font-black text-white">
            {business.name.charAt(0)}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {business.is_featured && (
            <Badge color="orange">
              <Star className="mr-1 h-3 w-3" />
              Featured
            </Badge>
          )}

          {business.is_verified && (
            <Badge>
              <BadgeCheck className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        <div className="absolute right-4 top-4">
          <FavoriteButton
            businessId={business.id}
            isAuthenticated={isAuthenticated}
            initialIsFavorite={isFavorite}
          />
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt={`${business.name} logo`}
              className="h-16 w-16 rounded-2xl border-4 border-white bg-white object-cover shadow-xl"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-white text-xl font-black text-[#14532D] shadow-xl">
              {business.name.charAt(0)}
            </div>
          )}

          {rating !== null && (
            <div className="flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-black text-[#111827] shadow-lg">
              <Star className="h-4 w-4 fill-[#FB923C] text-[#FB923C]" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-xl font-black tracking-tight text-[#111827] md:text-2xl">
              {business.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#16A34A]">
              {business.industry || "Local Business"}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              status === "Closed"
                ? "bg-red-50 text-[#EF4444]"
                : "bg-green-50 text-[#14532D]"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#6B7280]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#14532D]" />
            {[business.city, business.province].filter(Boolean).join(", ") ||
              "Mindoro"}
          </span>

          {business.opening_hours && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-[#14532D]" />
              {business.opening_hours}
            </span>
          )}
        </div>

        {business.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6B7280]">
            {business.description}
          </p>
        )}

        {business.has_offer && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-orange-50 p-4 text-[#FB923C]">
            <Tag className="h-5 w-5" />
            <span className="font-semibold">
              Active Offer Available
            </span>
          </div>
        )}

        <div className="mt-6">
          <Button href={`/${business.slug}`}>
            View Business
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

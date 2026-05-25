"use client";
import { LinkIcon } from "@/components/link-icon";
import { useState } from "react";

type Item = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

type BusinessLink = {
  id: string;
  business_id: string;
  type: string;
  label: string;
  url: string;
  icon: string | null;
  sort_order: number;
  is_visible: boolean;
  is_primary: boolean;
};

type PublicItemCardProps = {
  item: Item;
  inquireLinks: BusinessLink[];
  fallbackLinks: BusinessLink[];
};

export function PublicItemCard({
  item,
  inquireLinks,
  fallbackLinks,
}: PublicItemCardProps) {
  const [open, setOpen] = useState(false);

  const options = inquireLinks.length > 0 ? inquireLinks : fallbackLinks;

  return (
    <>
      <article className="overflow-hidden rounded-3xl border border-[#E2D4C2] bg-white shadow-sm">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="flex h-44 items-center justify-center bg-[#E9D8C0]">
            <span className="text-sm font-medium text-[#8A6A4F]">
              No image yet
            </span>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <h4 className="text-lg font-bold text-[#3D2A1E]">{item.name}</h4>

            {item.price !== null && (
              <p className="shrink-0 rounded-full bg-[#F1E5D4] px-3 py-1 text-sm font-bold text-[#596B3F]">
                ₱{Number(item.price).toFixed(2)}
              </p>
            )}
          </div>

          {item.description && (
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {item.description}
            </p>
          )}

          {options.length > 0 ? (
            <button
              onClick={() => setOpen(true)}
              className="mt-5 w-full rounded-2xl bg-[#C85A32] px-4 py-3 text-sm font-semibold text-white hover:bg-[#A94727]"
            >
              Inquire
            </button>
          ) : (
            <button
              disabled
              className="mt-5 w-full rounded-2xl bg-stone-300 px-4 py-3 text-sm font-semibold text-stone-600"
            >
              No contact link yet
            </button>
          )}
        </div>
      </article>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 md:items-center md:pb-0">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8A6A4F]">
                  Choose Contact Option
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#3D2A1E]">
                  Inquire about {item.name}
                </h3>
                <p className="mt-2 text-sm text-stone-600">
                  Choose how you want to contact this business.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-stone-600 hover:bg-stone-200"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-2">
              {options.map((link) => (
                <a
  key={link.id}
  href={link.url}
  target="_blank"
  rel="noreferrer"
  className="inline-flex items-center gap-3 rounded-2xl border border-[#E2D4C2] bg-[#FFF8EF] px-4 py-3 font-semibold text-[#5A3825] hover:bg-[#F1E5D4]"
>
  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#C85A32]">
    <LinkIcon type={link.type} className="h-4 w-4" />
  </span>
  <span>{link.label}</span>
</a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
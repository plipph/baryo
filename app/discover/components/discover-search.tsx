"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

export function DiscoverSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();
    router.push(query ? `/discover?search=${encodeURIComponent(query)}` : "/discover");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col gap-3 rounded-[1.5rem] bg-white p-3 shadow-[0_22px_60px_-36px_rgba(17,24,39,0.5)] sm:flex-row"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-[#FAF7F2] px-4 py-3">
        <Search className="h-5 w-5 shrink-0 text-[#16A34A]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search businesses, food, services..."
          className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#6B7280]"
        />
      </div>

      <button
        type="button"
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-4 text-sm font-bold text-[#111827]"
        aria-label="Filter results"
      >
        <SlidersHorizontal className="h-4 w-4" />
      </button>

      <button
        type="submit"
        className="min-h-12 rounded-full bg-[#14532D] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#166534]"
      >
        Search
      </button>
    </form>
  );
}

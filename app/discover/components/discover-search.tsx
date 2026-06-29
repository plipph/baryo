"use client";

import { useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Search } from "lucide-react";

export function DiscoverSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(
    searchParams.get("search") || ""
  );

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value.trim()) {
      params.set(
        "search",
        value.trim()
      );
    } else {
      params.delete("search");
    }

    router.push(
      `/discover?${params.toString()}`
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-[#E7D8C5] bg-white px-5 py-4 shadow-sm">
        <Search className="h-5 w-5 text-stone-500" />

        <input
          type="text"
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          placeholder="Search businesses..."
          className="w-full bg-transparent text-[#3D2A1E] outline-none placeholder:text-stone-400"
        />
      </div>
    </form>
  );
}
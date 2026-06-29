import Link from "next/link";

type BusinessCardProps = {
  business: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    industry: string | null;
    city: string | null;
    province: string | null;
    logo_url: string | null;
    cover_url: string | null;
  };
};

export function BusinessCard({
  business,
}: BusinessCardProps) {
  return (
    <Link
      href={`/${business.slug}`}
      className="group overflow-hidden rounded-[2rem] border border-[#E7D8C5] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Cover */}
      <div className="relative h-52 bg-[#EFE3D3]">
        {business.cover_url ? (
          <img
            src={business.cover_url}
            alt={business.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-black text-[#8A6A4F]">
            {business.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3 flex items-center gap-3">
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt={business.name}
              className="h-14 w-14 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EFE3D3] font-bold">
              {business.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-xl font-black text-[#3D2A1E]">
              {business.name}
            </h2>

            <p className="text-sm text-[#8A6A4F]">
              {business.industry || "Business"}
            </p>
          </div>
        </div>

        <p className="line-clamp-3 text-sm text-stone-600">
          {business.description ||
            "No description available."}
        </p>

        <div className="mt-5 flex items-center justify-between text-sm text-stone-500">
          <span>
            {business.city || "Philippines"}
          </span>

          <span className="font-semibold text-[#596B3F]">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
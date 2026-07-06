import Link from "next/link";

import {
  ChevronRight,
} from "lucide-react";

type CategoryCardProps = {
  icon: React.ReactNode;
  title: string;
  count: number;
  href: string;
};

export function CategoryCard({
  icon,
  title,
  count,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[1.5rem] border border-[#E5E7EB]/80 bg-white p-6 shadow-[0_18px_50px_-34px_rgba(17,24,39,0.45)] transition-all hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_24px_70px_-40px_rgba(20,83,45,0.55)]"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#14532D]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black text-[#111827]">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[#6B7280]">
        {count > 0 ? `${count} businesses` : "Explore local listings"}
      </p>

      <div className="mt-6 flex items-center text-sm font-bold text-[#14532D]">

        Browse

        <ChevronRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />

      </div>

    </Link>
  );
}

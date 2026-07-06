import Link from "next/link";
import { CalendarDays, Megaphone, PlusCircle } from "lucide-react";

export function RightSidebar() {
  return (
    <aside className="sticky top-20 h-[calc(100vh-5rem)] border-l border-[#E5E7EB]/80 bg-[#FAF7F2] p-6">
      <div className="rounded-[1.5rem] bg-white p-6 shadow-[0_18px_50px_-34px_rgba(17,24,39,0.45)]">
        <Megaphone className="h-7 w-7 text-[#FB923C]" />
        <h3 className="mt-4 text-xl font-black text-[#111827]">
          Promote local
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Share offers, services, and business updates with nearby customers.
        </p>
        <Link
          href="/register"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#14532D] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#166534]"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Business
        </Link>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-green-100 bg-green-50 p-6">
        <CalendarDays className="h-7 w-7 text-[#14532D]" />
        <h3 className="mt-4 font-black text-[#111827]">Community pulse</h3>
        <p className="mt-2 text-sm text-[#6B7280]">
          Events, jobs, and offers will live here as the directory grows.
        </p>
      </div>
    </aside>
  );
}

export default RightSidebar;

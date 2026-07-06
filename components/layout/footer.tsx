import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB]/80 bg-[#FAF7F2] px-4 pb-24 pt-10 md:px-6 md:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-stone-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-black text-[#111827]">MyNegosyo Mindoro</p>
          <p className="mt-1">Discover Local. Support Mindoro.</p>
        </div>

        <div className="flex flex-wrap gap-4 font-semibold">
          <Link href="/discover" className="hover:text-[#14532D]">
            Discover
          </Link>
          <Link href="/register" className="hover:text-[#14532D]">
            Register
          </Link>
          <Link href="/login" className="hover:text-[#14532D]">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

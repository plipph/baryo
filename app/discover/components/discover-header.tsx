export function DiscoverHeader() {
  return (
    <header className="border-b border-[#E7D8C5] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8A6A4F]">
            Listahan
          </p>

          <h1 className="mt-1 text-3xl font-black text-[#3D2A1E]">
            Discover
          </h1>
        </div>

        <nav className="hidden gap-8 md:flex">
          <a href="/" className="font-medium text-stone-600 hover:text-[#3D2A1E]">
            Home
          </a>

          <a href="/discover" className="font-medium text-[#596B3F]">
            Discover
          </a>

          <a href="/login" className="font-medium text-stone-600 hover:text-[#3D2A1E]">
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
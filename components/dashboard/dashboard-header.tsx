type DashboardHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function DashboardHeader({
  eyebrow,
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6B7280] md:text-sm">
          {eyebrow}
        </p>
      )}

      <h1 className="mt-2 text-3xl font-black tracking-tight text-[#111827] md:text-4xl">
        {title}
      </h1>

      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}


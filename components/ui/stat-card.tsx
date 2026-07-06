type SectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section className="px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-2 md:mb-9 md:flex-row md:items-end md:justify-between">
          <div>
          <h2 className="text-3xl font-black tracking-tight text-[#111827] md:text-4xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-2 max-w-2xl text-base leading-7 text-[#6B7280]">{subtitle}</p>
          )}
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

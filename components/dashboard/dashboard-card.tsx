import { ReactNode } from "react";

type DashboardCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function DashboardCard({
  title,
  description,
  children,
}: DashboardCardProps) {
  return (
    <section className="rounded-[2rem] border border-[#E5E7EB] bg-white p-5 shadow-sm md:p-6">
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-black tracking-tight text-[#111827]">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}
import { Briefcase, Coffee, Hotel, Scissors, ShoppingBag, Stethoscope } from "lucide-react";
import { CategoryCard } from "./category-card";

const categories = [
  {
    title: "Restaurant / Food",
    href: "/discover?search=Restaurant",
    count: 0,
    icon: Coffee,
  },
  {
    title: "Resort / Hotel",
    href: "/discover?search=Resort",
    count: 0,
    icon: Hotel,
  },
  {
    title: "Salon / Spa",
    href: "/discover?search=Salon",
    count: 0,
    icon: Scissors,
  },
  {
    title: "Retail Shop",
    href: "/discover?search=Retail",
    count: 0,
    icon: ShoppingBag,
  },
  {
    title: "Clinic",
    href: "/discover?search=Clinic",
    count: 0,
    icon: Stethoscope,
  },
  {
    title: "Services",
    href: "/discover?search=Services",
    count: 0,
    icon: Briefcase,
  },
];

export function CategoryGrid() {
  return (
    <section className="px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#16A34A]">
            Categories
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#111827] md:text-4xl">
            Browse by business type
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <CategoryCard
                key={category.title}
                title={category.title}
                href={category.href}
                count={category.count}
                icon={<Icon className="h-7 w-7" />}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

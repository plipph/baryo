import { cn } from "@/lib/utils";

type BadgeProps = {
  color?: "green" | "orange";
  className?: string;
  children: React.ReactNode;
};

export function Badge({ color = "green", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold shadow-sm",
        color === "orange"
          ? "bg-orange-50 text-[#FB923C]"
          : "bg-green-50 text-[#14532D]",
        className
      )}
    >
      {children}
    </span>
  );
}

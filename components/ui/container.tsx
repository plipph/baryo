import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-[#E5E7EB]/80 bg-white shadow-[0_18px_50px_-32px_rgba(17,24,39,0.45)]",
        className
      )}
      {...props}
    />
  );
}

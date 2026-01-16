import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  onClick?: () => void;
  width?: number;
  className?: string;
};

export default function Button({
  label,
  variant = "primary",
  icon,
  className,
  onClick,
}: ButtonProps) {
  const base =
    "px-10 py-[11px] rounded-full font-semibold flex items-center gap-2 transition-all cursor-pointer";

  const variantClass =
    variant === "primary"
      ? "bg-red-800 text-white hover:bg-red-700"
      : "bg-black/40 text-white hover:bg-black/60 border border-white/10";

  return (
    <button
      //className={`${base} ${variantClass} ${className}`}
      className={cn(base, variantClass, className)}
      onClick={onClick}
    >
      {label}
      {icon && icon}
    </button>
  );
}

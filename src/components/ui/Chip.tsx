import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Chip({ children, className, accent = false }: { children: ReactNode; className?: string; accent?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11.5px] leading-5",
        accent ? "border-accent-line bg-accent-dim text-accent" : "border-line bg-surface text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Renders a value; if it is still a [PLACEHOLDER], shows it as a muted dashed marker. */
export function Maybe({ value }: { value: string }) {
  const placeholder = /^\s*\[.*\]\s*$/.test(value);
  if (!placeholder) return <>{value}</>;
  return <span className="rounded border border-dashed border-line-strong px-1.5 py-px font-mono text-[11px] text-subtle">{value}</span>;
}

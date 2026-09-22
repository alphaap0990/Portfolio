import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Section({
  id,
  children,
  className,
  defer = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  /** Skip rendering work until near the viewport (for long, below-the-fold sections). */
  defer?: boolean;
}) {
  return (
    <section id={id} className={cn("section-y", defer && "defer-render", className)} aria-labelledby={`${id}-title`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  className,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-10 max-w-2xl md:mb-14", className)}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{description}</p>}
    </Reveal>
  );
}

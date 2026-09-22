"use client";

import { useId, useState } from "react";
import { experience, type Role } from "@/data/experience";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Chip } from "@/components/ui/Chip";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function ExperienceTimeline() {
  return (
    <Section id="experience">
      <SectionHeader
        id="experience"
        eyebrow="Professional experience"
        title="Where I have applied it"
        description="Expand an area to see what I worked on. Full detail is on the resume."
      />

      <ol className="relative space-y-10">
        <span aria-hidden className="absolute bottom-2 left-[7px] top-2 hidden w-px bg-line md:block" />
        {experience.map((role) => (
          <li key={role.company} className="relative md:pl-10">
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-7 hidden h-[15px] w-[15px] rounded-full border-2 md:block",
                role.current ? "border-accent bg-accent-dim status-dot" : "border-line-strong bg-base",
              )}
            />
            <Reveal>
              <RoleCard role={role} />
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function RoleCard({ role }: { role: Role }) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());
  const allOpen = open.size === role.areas.length;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <article className="card p-5 md:p-7" aria-label={`${role.title} at ${role.company}`}>
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-fg">{role.company}</h3>
          <p className="mt-0.5 text-[15px] text-muted">{role.title}</p>
        </div>
        <div className="text-left text-sm sm:text-right">
          <p className="tabular text-fg">{role.period}</p>
          <p className="mt-0.5 text-subtle">{role.location}</p>
        </div>
      </header>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{role.summary}</p>

      <div className="mt-5 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">{role.areas.length} focus areas</p>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(role.areas.map((_, i) => i)))}
          className="rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-fg"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="mt-2 grid items-start gap-2 md:grid-cols-2">
        {role.areas.map((a, i) => {
          const isOpen = open.has(i);
          const panelId = `${baseId}-${i}`;
          return (
            <div key={a.title} className={cn("rounded-lg border transition-colors", isOpen ? "border-accent-line/60 bg-elev/70" : "border-line bg-surface")}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
              >
                <span className={cn("text-sm font-medium", isOpen ? "text-accent" : "text-fg")}>{a.title}</span>
                <ChevronDownIcon width={15} height={15} className={cn("shrink-0 text-subtle transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
              <div id={panelId} className="expander" data-open={isOpen} inert={!isOpen}>
                <div>
                  <div className="px-3.5 pb-3.5">
                    <p className="text-[13px] leading-relaxed text-muted">{a.detail}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {a.tags.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

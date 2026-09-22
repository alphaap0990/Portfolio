"use client";

import { useState } from "react";
import { skillCategories, type SkillCategory } from "@/data/skills";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        id="skills"
        eyebrow="Technical skills"
        title="Tools, grouped by the job they do"
        description="Hover, focus or tap a skill for a one-line description."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((c, i) => (
          <Reveal key={c.id} delay={(i % 3) * 0.06} className={i === skillCategories.length - 1 ? "md:col-span-2 lg:col-span-1" : ""}>
            <SkillCard category={c} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SkillCard({ category }: { category: SkillCategory }) {
  const [active, setActive] = useState<string | null>(null);
  const note = category.skills.find((s) => s.name === active)?.note;

  return (
    <div className="card flex h-full flex-col p-5" onMouseLeave={() => setActive(null)}>
      <h3 className="text-[15px] font-semibold text-fg">{category.title}</h3>
      <p className="mt-0.5 text-xs text-subtle">{category.blurb}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {category.skills.map((s) => {
          const on = active === s.name;
          return (
            <li key={s.name}>
              <button
                type="button"
                aria-pressed={on}
                onMouseEnter={() => setActive(s.name)}
                onFocus={() => setActive(s.name)}
                onClick={() => setActive(on ? null : s.name)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-[13px] transition-colors",
                  on ? "border-accent-line bg-accent-dim text-accent" : "border-line bg-elev/60 text-fg/90 hover:border-line-strong",
                )}
              >
                {s.name}
              </button>
            </li>
          );
        })}
      </ul>

      {/* fixed-height description slot so the card does not jump on hover */}
      <p aria-live="polite" className="mt-auto min-h-[2.75rem] border-t border-line pt-3 text-xs leading-relaxed text-muted">
        {note ?? <span className="text-subtle">Select a skill…</span>}
      </p>
    </div>
  );
}

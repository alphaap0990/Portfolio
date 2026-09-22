"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { isPlaceholder } from "@/data/site";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/Chip";
import { LinkButton } from "@/components/ui/LinkButton";
import { ChevronDownIcon, GitHubIcon, LockIcon, ArrowUpRightIcon } from "@/components/ui/Icons";
import { InteractiveDiagram } from "@/components/diagrams/ArchitectureDiagram";
import { AgentWorkflow } from "@/components/diagrams/AgentWorkflow";
import { SearchDemo } from "@/components/diagrams/SearchDemo";

const deepDiveSections: { key: keyof Project["deepDive"]; title: string }[] = [
  { key: "architecture", title: "Architecture" },
  { key: "choices", title: "Technology choices" },
  { key: "tradeoffs", title: "Tradeoffs" },
  { key: "implementation", title: "Implementation" },
  { key: "evaluation", title: "Evaluation" },
  { key: "production", title: "Production considerations" },
];

export function ProjectCard({ project: p }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const professional = p.kind === "professional";
  const cols = p.stages.length <= 4 ? p.stages.length : Math.min(6, Math.ceil(p.stages.length / 2));

  return (
    <article id={`project-${p.slug}`} className="card overflow-hidden" aria-labelledby={`${p.slug}-title`}>
      {/* header */}
      <header className="border-b border-line p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-xs text-subtle">{p.index}</span>
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
              professional ? "border-accent-line bg-accent-dim text-accent" : "border-dashed border-line-strong text-muted",
            )}
          >
            {p.context}
          </span>
        </div>
        <h3 id={`${p.slug}-title`} className="mt-3 text-2xl font-semibold tracking-tight text-fg md:text-[1.7rem]">
          {p.title}
        </h3>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted">{p.summary}</p>

        {p.impact.length > 0 && (
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
            {p.impact.map((m) => (
              <div key={m.label} className="flex flex-col">
                <dt className="order-2 text-xs text-muted">{m.label}</dt>
                <dd className="tabular order-1 text-2xl font-semibold tracking-tight text-fg">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {p.highlights && p.highlights.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.highlights.map((h) => (
              <Chip key={h} accent>
                {h}
              </Chip>
            ))}
          </div>
        )}
      </header>

      {/* narrative */}
      <div className="grid gap-8 p-5 md:p-7 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        <dl className="space-y-5">
          {(
            [
              ["Problem", p.problem],
              ["Engineering challenge", p.challenge],
              ["Solution", p.solution],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-accent">{k}</dt>
              <dd className="mt-1.5 text-[15px] leading-relaxed text-muted">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-5">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-subtle">Technologies</p>
            <div className="flex flex-wrap gap-1.5">
              {p.stack.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {p.repo !== undefined && (
              <LinkButton href={p.repo} size="sm" icon={<GitHubIcon width={14} height={14} />}>
                GitHub
              </LinkButton>
            )}
            {p.demo && !isPlaceholder(p.demo) && (
              <LinkButton href={p.demo} size="sm" icon={<ArrowUpRightIcon width={14} height={14} />}>
                Live demo
              </LinkButton>
            )}
            {professional && (
              <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
                <LockIcon width={13} height={13} />
                Proprietary system. Code is not public.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* architecture / interactive area */}
      <div className="border-t border-line bg-elev/40 p-5 md:p-7">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-accent">Architecture</h4>
          <span className="text-xs text-subtle">Select any component to see what it does</span>
        </div>

        {p.variant === "workflow" || p.variant === "search" ? (
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24">{p.variant === "workflow" ? <AgentWorkflow /> : <SearchDemo />}</div>
            <InteractiveDiagram stages={p.stages} layout="stack" label={`${p.title} architecture`} />
          </div>
        ) : (
          <InteractiveDiagram stages={p.stages} layout="flow" cols={cols} label={`${p.title} architecture`} />
        )}
      </div>

      {/* deep dive */}
      <div className="border-t border-line">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${p.slug}-deep`}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-fg transition-colors hover:bg-surface md:px-7"
        >
          Technical deep dive
          <ChevronDownIcon className={cn("text-muted transition-transform duration-200", open && "rotate-180")} />
        </button>
        <div id={`${p.slug}-deep`} className="expander" data-open={open} inert={!open}>
          <div>
            <div className="grid gap-x-10 gap-y-6 px-5 pb-7 pt-1 md:grid-cols-2 md:px-7 lg:grid-cols-3">
              {deepDiveSections.map(({ key, title }) => (
                <div key={key}>
                  <h5 className="font-mono text-[11px] uppercase tracking-wider text-accent">{title}</h5>
                  <ul className="mt-2 space-y-1.5">
                    {p.deepDive[key].map((line) => (
                      <li key={line} className="flex gap-2 text-sm leading-relaxed text-muted">
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

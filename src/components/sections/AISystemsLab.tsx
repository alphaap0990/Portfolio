"use client";

import { useState } from "react";
import { labDiagrams } from "@/data/lab";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArchitectureDiagram, NodeDetailPanel, useRevealPanel } from "@/components/diagrams/ArchitectureDiagram";
import { cn } from "@/lib/utils";

export function AISystemsLab() {
  const [tabId, setTabId] = useState(labDiagrams[0].id);
  const diagram = labDiagrams.find((d) => d.id === tabId) ?? labDiagrams[0];
  const nodes = diagram.stages.flat();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const activeId = selected[diagram.id] ?? nodes[0].id;
  const active = nodes.find((n) => n.id === activeId);
  const { ref: panelRef, reveal } = useRevealPanel();

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + labDiagrams.length) % labDiagrams.length;
    setTabId(labDiagrams[next].id);
    document.getElementById(`lab-tab-${labDiagrams[next].id}`)?.focus();
  };

  return (
    <Section id="lab">
      <SectionHeader
        id="lab"
        eyebrow="Interactive"
        title="AI Systems Lab"
        description="Reference architectures with the reasoning behind each component. Click any block to see its purpose, the technology, why it is there, and what it costs."
      />

      <Reveal>
        <div className="card overflow-hidden">
          <div role="tablist" aria-label="Architecture diagrams" className="flex gap-1 overflow-x-auto border-b border-line p-2">
            {labDiagrams.map((d, i) => {
              const on = d.id === tabId;
              return (
                <button
                  key={d.id}
                  id={`lab-tab-${d.id}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="lab-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTabId(d.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "shrink-0 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors",
                    on ? "bg-accent-dim text-accent" : "text-muted hover:bg-surface-hover hover:text-fg",
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          <div id="lab-panel" role="tabpanel" aria-labelledby={`lab-tab-${diagram.id}`} className="p-5 md:p-7">
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">{diagram.blurb}</p>
            <ArchitectureDiagram
              key={diagram.id}
              stages={diagram.stages}
              layout="flow"
              cols={diagram.cols}
              loop={diagram.loop}
              activeId={activeId}
              onSelect={(id) => {
                setSelected((s) => ({ ...s, [diagram.id]: id }));
                reveal();
              }}
              label={`${diagram.label} architecture`}
            />
            <NodeDetailPanel node={active} as="h3" className="mt-8" panelRef={panelRef} />
          </div>
        </div>
        <p className="mt-3 text-xs text-subtle">
          These are conceptual reference architectures for explaining design tradeoffs. They are not descriptions of any single employer system.
        </p>
      </Reveal>
    </Section>
  );
}

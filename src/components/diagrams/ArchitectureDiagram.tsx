"use client";

import { useRef, useState, type CSSProperties } from "react";
import type { DiagramNode, Stage } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ArrowRightIcon, ResetIcon } from "@/components/ui/Icons";

type Props = {
  stages: Stage[];
  activeId?: string;
  onSelect?: (id: string) => void;
  /** "stack": always vertical (project cards). "flow": vertical on mobile, grid on md+ (lab). */
  layout?: "stack" | "flow";
  cols?: number;
  loop?: string;
  label: string;
};

export function ArchitectureDiagram({ stages, activeId, onSelect, layout = "stack", cols = 5, loop, label }: Props) {
  const flow = layout === "flow";
  const style = flow ? ({ "--cols": cols } as CSSProperties) : undefined;

  return (
    <div>
      <ol
        aria-label={label}
        style={style}
        className={cn(flow ? "flex flex-col md:grid md:grid-cols-[repeat(var(--cols),minmax(0,1fr))] md:gap-x-7 md:gap-y-9" : "flex flex-col")}
      >
        {stages.map((stage, i) => {
          const last = i === stages.length - 1;
          const endOfRow = flow && (i + 1) % cols === 0;
          return (
            <li key={stage.map((n) => n.id).join("+")} className="relative">
              <div className="mb-1 font-mono text-[10.5px] tracking-wider text-subtle">{String(i + 1).padStart(2, "0")}</div>
              <div className={cn("gap-2", stage.length > 1 ? (flow ? "flex flex-col" : "grid grid-cols-2") : "flex flex-col")}>
                {stage.map((node) => (
                  <NodeButton key={node.id} node={node} active={activeId === node.id} onSelect={onSelect} />
                ))}
              </div>

              {/* connector: vertical (stack / mobile) */}
              {!last && (
                <span
                  aria-hidden
                  className={cn("flex justify-center py-1.5 text-accent/70", flow && "md:hidden")}
                >
                  <ChevronDownIcon width={16} height={16} />
                </span>
              )}
              {/* connector: horizontal (flow, md+) */}
              {flow && !last && !endOfRow && (
                <span aria-hidden className="pointer-events-none absolute -right-[22px] top-[3.1rem] hidden text-accent/70 md:block">
                  <ArrowRightIcon width={16} height={16} />
                </span>
              )}
              {/* row wrap: point down to the next row (flow, md+) */}
              {flow && !last && endOfRow && (
                <span aria-hidden className="pointer-events-none absolute -bottom-[26px] right-3 hidden text-accent/70 md:block">
                  <ChevronDownIcon width={16} height={16} />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {loop && (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-accent-line px-3 py-1.5 font-mono text-[11.5px] text-accent">
          <ResetIcon width={13} height={13} />
          {loop}
        </p>
      )}
    </div>
  );
}

function NodeButton({ node, active, onSelect }: { node: DiagramNode; active: boolean; onSelect?: (id: string) => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect?.(node.id)}
      className={cn(
        "group w-full rounded-lg border px-3 py-2.5 text-left transition-colors duration-150",
        active
          ? "border-accent-line bg-accent-dim shadow-[0_0_0_1px_rgb(86_217_195/0.25)]"
          : "border-line bg-surface hover:border-line-strong hover:bg-surface-hover",
      )}
    >
      <span className={cn("block text-[13px] font-medium leading-snug", active ? "text-accent" : "text-fg")}>{node.label}</span>
      {node.sub && <span className="mt-0.5 block font-mono text-[11px] leading-snug text-subtle">{node.sub}</span>}
    </button>
  );
}

/**
 * On narrow screens the detail panel sits below a tall vertical diagram, so bring it into
 * view after a selection. Uses instant scrolling for reduced-motion users.
 */
export function useRevealPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const reveal = () => {
    if (window.innerWidth >= 768) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => ref.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }));
  };
  return { ref, reveal };
}

export function NodeDetailPanel({
  node,
  className,
  panelRef,
  as: Heading = "h4",
}: {
  node?: DiagramNode;
  className?: string;
  panelRef?: React.Ref<HTMLDivElement>;
  as?: "h3" | "h4";
}) {
  if (!node?.detail) {
    return (
      <div className={cn("rounded-xl border border-dashed border-line p-4 text-sm text-subtle", className)}>
        Select a component to see its purpose and tradeoffs.
      </div>
    );
  }
  const d = node.detail;
  const rows: [string, string | undefined][] = [
    ["Purpose", d.purpose],
    ["Technology", d.technology],
    ["Why it is used", d.why],
    ["Tradeoffs", d.tradeoffs],
  ];
  return (
    <div key={node.id} ref={panelRef} aria-live="polite" className={cn("animate-fade-up scroll-mb-4 rounded-xl border border-accent-line/60 bg-elev/80 p-4 md:p-5", className)}>
      <Heading className="text-base font-semibold text-fg">{node.label}</Heading>
      <dl className={cn("mt-3 grid gap-x-6 gap-y-3", rows.filter((r) => r[1]).length > 2 && "md:grid-cols-2")}>
        {rows.map(
          ([k, v]) =>
            v && (
              <div key={k}>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-accent">{k}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{v}</dd>
              </div>
            ),
        )}
      </dl>
    </div>
  );
}

/** Convenience wrapper: diagram + detail panel with its own selection state. */
export function InteractiveDiagram(props: Omit<Props, "activeId" | "onSelect"> & { panelClassName?: string; initialId?: string }) {
  const { panelClassName, initialId, ...rest } = props;
  const all = props.stages.flat();
  const [activeId, setActiveId] = useState<string | undefined>(initialId ?? all[0]?.id);
  const active = all.find((n) => n.id === activeId);
  const { ref, reveal } = useRevealPanel();
  return (
    <div className="space-y-4">
      <ArchitectureDiagram
        {...rest}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          reveal();
        }}
      />
      <NodeDetailPanel node={active} className={panelClassName} panelRef={ref} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PlayIcon, ResetIcon } from "@/components/ui/Icons";

type Step = { id: string; label: string; node: string; log: (escalate: boolean) => string };

const steps: Step[] = [
  {
    id: "input",
    label: "Input",
    node: "entry",
    log: () => "Request received. Graph state initialised with the request payload.",
  },
  {
    id: "policy",
    label: "Policy Retrieval",
    node: "rag_node",
    log: () => "RAG lookup attaches the relevant policy sections to state.",
  },
  {
    id: "clinical",
    label: "Clinical Validation",
    node: "llm_node",
    log: () => "Clinical information checked against the retrieved criteria. Output validated by guardrails.",
  },
  {
    id: "necessity",
    label: "Medical Necessity Check",
    node: "llm_node",
    log: (e) => (e ? "Criteria assessed. Confidence: low." : "Criteria assessed. Confidence: high."),
  },
  {
    id: "policyval",
    label: "Policy Validation",
    node: "llm_node",
    log: (e) => (e ? "Outcome checked against policy. Conflict flagged." : "Outcome checked against policy. Consistent."),
  },
  {
    id: "decision",
    label: "Decision / Human Review",
    node: "conditional_edge",
    log: (e) =>
      e
        ? "Conditional edge routes to human_review. Graph pauses with checkpointed state for the reviewer."
        : "Conditional edge routes to recommendation. Result and evidence logged for audit.",
  },
];

const STEP_MS = 800;

export function AgentWorkflow() {
  const [step, setStep] = useState(-1); // -1 = idle
  const [running, setRunning] = useState(false);
  const [escalate, setEscalate] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (step >= steps.length - 1) {
      const t = setTimeout(() => setRunning(false), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [running, step]);

  const start = () => {
    setStep(0);
    setRunning(true);
  };
  const reset = () => {
    setRunning(false);
    setStep(-1);
  };
  const finished = step === steps.length - 1 && !running;

  return (
    <div className="rounded-xl border border-line bg-elev/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">Interactive workflow</p>
          <p className="text-xs text-subtle">Illustrative simulation with synthetic data, not the production logic.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={running ? undefined : start}
            disabled={running}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-xs font-semibold text-accent-fg transition hover:brightness-110 disabled:opacity-60"
          >
            <PlayIcon width={12} height={12} />
            {finished ? "Run again" : "Run sample case"}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={step === -1}
            aria-label="Reset workflow"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line-strong text-muted transition hover:text-fg disabled:opacity-40"
          >
            <ResetIcon width={14} height={14} />
          </button>
        </div>
      </div>

      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={escalate}
          onChange={(e) => {
            setEscalate(e.target.checked);
            reset();
          }}
          className="h-3.5 w-3.5 accent-[var(--accent)]"
        />
        Simulate a low-confidence / policy-conflict case
      </label>

      <ol className="mt-4 space-y-0" aria-live="polite">
        {steps.map((s, i) => {
          const state = i < step || (i === step && finished) ? "done" : i === step ? "active" : "pending";
          const isLast = i === steps.length - 1;
          return (
            <li key={s.id} className="relative flex gap-3 pb-3 last:pb-0">
              {!isLast && <span aria-hidden className={cn("absolute left-[9px] top-5 h-[calc(100%-12px)] w-px", state === "done" ? "bg-accent-line" : "bg-line")} />}
              <span
                aria-hidden
                className={cn(
                  "z-10 mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border text-[9px] font-mono",
                  state === "done" && "border-accent bg-accent text-accent-fg",
                  state === "active" && "status-dot border-accent bg-accent-dim text-accent",
                  state === "pending" && "border-line-strong bg-base text-subtle",
                )}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className={cn("text-[13px] font-medium", state === "pending" ? "text-subtle" : "text-fg")}>{s.label}</span>
                  <span className="font-mono text-[11px] text-subtle">{s.node}</span>
                </div>
                {state !== "pending" && <p className="animate-fade-up mt-0.5 text-xs leading-relaxed text-muted">{s.log(escalate)}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4">
        {[
          { id: "auto", label: "Recommendation ready", on: finished && !escalate },
          { id: "human", label: "Human review", on: finished && escalate },
        ].map((o) => (
          <div
            key={o.id}
            className={cn(
              "rounded-lg border px-3 py-2 text-center text-xs transition-colors",
              o.on ? "border-accent-line bg-accent-dim font-medium text-accent" : "border-line text-subtle",
            )}
          >
            {o.label}
          </div>
        ))}
      </div>
    </div>
  );
}

import { metricGroups, type Metric } from "@/data/metrics";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

/** Thin single-hue meter (bounded ratios only). The number itself is always shown as text. */
function Meter({ metric }: { metric: Metric }) {
  if (metric.suffix === "×") {
    // Comparison against a 1× baseline on the same scale
    const pct = (1 / metric.value) * 100;
    return (
      <div aria-hidden className="mt-3 space-y-1.5">
        {[
          { label: "1× baseline", w: pct, strong: false },
          { label: `${metric.display}`, w: 100, strong: true },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="w-[5.5rem] shrink-0 whitespace-nowrap font-mono text-[10px] text-subtle">{r.label}</span>
            <span className="h-[5px] flex-1 overflow-hidden rounded-full bg-line">
              <span className={`block h-full rounded-full ${r.strong ? "bg-accent" : "bg-line-strong"}`} style={{ width: `${r.w}%` }} />
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (metric.meter === undefined) return null;
  return (
    <div aria-hidden className="mt-3 h-[5px] overflow-hidden rounded-full bg-line">
      <div className="h-full rounded-full bg-accent" style={{ width: `${Math.round(metric.meter * 100)}%` }} />
    </div>
  );
}

export function NumbersSection() {
  return (
    <Section id="numbers">
      <SectionHeader
        id="numbers"
        eyebrow="Impact"
        title="Numbers behind the systems"
        description="Measured results from the systems above. Each figure comes from my resume; where a metric is tied to a specific system, that system is named."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {metricGroups.map((g, gi) => (
          <Reveal key={g.title} delay={gi * 0.07}>
            <section className="card h-full p-5 md:p-6" aria-label={g.title}>
              <h3 className="text-[15px] font-semibold text-fg">{g.title}</h3>
              <p className="mt-0.5 text-xs text-subtle">{g.blurb}</p>
              <ul className="mt-3">
                {g.items.map((m) => (
                  <li key={m.label} className="border-t border-line py-4 first:border-t-0">
                    <dl className="grid grid-cols-[6.25rem_1fr] items-baseline gap-x-3">
                      <dt className="col-start-2 row-start-1 text-sm leading-snug text-muted">
                        {m.label}
                        {m.context && <span className="mt-0.5 block text-xs text-subtle">{m.context}</span>}
                      </dt>
                      <dd className="tabular col-start-1 row-start-1 text-[1.65rem] font-semibold leading-none tracking-tight text-fg">
                        <CountUp metric={m} />
                      </dd>
                    </dl>
                    <Meter metric={m} />
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

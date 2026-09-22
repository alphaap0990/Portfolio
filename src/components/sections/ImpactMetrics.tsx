import { impactStrip } from "@/data/metrics";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

/** Compact engineering-impact strip directly under the hero. */
export function ImpactMetrics() {
  return (
    <section aria-label="Engineering impact" className="pb-4">
      <div className="container-x">
        <Reveal>
          {/* gap-px over a line-coloured background draws hairlines between cells */}
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
            {impactStrip.map((m) => (
              <div key={m.label} className="flex flex-col bg-elev px-4 py-5 md:px-5">
                <dt className="order-2 mt-1 text-xs leading-snug text-muted">{m.label}</dt>
                <dd className="tabular order-1 text-3xl font-semibold tracking-tight text-fg md:text-[2rem]">
                  <CountUp metric={m} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

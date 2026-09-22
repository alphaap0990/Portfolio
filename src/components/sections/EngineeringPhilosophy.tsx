import { Reveal } from "@/components/ui/Reveal";

const principles = [
  { title: "Build measurable systems", body: "Every system ships with metrics: accuracy, latency and cost." },
  { title: "Optimize for reliability and latency", body: "Judge serving by P99 under load, not the average." },
  { title: "Treat evaluation as a first-class component", body: "Held-out sets, RAGAS and TruLens gate changes before release." },
  { title: "Design for production rather than demos", body: "Tests, CI/CD and monitoring from the first commit." },
  { title: "Keep humans in the loop where appropriate", body: "Review paths are part of the workflow graph." },
  { title: "Build privacy and compliance into the architecture", body: "Guardrails and controls are designed in, not bolted on." },
];

export function EngineeringPhilosophy() {
  return (
    <div className="mt-16 md:mt-20">
      <Reveal>
        <h3 className="mb-6 text-xl font-semibold tracking-tight text-fg">Engineering philosophy</h3>
      </Reveal>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {principles.map((p, i) => (
          <li key={p.title}>
            <Reveal delay={i * 0.05} className="h-full">
              <div className="card h-full p-5 transition-colors hover:border-line-strong">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="mt-2 text-[15px] font-medium leading-snug text-fg">{p.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

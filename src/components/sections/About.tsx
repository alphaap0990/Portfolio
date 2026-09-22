import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Chip } from "@/components/ui/Chip";
import { EngineeringPhilosophy } from "./EngineeringPhilosophy";

const lifecycle = [
  { step: "Data", note: "pipelines · features" },
  { step: "Train", note: "modeling · fine-tuning" },
  { step: "Evaluate", note: "metrics · golden sets" },
  { step: "Deploy", note: "Docker · SageMaker · EKS" },
  { step: "Monitor", note: "latency · drift · cost" },
  { step: "Improve", note: "retrain · iterate" },
];

const fullLifecycle = ["Data", "Feature Engineering", "Model Development", "LLM / RAG", "Evaluation", "Deployment", "Monitoring"];
const domains = ["Healthcare", "Enterprise technology", "NLP", "Predictive analytics", "Generative AI", "Cloud ML", "MLOps"];

export function About() {
  return (
    <Section id="about">
      <SectionHeader
        id="about"
        eyebrow="About"
        title="How I build AI systems"
        description="I work across the complete ML lifecycle, and I care as much about the system around a model as the model itself."
      />

      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal className="space-y-5 text-base leading-relaxed text-muted">
          <p>
            My work spans healthcare and enterprise technology: natural language processing, predictive analytics, Generative AI, cloud ML and MLOps. I move from raw data through feature engineering and model development to LLM and RAG systems, then on to
            evaluation, deployment and monitoring.
          </p>
          <p>
            That end-to-end view matters. A retrieval pipeline is only useful once it is measured, fast enough and safe to run, so I build the evaluation, serving and monitoring layers alongside the model.
          </p>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-subtle">Where I have applied it</p>
            <div className="flex flex-wrap gap-1.5">
              {domains.map((d) => (
                <Chip key={d}>{d}</Chip>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <figure className="card p-5 md:p-6" aria-label="ML lifecycle: Data, Train, Evaluate, Deploy, Monitor, Improve">
            <figcaption className="mb-5 font-mono text-[11px] uppercase tracking-wider text-subtle">The lifecycle I own</figcaption>

            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
              {lifecycle.map((s, i) => (
                <li key={s.step} className="relative">
                  <div className="h-full rounded-lg border border-line bg-elev/70 p-3">
                    <span className="font-mono text-[10.5px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-1 text-sm font-medium text-fg">{s.step}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-subtle">{s.note}</p>
                  </div>
                  {i < lifecycle.length - 1 && (
                    <span aria-hidden className="absolute -right-[13px] top-1/2 hidden -translate-y-1/2 text-accent/70 md:block">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>

            {/* loop-back: Improve feeds Data */}
            <div aria-hidden className="mt-3 hidden items-center gap-2 md:flex">
              <span className="text-accent/70">↑</span>
              <span className="h-px flex-1 border-t border-dashed border-accent-line" />
              <span className="font-mono text-[10.5px] text-accent">continuous loop</span>
              <span className="h-px flex-1 border-t border-dashed border-accent-line" />
              <span className="text-accent/70">↑</span>
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-subtle">In practice</p>
              <p className="text-[13px] leading-relaxed text-muted">
                {fullLifecycle.map((s, i) => (
                  <span key={s}>
                    <span className="text-fg">{s}</span>
                    {i < fullLifecycle.length - 1 && <span className="mx-1.5 text-accent/70">→</span>}
                  </span>
                ))}
              </p>
            </div>
          </figure>
        </Reveal>
      </div>

      <EngineeringPhilosophy />
    </Section>
  );
}

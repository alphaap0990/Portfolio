import { site } from "@/data/site";
import { experience } from "@/data/experience";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/ui/Reveal";
import { DownloadIcon } from "@/components/ui/Icons";

const glanceLine: Record<string, string> = {
  UnitedHealthcare: "Enterprise RAG · LLM fine-tuning · Agentic AI · Claims prediction · MLOps",
  "Inspire Infosol Pvt Ltd.": "Churn · Fraud · NLP · Document AI · Recommenders · Forecasting · Computer vision",
};

export function ResumeCTA() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <Reveal>
        <ol className="card divide-y divide-line">
          {experience.map((r) => (
            <li key={r.company} className="p-5 md:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-base font-semibold text-fg">
                  {r.title} <span className="font-normal text-muted">· {r.company}</span>
                </h3>
                <p className="tabular text-sm text-muted">{r.period}</p>
              </div>
              <p className="mt-0.5 text-xs text-subtle">{r.location}</p>
              <p className="mt-3 text-sm text-muted">{glanceLine[r.company]}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={0.07}>
        <div className="card flex h-full flex-col justify-between gap-6 p-6">
          <div>
            <h3 className="text-base font-semibold text-fg">Full details on the resume</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">Roles, projects, metrics, education and certifications in one page.</p>
          </div>
          <LinkButton href={site.links.resume} variant="primary" icon={<DownloadIcon />} className="w-full sm:w-auto">
            Download Resume
          </LinkButton>
        </div>
      </Reveal>
    </div>
  );
}

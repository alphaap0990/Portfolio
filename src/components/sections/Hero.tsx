import { site } from "@/data/site";
import { LinkButton } from "@/components/ui/LinkButton";
import { ArrowRightIcon, DownloadIcon, GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";

const glance: [string, string][] = [
  ["Currently", "AI/ML Engineer, UnitedHealthcare"],
  ["Focus", "Generative AI · RAG · LLM fine-tuning · MLOps"],
  ["Cloud", "AWS: Bedrock, SageMaker, EKS"],
  ["Domain", "Healthcare and enterprise technology"],
  ["Scale", "400K+ pages · 12M+ claims · 5TB+ data"],
];

export function Hero() {
  return (
    <section id="home" className="relative pb-14 pt-32 md:pb-20 md:pt-40" aria-labelledby="hero-title">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.3fr_0.8fr] lg:gap-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {site.status}
          </p>

          <h1 id="hero-title" className="mt-6 text-balance">
            <span className="block text-lg font-medium text-muted md:text-xl">{site.name}</span>
            <span className="mt-2 block text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl md:text-6xl">
              AI/ML Engineer <span className="text-muted">building <span className="whitespace-nowrap">production-grade</span> AI systems.</span>
            </span>
          </h1>

          <p className="mt-5 font-mono text-[13px] tracking-wide text-accent md:text-sm">{site.stackLine}</p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{site.intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href="#projects" variant="primary" icon={<ArrowRightIcon />}>
              View Projects
            </LinkButton>
            <LinkButton href={site.links.resume} icon={<DownloadIcon />}>
              Download Resume
            </LinkButton>
            <LinkButton href={site.links.github} variant="ghost" icon={<GitHubIcon />}>
              GitHub
            </LinkButton>
            <LinkButton href={site.links.linkedin} variant="ghost" icon={<LinkedInIcon />}>
              LinkedIn
            </LinkButton>
          </div>
        </div>

        {/* At-a-glance: answers "who / what / where / scale" for a recruiter in a few seconds */}
        <aside aria-label="Profile at a glance" className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-line-strong" aria-hidden />
            <span className="h-2 w-2 rounded-full bg-line-strong" aria-hidden />
            <span className="h-2 w-2 rounded-full bg-line-strong" aria-hidden />
            <span className="ml-2 font-mono text-[11px] text-subtle">profile.summary</span>
          </div>
          <dl className="divide-y divide-line">
            {glance.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3 px-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-subtle">{k}</dt>
                <dd className="text-sm text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

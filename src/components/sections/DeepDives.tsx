import Link from "next/link";
import { articles } from "@/data/articles";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Chip } from "@/components/ui/Chip";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function DeepDives() {
  return (
    <Section id="deep-dives">
      <SectionHeader
        id="deep-dives"
        eyebrow="Engineering deep dives"
        title="How I think about the hard parts"
        description="Short technical write-ups on retrieval, fine-tuning, inference and production readiness. Each currently opens as a structured outline, with full articles to follow."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <Reveal key={a.slug} delay={(i % 3) * 0.06} className={cn(i === 0 && "lg:col-span-2")}>
            <Link
              href={`/deep-dives/${a.slug}`}
              className="card group flex h-full flex-col p-5 transition-colors hover:border-accent-line md:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-dashed border-line-strong px-2 py-0.5 text-[10.5px] uppercase tracking-wider text-subtle">
                  {a.status === "outline" ? "Draft outline" : "Article"}
                </span>
                <ArrowUpRightIcon className="text-subtle transition-colors group-hover:text-accent" />
              </div>
              <h3 className={cn("mt-4 font-semibold leading-snug tracking-tight text-fg", i === 0 ? "text-xl md:text-2xl" : "text-lg")}>{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.excerpt}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {a.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { site } from "@/data/site";
import { Chip } from "@/components/ui/Chip";
import { Footer } from "@/components/layout/Footer";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/deep-dives/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt, url: `/deep-dives/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) notFound();
  const article = articles[index];
  const next = articles[(index + 1) % articles.length];

  return (
    <>
      <header className="border-b border-line">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-line bg-accent-dim font-mono text-[13px] font-semibold text-accent">AP</span>
            <span className="text-sm font-semibold tracking-tight text-fg">{site.name}</span>
          </Link>
          <Link href="/#deep-dives" className="text-sm text-muted transition-colors hover:text-fg">
            ← All deep dives
          </Link>
        </div>
      </header>

      <main id="main" className="container-x max-w-3xl py-14 md:py-20">
        <article>
          <p className="eyebrow mb-3">Engineering deep dive</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-fg md:text-4xl">{article.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{article.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {article.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>

          {article.body?.length ? (
            <div className="mt-10 space-y-5 text-base leading-relaxed text-muted">
              {article.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ) : (
            <>
              <aside className="mt-10 rounded-xl border border-dashed border-accent-line bg-accent-dim px-4 py-3 text-sm text-fg">
                <strong className="font-semibold text-accent">Draft outline.</strong> The full write-up is in progress. This is the structure it will follow.
              </aside>

              <ol className="mt-8 space-y-4">
                {article.outline.map((s, i) => (
                  <li key={s.heading} className="card p-5">
                    <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
                    <h2 className="mt-1 text-lg font-semibold text-fg">{s.heading}</h2>
                    <ul className="mt-2 space-y-1.5">
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-2 text-sm leading-relaxed text-muted">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </>
          )}
        </article>

        <nav aria-label="Next article" className="mt-14 border-t border-line pt-6">
          <p className="text-xs text-subtle">Next deep dive</p>
          <Link href={`/deep-dives/${next.slug}`} className="mt-1 inline-block text-base font-medium text-fg transition-colors hover:text-accent">
            {next.title} →
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}

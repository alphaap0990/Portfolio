"use client";

import { useEffect, useRef, useState } from "react";
import { isPlaceholder, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";
import { LinkButton } from "@/components/ui/LinkButton";
import { GitHubIcon, StarIcon } from "@/components/ui/Icons";

type Repo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

type Commit = { repo: string; message: string; url: string; at: string };
type Day = { date: string; count: number; level: number };
type Data = { repos: Repo[]; commits: Commit[]; days: Day[]; total: number | null };

// Only repositories that match these themes are surfaced; everything else stays hidden.
const RELEVANT = [
  "ai", "ml", "machine-learning", "machinelearning", "deep-learning", "rag", "llm", "llms", "genai", "generative",
  "langchain", "langgraph", "llamaindex", "fastapi", "mlops", "nlp", "transformers", "pytorch", "tensorflow",
  "sagemaker", "bedrock", "embedding", "vector", "retrieval", "fine-tuning", "finetuning", "qlora", "lora", "python",
];

const relevance = (r: Repo) => {
  const hay = `${r.name} ${r.description ?? ""} ${(r.topics ?? []).join(" ")}`.toLowerCase();
  const tokens = new Set(hay.split(/[^a-z0-9]+/));
  let score = RELEVANT.reduce((s, k) => s + (tokens.has(k) || hay.includes(`${k}-`) ? 1 : 0), 0);
  if (r.language === "Python" || r.language === "Jupyter Notebook") score += 1;
  return score;
};

const CACHE_KEY = "gh-portfolio-v1";
const TTL = 60 * 60 * 1000;

/**
 * Minimum contributions in the last year before the graph is worth showing. A grid with a
 * couple of filled squares undersells the profile, so below this the section shows a plain
 * "View GitHub" card instead and starts rendering the graph once activity picks up.
 */
const MIN_GRAPH_CONTRIBUTIONS = 20;

async function load(user: string): Promise<Data> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
    if (cached && cached.user === user && Date.now() - cached.at < TTL) return cached.data as Data;
  } catch {}

  const gh = (path: string) => fetch(`https://api.github.com${path}`, { headers: { Accept: "application/vnd.github+json" } });

  const [reposRes, eventsRes, contribRes] = await Promise.allSettled([
    gh(`/users/${user}/repos?per_page=100&sort=pushed`),
    gh(`/users/${user}/events/public?per_page=100`),
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`),
  ]);

  if (reposRes.status !== "fulfilled" || !reposRes.value.ok) throw new Error("repos");
  const all: Repo[] = await reposRes.value.json();

  const repos = all
    .filter((r) => !r.fork && !r.archived)
    .map((r) => ({ r, s: relevance(r) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.r.stargazers_count - a.r.stargazers_count || +new Date(b.r.pushed_at) - +new Date(a.r.pushed_at))
    .slice(0, 6)
    .map((x) => x.r);

  const allowed = new Set(repos.map((r) => r.full_name));
  const commits: Commit[] = [];
  if (eventsRes.status === "fulfilled" && eventsRes.value.ok) {
    const events = await eventsRes.value.json();
    for (const e of events) {
      if (e.type !== "PushEvent" || !allowed.has(e.repo.name)) continue;
      const list: { message: string; sha: string }[] = e.payload?.commits ?? [];
      if (list.length) {
        list.slice(-2).reverse().forEach((c) =>
          commits.push({ repo: e.repo.name, message: c.message.split("\n")[0], url: `https://github.com/${e.repo.name}/commit/${c.sha}`, at: e.created_at }),
        );
      } else {
        commits.push({ repo: e.repo.name, message: "Pushed new commits", url: `https://github.com/${e.repo.name}`, at: e.created_at });
      }
      if (commits.length >= 5) break;
    }
  }

  let days: Day[] = [];
  let total: number | null = null;
  if (contribRes.status === "fulfilled" && contribRes.value.ok) {
    const j = await contribRes.value.json();
    days = j.contributions ?? [];
    total = j.total?.lastYear ?? null;
  }

  const data: Data = { repos, commits: commits.slice(0, 5), days, total };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ user, at: Date.now(), data }));
  } catch {}
  return data;
}

const ago = (iso: string) => {
  const d = Math.max(0, Date.now() - +new Date(iso));
  const days = Math.floor(d / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

export function GitHubSection() {
  const user = site.githubUsername;
  const configured = !isPlaceholder(user);
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ status: "idle" | "loading" | "ready" | "error"; data?: Data }>({ status: "idle" });

  // Lazy: nothing is requested until the section approaches the viewport.
  useEffect(() => {
    if (!configured || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setState({ status: "loading" });
        load(user).then(
          (data) => setState({ status: "ready", data }),
          () => setState({ status: "error" }),
        );
      },
      { rootMargin: "300px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [configured, user]);

  const data = state.data;
  const loading = state.status === "idle" || state.status === "loading";
  const showRepos = !!data?.repos.length;
  const showCommits = !!data?.commits.length;
  // A nearly blank grid reads worse than no grid at all, so the graph waits for real activity.
  const showGraph = !!data?.days.length && (data.total ?? 0) >= MIN_GRAPH_CONTRIBUTIONS;
  const panels = Number(showRepos) + Number(showCommits);
  const nothingToShow = state.status === "ready" && panels === 0 && !showGraph;

  const fallbackCopy = !configured
    ? "Featured repositories, stars, languages, recent commits and the contribution graph appear here once a GitHub username is connected."
    : state.status === "error"
      ? "GitHub data could not be loaded right now (the public API is rate-limited). Repositories and recent work are available on GitHub."
      : "Public AI/ML repositories, recent commits and the contribution graph appear here automatically as work is pushed to GitHub.";

  return (
    <Section id="github">
      <SectionHeader
        id="github"
        eyebrow="Open source"
        title="GitHub activity"
        description="Live from the GitHub API, filtered to AI, ML, RAG, LLM, FastAPI, MLOps and Python work. Unrelated repositories are not shown."
      />

      <div ref={ref} className="space-y-4">
        {!configured || state.status === "error" || nothingToShow ? (
          <div className="card flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-muted">{fallbackCopy}</p>
            <LinkButton href={site.links.github} icon={<GitHubIcon />}>
              View GitHub
            </LinkButton>
          </div>
        ) : loading ? (
          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="card p-5">
              <Skeleton rows={4} />
            </div>
            <div className="card p-5">
              <Skeleton rows={4} />
            </div>
          </div>
        ) : data ? (
          <>
            {panels > 0 && (
              <div className={cn("grid gap-4", panels === 2 && "lg:grid-cols-[1.6fr_1fr]")}>
                {showRepos && <ReposPanel repos={data.repos} />}
                {showCommits && <CommitsPanel commits={data.commits} />}
              </div>
            )}
            {showGraph && (
              <div className="card p-5">
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-[11px] uppercase tracking-wider text-accent">Contributions, last year</h3>
                  {data.total != null && <span className="tabular text-xs text-muted">{data.total.toLocaleString()} contributions</span>}
                </div>
                <ContributionGraph days={data.days} />
                <p className="mt-3 text-[11px] text-subtle">Contribution data via github-contributions-api (third-party, public profile data).</p>
              </div>
            )}
          </>
        ) : null}
      </div>
    </Section>
  );
}

function ReposPanel({ repos }: { repos: Repo[] }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-wider text-accent">Featured repositories</h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {repos.map((r) => (
          <li key={r.full_name}>
            <a
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full rounded-lg border border-line bg-elev/60 p-3.5 transition-colors hover:border-accent-line"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-fg">{r.name}</span>
                <span className="inline-flex items-center gap-1 text-xs text-muted">
                  <StarIcon width={12} height={12} />
                  {r.stargazers_count}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{r.description ?? "No description."}</p>
              <div className="mt-2.5 flex items-center gap-2 text-[11px] text-subtle">
                {r.language && <Chip>{r.language}</Chip>}
                <span>updated {ago(r.pushed_at)}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommitsPanel({ commits }: { commits: Commit[] }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-wider text-accent">Recent commits</h3>
      <ul className="space-y-3">
        {commits.map((c) => (
          <li key={c.url + c.at}>
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="group block">
              <p className="line-clamp-2 text-[13px] leading-snug text-fg group-hover:text-accent">{c.message}</p>
              <p className="mt-0.5 font-mono text-[11px] text-subtle">
                {c.repo.split("/")[1]} · {ago(c.at)}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Skeleton({ rows, tall }: { rows: number; tall?: boolean }) {
  return (
    <div aria-hidden className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`animate-pulse rounded-md bg-surface-hover ${tall ? "h-24" : "h-10"}`} />
      ))}
    </div>
  );
}

function ContributionGraph({ days }: { days: Day[] }) {
  const cell = 11;
  const gap = 3;
  const first = new Date(days[0].date).getUTCDay();
  const weeks = Math.ceil((days.length + first) / 7);
  const opacity = [0, 0.22, 0.42, 0.68, 1];

  return (
    <div className="overflow-x-auto pb-1">
      <svg
        role="img"
        aria-label="GitHub contribution graph for the last year"
        width={weeks * (cell + gap)}
        height={7 * (cell + gap)}
        viewBox={`0 0 ${weeks * (cell + gap)} ${7 * (cell + gap)}`}
        className="min-w-[640px]"
      >
        {days.map((d, i) => {
          const idx = i + first;
          const x = Math.floor(idx / 7) * (cell + gap);
          const y = (idx % 7) * (cell + gap);
          return (
            <rect key={d.date} x={x} y={y} width={cell} height={cell} rx={2.5} fill={d.level === 0 ? "var(--line)" : "var(--accent)"} fillOpacity={d.level === 0 ? 1 : opacity[d.level]}>
              <title>{`${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}`}</title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}

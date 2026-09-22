# Anvesh Pavuluri: Portfolio

[![Live portfolio site](https://img.shields.io/badge/-Portfolio-111827?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-chi-pink-99.vercel.app/)

Personal portfolio for an AI/ML engineer. Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion (`LazyMotion`, ~small feature bundle).
Every page is statically generated; the only client-side network calls are the optional GitHub widgets.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

## Replace the placeholders

All content lives in [`src/data`](src/data). Anything in `[SQUARE BRACKETS]` is a placeholder: the UI renders that link as inert (never a broken URL) until you set a real value.

Still outstanding:

| Where | What to set |
| --- | --- |
| [`src/data/site.ts`](src/data/site.ts) | `url` (the deployed domain), `links.resume` |
| [`src/data/resume.ts`](src/data/resume.ts) | Certification credential URLs (never add IDs you can't verify) |
| [`src/data/projects.ts`](src/data/projects.ts) | `repo` on the Semantic Search project once that repository exists. Enterprise projects are proprietary, so they show a "code is not public" note instead of a GitHub link |
| [`src/data/articles.ts`](src/data/articles.ts) | Add `body: [...]` and set `status: "published"` to turn an outline into an article |

Already set: LinkedIn, GitHub (`alphaap0990`), email, and education dates/focus.

**Resume PDF:** put the file at `public/resume.pdf`, then set `links.resume` to `"/resume.pdf"`.

**GitHub section:** lazily loads (on scroll) repos filtered to AI/ML/RAG/LLM/FastAPI/MLOps/Python topics, recent commits, and a contribution graph. Forks and archived repos are excluded. It uses the unauthenticated GitHub API (60 req/hour/IP), cached per session, and fails gracefully. The contribution graph comes from the public `github-contributions-api.jogruber.de` service.

It degrades panel by panel: each of the three panels renders only when it has content, so nothing ever shows an empty state. The contribution graph additionally waits until the last year clears `MIN_GRAPH_CONTRIBUTIONS` (20, in [`GitHubSection.tsx`](src/components/sections/GitHubSection.tsx)) — a grid with two filled squares undersells the profile. When nothing qualifies, the section falls back to one tidy "View GitHub" card. **As of this writing the account has 1 non-matching repo and 2 contributions, so the fallback card is what renders**; the rich layout appears on its own as AI/ML work is pushed. Lower the constant to `0` to always show the graph.

## Content rules (truthfulness)

- Metrics (`src/data/metrics.ts`) are limited to the resume. `context` is attached only where a metric is tied to a specific system. **3.8× GPU throughput, 48% training-time reduction, 5TB+ and 2M+/day are shown unattributed**; add `context` once you decide which system each belongs to.
- Projects 1–5 are labelled **Professional Experience · UnitedHealthcare**; project 6 is labelled **Portfolio Project**. Change `kind` / `context` in `projects.ts` if any label is wrong.
- The **AI Systems Lab** is explicitly conceptual (reference architectures). The agentic workflow and semantic-search widgets are labelled illustrative/mock.
- Inspire Infosol areas list topics only. Add real specifics in `src/data/experience.ts`.

## Structure

```
src/
  app/            layout (metadata, JSON-LD), page, deep-dives/[slug], sitemap, robots, OG image
  components/
    layout/       Navbar (scroll-spy, mobile menu), Footer
    sections/     Hero, ImpactMetrics, About, EngineeringPhilosophy, FeaturedProjects, ProjectCard,
                  ExperienceTimeline, Skills, AISystemsLab, NumbersSection, GitHubSection,
                  DeepDives, ResumeSection (ResumeCTA, Education, Certifications), Contact
    diagrams/     ArchitectureDiagram (shared, interactive), AgentWorkflow, SearchDemo
    ui/           LinkButton, Section, Reveal/MotionProvider, Chip, CountUp, Icons
  data/           all copy and structured content
```

## Performance / accessibility notes

- Static HTML; only interactive islands hydrate. Scroll-reveal and count-up are disabled or instant under `prefers-reduced-motion`; a `<noscript>` rule keeps content visible without JS.
- Semantic landmarks, skip link, keyboard-operable tabs (arrow keys), accordions and diagram nodes (`aria-expanded` / `aria-pressed`), visible focus rings.
- Text tokens are tuned to stay ≥ 4.5:1 against the dark background. Single accent colour; the background grid/noise is static.

## Deploy

**Set `site.url` in [`site.ts`](src/data/site.ts) before the first deploy.** Until it is set, `siteUrl` falls back to `http://localhost:3000`, and the deployed `sitemap.xml` and `og:image` tags will point at localhost — which breaks link previews and search indexing.

Every route is prerendered, so there is nothing to run server-side and any free static host will do.

**Vercel (recommended).** Import the GitHub repo; the defaults are correct, and it serves the OG image and RSC prefetch payloads natively. Free Hobby tier covers a personal portfolio. You get `*.vercel.app` free; a custom domain costs only the domain registration.

**Pure static hosts** (GitHub Pages, Cloudflare Pages, Netlify, any bucket) also work — uncomment `output: "export"` in [`next.config.ts`](next.config.ts) and publish `out/`. Verified against a plain file server: pages, deep-dive routes, sitemap, robots and all interactivity work. Two known quirks, neither fatal:

1. **Link previews.** The OG image exports as `out/opengraph-image` with no extension, so hosts that infer content-type from the filename may serve it as something other than `image/png` and social crawlers will skip it. Fix by renaming it to `opengraph-image.png` after build (and pointing `openGraph.images` at that path), or by configuring the host's content-type rule.
2. **Console 404s on prefetch.** Next writes the RSC prefetch payload to a nested path (`…/__next.deep-dives/$d$slug/__PAGE__.txt`) while the browser requests it flat with dots (`…/__next.deep-dives.$d$slug.__PAGE__.txt`). The Next.js runtime maps between the two; a static file server cannot. Navigation still works — Next falls back to a normal page load — you just lose prefetching and see 404s in the console.

For a GitHub Pages **project** site (`user.github.io/Portfolio`), also set `basePath` and `assetPrefix` to `"/Portfolio"`. A user site (`alphaap0990.github.io`, from a repo of that name) needs neither.

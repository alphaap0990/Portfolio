/**
 * Single source of truth for identity, links and SEO.
 *
 * Anything in [SQUARE BRACKETS] is a placeholder. The UI detects these with
 * `isPlaceholder()` and renders the affected link as inert (never a broken URL)
 * until you replace the value with the real thing.
 */

export const isPlaceholder = (value?: string | null): boolean =>
  !value || /^\s*\[.*\]\s*$/.test(value);

export const site = {
  name: "Anvesh Pavuluri",
  role: "AI/ML Engineer",
  headline: "AI/ML Engineer building production-grade AI systems.",
  stackLine: "Generative AI • LLM Engineering • MLOps • Machine Learning",
  supporting: "Generative AI • LLM Engineering • Machine Learning • MLOps • Cloud AI",
  intro:
    "I design and build production-ready machine learning and Generative AI systems, from data pipelines and model training to RAG applications, LLM inference, evaluation, and cloud deployment.",
  status: "Open to AI/ML Engineering opportunities",

  title: "Anvesh Pavuluri | AI/ML Engineer | Generative AI & MLOps",
  description:
    "AI/ML Engineer specializing in Generative AI, LLMs, RAG, machine learning, MLOps, and production AI systems across healthcare and enterprise technology.",
  keywords: [
    "AI ML Engineer",
    "Machine Learning Engineer",
    "Generative AI Engineer",
    "LLM Engineer",
    "RAG Engineer",
    "MLOps Engineer",
    "AWS AI Engineer",
    "Python ML Engineer",
    "NLP Engineer",
    "Applied AI Engineer",
    "Anvesh Pavuluri",
  ],

  // Public URL of the deployed site, e.g. "https://anveshpavuluri.dev"
  url: "[INSERT PORTFOLIO URL]",
  email: "anveshp1976@gmail.com",

  links: {
    linkedin: "https://www.linkedin.com/in/anveshp0990",
    github: "https://github.com/alphaap0990",
    // Tip: drop your PDF in /public (e.g. public/resume.pdf) and set this to "/resume.pdf"
    resume: "[INSERT RESUME PDF URL]",
  },

  // Used by the GitHub section (live data).
  githubUsername: "alphaap0990",
} as const;

/** Absolute site URL usable for metadata (falls back to localhost until configured). */
export const siteUrl = isPlaceholder(site.url) ? "http://localhost:3000" : site.url.replace(/\/$/, "");

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "AI Systems Lab", href: "#lab" },
  { label: "Deep Dives", href: "#deep-dives" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
] as const;

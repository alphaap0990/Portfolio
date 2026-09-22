/**
 * Engineering deep dives. Each starts as a structured outline (status: "outline")
 * so the page demonstrates thinking without pretending to be a finished essay.
 * When an article is written, add `body` (paragraphs) and set status: "published".
 */

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  status: "outline" | "published";
  outline: { heading: string; points: string[] }[];
  body?: string[];
};

export const articles: Article[] = [
  {
    slug: "designing-a-production-rag-system",
    title: "How I Would Design a Production RAG System",
    excerpt:
      "From chunking and hybrid retrieval to reranking, guardrails and evaluation: the components that separate a demo from a system.",
    tags: ["RAG", "Architecture", "Evaluation"],
    status: "outline",
    outline: [
      {
        heading: "Start from the failure modes",
        points: ["Unsupported answers, stale sources, and missed exact terms", "What 'good' means: define the evaluation set before the architecture"],
      },
      {
        heading: "Ingestion and chunking",
        points: ["Structure-aware chunking and metadata", "Refresh paths so the index never drifts from the source"],
      },
      {
        heading: "Retrieval and reranking",
        points: ["Dense + lexical retrieval, fusion, and a cross-encoder on the shortlist", "Latency and token cost as explicit budgets"],
      },
      {
        heading: "Generation, guardrails and evaluation",
        points: ["Grounded prompts and programmatic output validation", "Offline evaluation (e.g. RAGAS, TruLens) plus a golden set and human review"],
      },
      {
        heading: "Operating it",
        points: ["Monitoring quality, latency and cost in production", "Privacy and compliance designed in from the start"],
      },
    ],
  },
  {
    slug: "dense-retrieval-vs-bm25",
    title: "Dense Retrieval vs BM25: Why Hybrid Search Matters",
    excerpt:
      "Semantic vectors and keyword ranking fail in different ways. Combining them, then reranking, covers both.",
    tags: ["Retrieval", "BM25", "Embeddings"],
    status: "outline",
    outline: [
      { heading: "How each one ranks", points: ["BM25: term frequency, inverse document frequency, length normalisation", "Dense: bi-encoder embeddings and nearest-neighbour search"] },
      { heading: "Where each fails", points: ["Dense can blur codes, acronyms and rare terms", "BM25 misses paraphrases and vocabulary mismatch"] },
      { heading: "Combining them", points: ["Reciprocal rank fusion versus score blending", "Why a reranker on the merged shortlist is the finishing step"] },
      { heading: "Measuring the gain", points: ["Recall@k and precision on a labelled query set", "Query-type breakdowns: exact-term vs conceptual"] },
    ],
  },
  {
    slug: "qlora-fine-tuning",
    title: "QLoRA: Fine-Tuning Large Models with Limited GPU Memory",
    excerpt:
      "How 4-bit quantization and low-rank adapters make 7–8B model fine-tuning practical, and how to evaluate the result.",
    tags: ["LLM", "PEFT", "QLoRA"],
    status: "outline",
    outline: [
      { heading: "Why full fine-tuning is expensive", points: ["Weights, gradients and optimizer state all live in GPU memory"] },
      { heading: "LoRA in one page", points: ["Freeze the base model, train low-rank update matrices", "Choosing rank and target modules"] },
      { heading: "What QLoRA adds", points: ["4-bit NF4 base weights, double quantization, paged optimizers"] },
      { heading: "Evaluating the tuned model", points: ["Held-out task metrics as a promotion gate", "Merging adapters versus serving them separately"] },
    ],
  },
  {
    slug: "low-latency-llm-inference",
    title: "Designing Low-Latency LLM Inference Pipelines",
    excerpt:
      "Where the milliseconds go in an LLM application, and the design levers for cutting them without hurting quality.",
    tags: ["LLM", "Latency", "Serving"],
    status: "outline",
    outline: [
      { heading: "Build a latency budget", points: ["Retrieval, rerank, prompt size, time-to-first-token and generation length"] },
      { heading: "Cut work before optimising work", points: ["Tighter context, caching, and smaller models where quality allows"] },
      { heading: "Serving-side levers", points: ["Batching, quantization and inference engines such as vLLM", "Streaming to improve perceived latency"] },
      { heading: "Measure the right thing", points: ["P50 versus P95/P99, and tracking cost alongside latency"] },
    ],
  },
  {
    slug: "production-ready-ml-model",
    title: "What Makes an ML Model Production-Ready?",
    excerpt:
      "A checklist that goes beyond accuracy: reproducibility, testing, serving contracts, monitoring and a plan for retraining.",
    tags: ["MLOps", "Production", "Monitoring"],
    status: "outline",
    outline: [
      { heading: "Reproducible", points: ["Versioned data, code and environment; tracked experiments"] },
      { heading: "Tested", points: ["Unit tests, data validation and CI gates for model code"] },
      { heading: "Served well", points: ["Latency budget, schema contracts, explainability where required"] },
      { heading: "Observable and maintainable", points: ["Monitoring, drift detection and an automated retraining path"] },
    ],
  },
];

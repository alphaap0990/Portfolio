/**
 * Content rules
 *  - Metrics and technologies come from the resume only.
 *  - `details` on diagram nodes describe *why the component exists in this kind of
 *    architecture* (engineering rationale). They are not claims about outcomes.
 *  - Enterprise projects are proprietary: no `repo`. Add `repo` / `demo` to any
 *    project below to show the link on its card.
 *  - Portfolio projects are labelled as such and never presented as employment.
 */

export type NodeDetail = {
  purpose: string;
  technology?: string;
  why?: string;
  tradeoffs?: string;
};

export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
  detail?: NodeDetail;
};

/** A stage is one step in the flow; multiple nodes in a stage run in parallel. */
export type Stage = DiagramNode[];

export type ProjectKind = "professional" | "portfolio";

export type Project = {
  slug: string;
  index: string;
  kind: ProjectKind;
  context: string;
  title: string;
  summary: string;
  impact: { value: string; label: string }[];
  problem: string;
  challenge: string;
  solution: string;
  stack: string[];
  stages: Stage[];
  variant?: "workflow" | "search";
  highlights?: string[];
  deepDive: {
    architecture: string[];
    choices: string[];
    tradeoffs: string[];
    implementation: string[];
    evaluation: string[];
    production: string[];
  };
  repo?: string;
  demo?: string;
};

const n = (id: string, label: string, sub?: string, detail?: NodeDetail): DiagramNode => ({
  id,
  label,
  sub,
  detail,
});

export const projects: Project[] = [
  /* ───────────────────────── 1 · Clinical RAG ───────────────────────── */
  {
    slug: "clinical-rag",
    index: "01",
    kind: "professional",
    context: "Professional Experience · UnitedHealthcare",
    title: "Clinical Intelligence RAG Platform",
    summary:
      "An enterprise Retrieval-Augmented Generation system designed to query large-scale CMS clinical guidelines using AWS Bedrock and Claude.",
    impact: [
      { value: "400K+", label: "pages" },
      { value: "92%", label: "latency reduction" },
      { value: "42%", label: "token / cost reduction" },
      { value: "31%", label: "retrieval accuracy gain" },
    ],
    problem:
      "Answers need to come from a very large body of CMS clinical guidelines, and they must stay traceable to the source text.",
    challenge:
      "Retrieval quality, end-to-end latency and token cost pull against each other at this corpus size, while every answer has to remain grounded.",
    solution:
      "Hybrid retrieval (dense vectors + BM25) feeds a Cohere reranker, then Claude 3.5 Sonnet on Bedrock. Output passes through Guardrails AI, and the whole pipeline is scored with RAGAS and TruLens.",
    stack: [
      "AWS Bedrock",
      "Claude 3.5 Sonnet",
      "LangChain",
      "Titan Embeddings V2",
      "BM25",
      "Qdrant",
      "Cohere Rerank",
      "Guardrails AI",
      "RAGAS",
      "TruLens",
    ],
    stages: [
      [
        n("src", "CMS Guidelines", "source corpus", {
          purpose: "The authoritative corpus: 400K+ pages of CMS clinical guidance.",
          why: "Grounding answers in a fixed, citable source is what makes the system defensible in a clinical setting.",
          tradeoffs: "Guidelines change; the index needs a refresh path so stale guidance is never served.",
        }),
      ],
      [
        n("proc", "Document Processing", "parse · clean · chunk", {
          purpose: "Turns raw guideline documents into clean, structured chunks with metadata.",
          why: "Retrieval quality is capped by chunk quality. Chunks that respect document structure retrieve better than fixed-size splits.",
          tradeoffs: "Small chunks are precise but lose surrounding context; large chunks keep context but dilute relevance and cost more tokens.",
        }),
      ],
      [
        n("emb", "Embeddings", "Titan Embeddings V2", {
          purpose: "Maps each chunk and each query into the same dense vector space.",
          technology: "Amazon Titan Text Embeddings V2 via AWS Bedrock.",
          why: "Finds passages by meaning, including paraphrases and synonyms that keyword search misses. Keeps the stack inside AWS.",
          tradeoffs: "Dense vectors can blur exact identifiers; switching embedding models means re-embedding the whole corpus.",
        }),
      ],
      [
        n("vec", "Vector Search", "Qdrant", {
          purpose: "Approximate nearest-neighbour search over chunk embeddings.",
          technology: "Qdrant vector database.",
          why: "Semantic recall over a very large corpus at interactive latency, with room for metadata filtering.",
          tradeoffs: "ANN trades a little recall for speed, and a vector store is one more system to operate and keep in sync with the source.",
        }),
        n("bm25", "BM25", "lexical retrieval", {
          purpose: "Keyword-based retrieval that ranks on exact term matches.",
          technology: "BM25 ranking.",
          why: "Clinical text is full of exact terminology, codes and acronyms. Lexical matching catches what embeddings can blur.",
          tradeoffs: "No semantic understanding, so it misses paraphrases. That gap is why it is paired with dense search rather than used alone.",
        }),
      ],
      [
        n("rerank", "Cohere Reranking", "cross-encoder", {
          purpose: "Re-scores the merged candidate set against the query before anything reaches the LLM.",
          technology: "Cohere Rerank.",
          why: "Reads query and passage together, so it is far more precise than vector similarity. A short, well-ordered context also means fewer tokens sent to the LLM.",
          tradeoffs: "Adds a model call to the latency path. Candidate-set size trades recall against latency.",
        }),
      ],
      [
        n("llm", "Claude 3.5 Sonnet", "AWS Bedrock", {
          purpose: "Synthesizes an answer from the reranked passages.",
          technology: "Claude 3.5 Sonnet on AWS Bedrock, orchestrated with LangChain.",
          why: "Strong instruction-following and long-context reading; Bedrock keeps inference inside the AWS boundary.",
          tradeoffs: "Grounding is instructed, not guaranteed, so generation is followed by validation and evaluated continuously.",
        }),
      ],
      [
        n("guard", "Guardrails", "Guardrails AI", {
          purpose: "Validates model output before it is returned.",
          technology: "Guardrails AI.",
          why: "Responsible-AI controls belong in the architecture, not in a prompt. Output is checked programmatically.",
          tradeoffs: "Adds latency and can reject valid answers if rules are too strict, so rules need tuning against evaluation data.",
        }),
      ],
      [
        n("resp", "Clinical Response", "grounded answer", {
          purpose: "The final answer returned to the caller.",
          why: "Grounded, validated output is the only thing that leaves the system.",
        }),
      ],
    ],
    deepDive: {
      architecture: [
        "Offline: ingest → process → embed → index.",
        "Online: query embedding, then dense and BM25 retrieval in parallel, rerank, generate, validate, respond.",
      ],
      choices: [
        "Hybrid retrieval, so semantic and exact-term matching are both covered.",
        "A reranker between retrieval and generation to spend LLM tokens only on the best evidence.",
        "Bedrock for model access, keeping inference within AWS.",
      ],
      tradeoffs: [
        "Two retrievers and a reranker cost more to operate than one vector search. The retrieval-accuracy and token gains are why that is worth it.",
        "Guardrails add latency and need tuning against real evaluation data.",
      ],
      implementation: [
        "Pipeline orchestrated with LangChain against Bedrock-hosted models.",
        "Dense vectors in Qdrant alongside a BM25 lexical path.",
      ],
      evaluation: [
        "RAGAS for retrieval and answer-quality metrics.",
        "TruLens for tracing and feedback-function evaluation.",
      ],
      production: [
        "Latency and token cost are tracked as first-class metrics: 92% latency reduction, 42% token/cost reduction.",
        "Privacy and compliance constraints shape the architecture from the start.",
      ],
    },
  },

  /* ───────────────────────── 2 · Fine-tuning ───────────────────────── */
  {
    slug: "llm-fine-tuning",
    index: "02",
    kind: "professional",
    context: "Professional Experience · UnitedHealthcare",
    title: "Parameter-Efficient LLM Fine-Tuning Pipeline",
    summary:
      "Fine-tuning pipeline for domain-specific prior-authorization summaries using parameter-efficient techniques.",
    impact: [
      { value: "45K", label: "summaries" },
      { value: "27%", label: "medical-necessity extraction accuracy gain" },
    ],
    highlights: ["PEFT", "LoRA", "QLoRA", "4-bit quantization", "Hugging Face", "SageMaker", "Model evaluation"],
    problem:
      "Prior-authorization summaries call for accurate extraction of medical-necessity criteria in a very specific domain.",
    challenge:
      "Full fine-tuning of 7–8B-parameter models needs far more GPU memory than is practical, so the training method had to be memory-efficient.",
    solution:
      "QLoRA on LLaMA 3.1 8B and Mistral 7B: 4-bit quantized base weights via bitsandbytes with trainable low-rank adapters, trained on AWS SageMaker and gated by evaluation before serving.",
    stack: ["LLaMA 3.1 8B", "Mistral 7B", "PEFT", "LoRA", "QLoRA", "bitsandbytes", "Hugging Face", "AWS SageMaker"],
    stages: [
      [
        n("llama", "LLaMA 3.1 8B", "base model", {
          purpose: "Candidate base model, kept frozen while adapters are trained.",
        }),
        n("mistral", "Mistral 7B", "base model", {
          purpose: "Second candidate base model, so results can be compared across model families.",
        }),
      ],
      [
        n("qlora", "QLoRA", "PEFT", {
          purpose: "Trains small low-rank adapter matrices instead of updating all model weights.",
          why: "Cuts trainable parameters and memory dramatically compared with full fine-tuning.",
        }),
      ],
      [
        n("q4", "4-bit Quantization", "memory footprint", {
          purpose: "Stores the frozen base weights in 4-bit precision.",
          why: "Lets 7–8B models be fine-tuned within limited GPU memory.",
        }),
      ],
      [
        n("bnb", "bitsandbytes", "quantization kernels", {
          purpose: "Provides the 4-bit quantization and memory-efficient optimizer support.",
        }),
      ],
      [
        n("sm", "AWS SageMaker", "training jobs", {
          purpose: "Runs training as managed, repeatable jobs on GPU instances.",
        }),
      ],
      [
        n("eval", "Evaluation", "accuracy on held-out data", {
          purpose: "Measures extraction accuracy before a model is promoted.",
          why: "The 27% medical-necessity extraction improvement is an evaluation result, so evaluation is the gate, not an afterthought.",
        }),
      ],
      [
        n("prod", "Production Inference", "serving", {
          purpose: "Serves the tuned model to downstream summary workflows.",
        }),
      ],
    ],
    deepDive: {
      architecture: [
        "Frozen 4-bit base model plus trainable LoRA adapters.",
        "Training on SageMaker, evaluation as a promotion gate, then production inference.",
      ],
      choices: [
        "QLoRA over full fine-tuning: a fraction of the memory for the same target task.",
        "Two base models compared instead of assuming one.",
      ],
      tradeoffs: [
        "Quantization can cost a little precision. Evaluation on held-out data is what shows whether that matters for the task.",
        "Adapters are cheap to train and store, but a merged model or an adapter-aware server is needed at inference time.",
      ],
      implementation: [
        "Hugging Face ecosystem (PEFT, bitsandbytes) driving SageMaker training jobs.",
        "Dataset of 45K prior-authorization summaries.",
      ],
      evaluation: ["27% improvement in medical-necessity extraction accuracy."],
      production: ["Repeatable SageMaker jobs, evaluation-gated releases, and a defined path to production inference."],
    },
  },

  /* ───────────────────────── 3 · Agentic ───────────────────────── */
  {
    slug: "agentic-validation",
    index: "03",
    kind: "professional",
    context: "Professional Experience · UnitedHealthcare",
    title: "Agentic Clinical Validation Workflow",
    summary:
      "A LangGraph-based workflow that automates multi-step prior-authorization validation while retaining human review where required.",
    impact: [{ value: "3 days → <4 hrs", label: "end-to-end turnaround" }],
    highlights: ["LangGraph", "LangChain", "LLMs", "RAG", "Guardrails", "Human-in-the-loop"],
    variant: "workflow",
    problem:
      "Prior-authorization validation is a multi-step process that used to take days end to end.",
    challenge:
      "Automating steps with LLMs is only acceptable if the process stays controllable: deterministic control flow, guardrails and a human decision where one is required.",
    solution:
      "A graph of single-purpose nodes (policy retrieval, clinical validation, medical-necessity check, policy validation) with an explicit decision step that routes to a human reviewer when required.",
    stack: ["LangGraph", "LangChain", "LLMs", "RAG", "Guardrails", "Human-in-the-loop"],
    stages: [
      [n("in", "Input", "request", { purpose: "Incoming request enters the graph as structured state." })],
      [n("pol", "Policy Retrieval", "RAG", { purpose: "Retrieves the policy text relevant to the request." })],
      [n("clin", "Clinical Validation", "LLM node", { purpose: "Checks clinical information against the retrieved criteria." })],
      [n("med", "Medical Necessity Check", "LLM node", { purpose: "Assesses whether medical-necessity criteria are met." })],
      [n("pval", "Policy Validation", "LLM node", { purpose: "Confirms the outcome is consistent with the applicable policy." })],
      [n("dec", "Decision / Human Review", "conditional edge", { purpose: "Routes the case: proceed, or escalate to a human reviewer." })],
    ],
    deepDive: {
      architecture: [
        "A graph of narrowly scoped nodes sharing typed state, with a conditional edge at the end.",
        "Retrieval-backed nodes ground each step in policy text.",
      ],
      choices: [
        "LangGraph for explicit, inspectable control flow instead of one large free-form agent.",
        "Guardrails around node outputs.",
        "Human-in-the-loop as a first-class outcome, not an error path.",
      ],
      tradeoffs: [
        "More nodes mean more model calls, but each check is small enough to evaluate on its own.",
        "Routing to human review lowers full automation and raises accountability, which is the right trade for this domain.",
      ],
      implementation: ["LangGraph and LangChain orchestrating RAG and LLM nodes."],
      evaluation: ["Turnaround improved from 3 days to under 4 hours while retaining human review where required."],
      production: ["Guardrails on outputs and an explicit human decision point."],
    },
  },

  /* ───────────────────────── 4 · Claims risk ───────────────────────── */
  {
    slug: "claims-risk",
    index: "04",
    kind: "professional",
    context: "Professional Experience · UnitedHealthcare",
    title: "Large-Scale Claims Risk Prediction",
    summary:
      "Gradient-boosted risk models trained on 12M+ claims, served through a FastAPI real-time inference endpoint.",
    impact: [
      { value: "12M+", label: "claims" },
      { value: "0.89", label: "ROC-AUC" },
      { value: "<80ms", label: "P99 inference" },
    ],
    highlights: ["TreeSHAP", "Integrated Gradients"],
    problem: "Risk scoring across a very large claims history needs to be both accurate and fast enough to use inline.",
    challenge:
      "Combining data-processing scale (millions of rows, multi-TB) with a strict real-time latency budget at serving time.",
    solution:
      "PySpark/Databricks feature engineering, LightGBM/XGBoost models with explainability (TreeSHAP, Integrated Gradients), served via FastAPI.",
    stack: ["PySpark", "Databricks", "LightGBM", "XGBoost", "TreeSHAP", "Integrated Gradients", "FastAPI"],
    stages: [
      [n("claims", "Claims Data", "12M+ claims", { purpose: "Historical claims used for training and evaluation." })],
      [n("spark", "PySpark / Databricks", "distributed processing", { purpose: "Processes claims data at scale." })],
      [n("fe", "Feature Engineering", "features", { purpose: "Builds model-ready features from raw claims." })],
      [n("gbm", "LightGBM / XGBoost", "gradient boosting", { purpose: "Strong tabular baselines that train quickly and serve at low latency." })],
      [n("ev", "Model Evaluation", "ROC-AUC 0.89", { purpose: "Validates discrimination and stability before release." })],
      [n("api", "FastAPI", "serving layer", { purpose: "Exposes the model as a low-latency HTTP endpoint." })],
      [n("rt", "Real-Time Inference", "<80ms P99", { purpose: "Scoring requests within the latency budget." })],
    ],
    deepDive: {
      architecture: ["Distributed feature engineering, gradient-boosted models, then a FastAPI serving layer."],
      choices: [
        "Gradient boosting for tabular claims data: strong accuracy with low inference cost.",
        "Explainability built in: TreeSHAP for tree models, Integrated Gradients for neural models.",
      ],
      tradeoffs: [
        "Explanations add compute, so they are separated from the hot scoring path when latency demands it.",
      ],
      implementation: ["PySpark on Databricks for scale; FastAPI for serving."],
      evaluation: ["0.89 ROC-AUC on model evaluation."],
      production: ["<80ms P99 inference latency on the real-time endpoint."],
    },
  },

  /* ───────────────────────── 5 · MLOps ───────────────────────── */
  {
    slug: "mlops-platform",
    index: "05",
    kind: "professional",
    context: "Professional Experience · UnitedHealthcare",
    title: "End-to-End MLOps Platform",
    summary:
      "Automated training, CI/CD, monitoring, drift detection and retraining on AWS, so models are released and maintained like software.",
    impact: [],
    highlights: ["Automated training", "CI/CD", "Model monitoring", "Drift detection", "Retraining pipelines"],
    problem: "Models degrade and drift; without automation, releases are manual and monitoring is an afterthought.",
    challenge: "Make the whole lifecycle repeatable: reproducible training, tested releases, live monitoring and a route back to retraining.",
    solution:
      "MLflow-tracked training, SageMaker and containerized deployment on EKS, GitHub Actions CI/CD gated by Pytest, Ruff and Black, CloudWatch monitoring and Evidently AI drift detection triggering retraining.",
    stack: ["AWS", "SageMaker", "MLflow", "Docker", "EKS", "GitHub Actions", "Pytest", "Ruff", "Black", "CloudWatch", "Evidently AI"],
    stages: [
      [n("data", "Data", undefined, { purpose: "Versioned source data for training." })],
      [n("fe", "Feature Engineering", undefined, { purpose: "Reproducible feature pipelines." })],
      [n("train", "Model Training", undefined, { purpose: "Automated training runs." })],
      [n("mlflow", "MLflow", "tracking · registry", { purpose: "Tracks experiments and versions candidate models." })],
      [n("sm", "SageMaker", undefined, { purpose: "Managed training and hosting on AWS." })],
      [n("docker", "Docker", undefined, { purpose: "Packages the model service for consistent deployment." })],
      [n("eks", "EKS", undefined, { purpose: "Runs containerized model services on Kubernetes." })],
      [n("cicd", "CI/CD", "GitHub Actions", { purpose: "Tests (Pytest), lints (Ruff, Black) and ships every change automatically." })],
      [n("cw", "CloudWatch", "monitoring", { purpose: "Operational metrics and alerting for live models." })],
      [n("drift", "Drift Detection", "Evidently AI", { purpose: "Detects when live data or predictions move away from training." })],
      [n("retrain", "Retraining", undefined, { purpose: "Drift signals trigger retraining, closing the loop." })],
    ],
    deepDive: {
      architecture: ["A closed loop: train → track → release → monitor → detect drift → retrain."],
      choices: [
        "MLflow for experiment tracking and versioning.",
        "GitHub Actions with Pytest, Ruff and Black so model code meets the same quality bar as any software.",
        "Evidently AI for drift detection and CloudWatch for operational monitoring.",
      ],
      tradeoffs: ["Automation lowers release risk but needs investment in tests and monitoring thresholds up front."],
      implementation: ["Containerized services on EKS and SageMaker; CI/CD on GitHub Actions."],
      evaluation: ["Models are evaluated before release and monitored after it."],
      production: ["Monitoring, drift detection and retraining pipelines keep deployed models healthy."],
    },
  },

  /* ───────────────────────── 6 · Semantic search (portfolio) ───────────────────────── */
  {
    slug: "semantic-search",
    index: "06",
    kind: "portfolio",
    context: "Portfolio Project",
    title: "Semantic Search / RAG Application",
    summary:
      "A hands-on retrieval project: documents are chunked, embedded and indexed, then searched by meaning.",
    impact: [],
    variant: "search",
    problem: "Keyword search fails when the query and the document use different words for the same idea.",
    challenge: "Build the retrieval pipeline end to end and keep it simple enough to inspect and evaluate.",
    solution:
      "LangChain chunks and embeds documents with OpenAI Embeddings, FAISS holds the index, and a FastAPI or Streamlit front end serves ranked results.",
    stack: ["LangChain", "OpenAI Embeddings", "FAISS", "Python", "FastAPI", "Streamlit"],
    stages: [
      [n("docs", "Documents", undefined, { purpose: "Source text to be searched." })],
      [n("chunk", "Chunking", "LangChain", { purpose: "Splits documents into retrievable passages." })],
      [n("emb", "OpenAI Embeddings", undefined, { purpose: "Converts passages and queries into vectors." })],
      [n("faiss", "FAISS Index", undefined, { purpose: "In-process similarity search over the vectors." })],
      [n("sim", "Similarity Search", "top-k", { purpose: "Finds the passages closest in meaning to the query." })],
      [n("ui", "Ranked Results", "FastAPI / Streamlit", { purpose: "Returns ranked passages to the user." })],
    ],
    deepDive: {
      architecture: ["Chunk → embed → index → query → top-k."],
      choices: ["FAISS for a lightweight, in-process index that is easy to reason about."],
      tradeoffs: ["FAISS is a library, not a database: persistence and metadata filtering are yours to build."],
      implementation: ["Python with LangChain, OpenAI Embeddings and FAISS."],
      evaluation: ["Inspect retrieved passages against known-relevant documents."],
      production: ["Would move to a managed vector store, add hybrid retrieval and reranking, and add automated evaluation."],
    },
    // Point this at the actual repository once it is pushed; until then the button stays inert
    // (linking a project's "GitHub" button at the profile would imply a repo that does not exist).
    repo: "[INSERT SEMANTIC SEARCH REPO URL]",
  },
];

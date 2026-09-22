import type { Stage } from "./projects";

/**
 * AI Systems Lab — conceptual reference architectures.
 * These explain the reasoning behind design choices. They are NOT descriptions of any
 * single employer system; the tools named are examples of common choices.
 */

export type LabDiagram = {
  id: string;
  label: string;
  blurb: string;
  cols: number;
  loop?: string;
  stages: Stage[];
};

export const labDiagrams: LabDiagram[] = [
  {
    id: "rag",
    label: "RAG pipeline",
    blurb: "Hybrid retrieval, reranking, grounded generation, and evaluation.",
    cols: 4,
    stages: [
      [
        {
          id: "chunk",
          label: "Ingestion & Chunking",
          sub: "parse · split",
          detail: {
            purpose: "Turn raw documents into clean, retrievable units with metadata.",
            technology: "Document parsers and text splitters (e.g. LangChain, LlamaIndex).",
            why: "Retrieval quality is capped by chunk quality. Structure-aware chunks keep a passage's meaning intact.",
            tradeoffs: "Small chunks are precise but lose context; large chunks keep context but dilute relevance and cost more tokens.",
          },
        },
      ],
      [
        {
          id: "embed",
          label: "Embedding Model",
          sub: "text → vectors",
          detail: {
            purpose: "Map text into dense vectors where nearby points mean similar things.",
            technology: "Bedrock Titan Embeddings, OpenAI embeddings.",
            why: "Captures semantic similarity, so paraphrases and synonyms still match.",
            tradeoffs: "Vectors are opaque and can blur exact identifiers. Changing the model means re-embedding the corpus.",
          },
        },
      ],
      [
        {
          id: "vector",
          label: "Vector DB · Dense Retrieval",
          sub: "Qdrant · FAISS · pgvector",
          detail: {
            purpose: "Dense retrieval: approximate nearest-neighbour search over embeddings, with metadata filters.",
            technology: "Qdrant, Pinecone, FAISS, pgvector.",
            why: "Exact k-NN does not scale. ANN indexes return semantically close chunks in milliseconds.",
            tradeoffs: "ANN trades recall for speed. FAISS is a library (you build persistence and filtering); managed stores add cost; pgvector keeps data in Postgres but is less specialised at large scale.",
          },
        },
        {
          id: "bm25",
          label: "BM25",
          sub: "keyword retrieval",
          detail: {
            purpose: "Keyword-based retrieval, useful for exact terminology and domain-specific terms.",
            technology: "BM25 ranking over an inverted index.",
            why: "Codes, acronyms and rare terms are matched exactly, where dense vectors can miss them.",
            tradeoffs: "No semantic understanding: vocabulary mismatch means paraphrases are missed. Best used alongside dense retrieval.",
          },
        },
      ],
      [
        {
          id: "fuse",
          label: "Candidate Fusion",
          sub: "e.g. reciprocal rank",
          detail: {
            purpose: "Merge the dense and lexical candidate lists into one ranked shortlist.",
            technology: "Reciprocal Rank Fusion or weighted score blending.",
            why: "The two retrievers score on different scales; rank-based fusion combines them without calibration.",
            tradeoffs: "Fusion parameters need tuning on labelled queries, and the merged list is still only as good as its inputs.",
          },
        },
      ],
      [
        {
          id: "rerank",
          label: "Reranking",
          sub: "cross-encoder",
          detail: {
            purpose: "Improves relevance of retrieved candidates before sending context to the LLM.",
            technology: "Cross-encoder rerankers such as Cohere Rerank.",
            why: "Scoring query and passage together is more accurate than comparing vectors, and cheap enough on a shortlist. A tighter context also saves tokens.",
            tradeoffs: "Adds latency and per-call cost. The shortlist size trades recall against speed.",
          },
        },
      ],
      [
        {
          id: "llm",
          label: "LLM Generation",
          sub: "grounded answer",
          detail: {
            purpose: "Write an answer using only the supplied context.",
            technology: "Claude via AWS Bedrock, OpenAI API, LLaMA served with vLLM.",
            why: "The model reasons over evidence instead of relying on memory, which reduces unsupported claims.",
            tradeoffs: "Longer context costs more and is slower. Grounding is instructed, not guaranteed, so it must be validated.",
          },
        },
      ],
      [
        {
          id: "guard",
          label: "Guardrails",
          sub: "validate output",
          detail: {
            purpose: "Check output against policy, format and grounding rules before returning it.",
            technology: "Guardrails AI.",
            why: "Safety and compliance rules should be enforced in code, not only requested in a prompt.",
            tradeoffs: "Adds latency, and overly strict rules reject good answers. Tune against evaluation data.",
          },
        },
      ],
      [
        {
          id: "eval",
          label: "Evaluation",
          sub: "RAGAS · TruLens",
          detail: {
            purpose: "Measure retrieval quality and answer faithfulness continuously.",
            technology: "RAGAS, TruLens, plus a labelled golden set.",
            why: "Evaluation is a first-class component: without it, changes to chunking, retrieval or prompts cannot be compared.",
            tradeoffs: "LLM-judged metrics carry variance and bias, so pair them with a curated test set and human review.",
          },
        },
      ],
    ],
  },
  {
    id: "agentic",
    label: "Agentic workflow",
    blurb: "A LangGraph-style graph with typed state, validation nodes and a human decision.",
    cols: 6,
    stages: [
      [
        {
          id: "state",
          label: "Input & State",
          sub: "typed graph state",
          detail: {
            purpose: "Carry the request and every intermediate result in one explicit state object.",
            technology: "LangGraph state schema.",
            why: "Explicit state makes each run inspectable and resumable, which matters for audit and debugging.",
            tradeoffs: "State can grow large, and schema changes need care when runs are long-lived.",
          },
        },
      ],
      [
        {
          id: "retrieve",
          label: "Retrieval Tool",
          sub: "RAG over policy",
          detail: {
            purpose: "Pull the policy or reference text a later step must check against.",
            technology: "RAG retrieval exposed as a graph node.",
            why: "Grounding each step in source text keeps decisions traceable.",
            tradeoffs: "Each retrieval adds latency, and retrieval errors propagate downstream, so retrieval needs its own evaluation.",
          },
        },
      ],
      [
        {
          id: "validate",
          label: "Validation Nodes",
          sub: "single-purpose checks",
          detail: {
            purpose: "Small nodes that each verify one thing (e.g. clinical facts, necessity, policy).",
            technology: "LangChain runnables calling LLMs with structured output.",
            why: "Narrow checks are easier to prompt, test and evaluate than one large prompt doing everything.",
            tradeoffs: "More LLM calls raise cost and latency. Run independent checks in parallel where possible.",
          },
        },
      ],
      [
        {
          id: "guard",
          label: "Guardrails",
          sub: "validate node output",
          detail: {
            purpose: "Validate each node's structured output before the graph continues.",
            technology: "Guardrails AI, schema validation.",
            why: "Catching a malformed or out-of-policy result early stops errors compounding across steps.",
            tradeoffs: "Retries on validation failure add latency and need a bounded retry policy.",
          },
        },
      ],
      [
        {
          id: "edge",
          label: "Conditional Edge",
          sub: "route on confidence",
          detail: {
            purpose: "Deterministically choose the next path from the state (e.g. proceed vs. escalate).",
            technology: "LangGraph conditional edges.",
            why: "Control flow stays in code, so behavior is predictable and testable instead of left to a free-running agent.",
            tradeoffs: "Thresholds need calibration on real cases; too strict floods reviewers, too loose misses cases.",
          },
        },
      ],
      [
        {
          id: "human",
          label: "Human Review",
          sub: "human-in-the-loop",
          detail: {
            purpose: "Pause the graph so a person can review and decide where judgement is required.",
            technology: "Graph interrupts with checkpointed state.",
            why: "In high-stakes domains accountability sits with a person. The workflow prepares the decision, it does not replace the reviewer.",
            tradeoffs: "Human throughput becomes a bottleneck. The reviewer needs the evidence in front of them to stay fast.",
          },
        },
      ],
    ],
  },
  {
    id: "finetune",
    label: "LLM fine-tuning",
    blurb: "QLoRA: 4-bit frozen base weights plus small trainable adapters.",
    cols: 6,
    stages: [
      [
        {
          id: "data",
          label: "Dataset Curation",
          sub: "task-specific examples",
          detail: {
            purpose: "Assemble and clean instruction/response pairs for the target task.",
            technology: "Hugging Face datasets.",
            why: "Fine-tuning quality is dominated by data quality and by how well it matches the target task.",
            tradeoffs: "Curation is slow and manual; noisy labels teach the model the noise.",
          },
        },
      ],
      [
        {
          id: "base",
          label: "Base Model",
          sub: "LLaMA · Mistral",
          detail: {
            purpose: "The pretrained model whose weights stay frozen.",
            technology: "LLaMA 3.1 8B, Mistral 7B via Hugging Face Transformers.",
            why: "Starting from a strong open model transfers general language ability, so only the domain gap must be learned.",
            tradeoffs: "Bigger models are more capable but cost more to train and serve. Check licence terms for the intended use.",
          },
        },
      ],
      [
        {
          id: "quant",
          label: "4-bit Quantization",
          sub: "bitsandbytes",
          detail: {
            purpose: "Store frozen base weights in 4-bit precision to cut GPU memory.",
            technology: "bitsandbytes (NF4).",
            why: "Makes 7–8B models trainable on limited GPU memory.",
            tradeoffs: "Some precision is lost; measure the effect on the task instead of assuming it is negligible.",
          },
        },
      ],
      [
        {
          id: "lora",
          label: "LoRA Adapters",
          sub: "PEFT",
          detail: {
            purpose: "Train small low-rank matrices added to selected layers; base weights are untouched.",
            technology: "PEFT / LoRA.",
            why: "A tiny fraction of parameters is trained, so memory and compute drop and adapters are cheap to store and swap.",
            tradeoffs: "Rank and target-module choices affect capacity. Very large behavior shifts may need more than a low-rank update.",
          },
        },
      ],
      [
        {
          id: "train",
          label: "Training Job",
          sub: "AWS SageMaker",
          detail: {
            purpose: "Run training as a managed, repeatable job on GPU instances.",
            technology: "AWS SageMaker training jobs.",
            why: "Reproducible, tracked runs replace one-off notebook sessions.",
            tradeoffs: "GPU instances cost money while they run. Checkpointing and early stopping keep spend in check.",
          },
        },
      ],
      [
        {
          id: "eval",
          label: "Evaluation & Serve",
          sub: "gate → inference",
          detail: {
            purpose: "Score the tuned model on held-out data and promote it only if it clears the bar.",
            technology: "Task metrics on a held-out set; vLLM or SageMaker endpoints for serving.",
            why: "An evaluation gate turns fine-tuning into an engineering process with a pass/fail, not a hunch.",
            tradeoffs: "A held-out set can leak or drift from production data, so refresh it and spot-check with human review.",
          },
        },
      ],
    ],
  },
  {
    id: "inference",
    label: "ML inference",
    blurb: "A latency-budgeted real-time scoring service with explainability and telemetry.",
    cols: 6,
    stages: [
      [
        {
          id: "req",
          label: "Client Request",
          sub: "REST",
          detail: {
            purpose: "A caller sends features or identifiers to score.",
            technology: "REST APIs.",
            why: "A simple, well-understood contract lets many systems integrate.",
            tradeoffs: "Synchronous calls put inference directly on the caller's latency path.",
          },
        },
      ],
      [
        {
          id: "api",
          label: "API Service",
          sub: "FastAPI · Uvicorn",
          detail: {
            purpose: "Validate input, call the model and shape the response.",
            technology: "FastAPI on Uvicorn, containerised with Docker.",
            why: "Async Python with schema validation gives low overhead and clear request contracts.",
            tradeoffs: "Python concurrency limits mean scaling out replicas and loading the model once at startup, not per request.",
          },
        },
      ],
      [
        {
          id: "features",
          label: "Feature Assembly",
          sub: "same logic as training",
          detail: {
            purpose: "Build the exact feature vector the model was trained on.",
            technology: "Shared feature code or a feature store.",
            why: "Training/serving skew is a classic silent failure. Reusing the same logic prevents it.",
            tradeoffs: "Lookups add latency, so precompute or cache where you can.",
          },
        },
      ],
      [
        {
          id: "model",
          label: "Model Runtime",
          sub: "LightGBM · XGBoost",
          detail: {
            purpose: "Score the features with the trained model.",
            technology: "LightGBM / XGBoost artifacts loaded in memory.",
            why: "Gradient-boosted trees give strong tabular accuracy with millisecond inference.",
            tradeoffs: "Bigger ensembles cost latency. Measure P99, not just the average.",
          },
        },
      ],
      [
        {
          id: "explain",
          label: "Explainability",
          sub: "TreeSHAP",
          detail: {
            purpose: "Attribute each prediction to the features that drove it.",
            technology: "TreeSHAP for tree models; Integrated Gradients for neural models.",
            why: "Reviewers and regulators want reasons, not just scores.",
            tradeoffs: "Explanations cost extra compute. Compute them on demand or off the hot path if the latency budget is tight.",
          },
        },
      ],
      [
        {
          id: "telemetry",
          label: "Response & Telemetry",
          sub: "CloudWatch",
          detail: {
            purpose: "Return the score and log latency, inputs and outputs for monitoring.",
            technology: "CloudWatch metrics and logs.",
            why: "What is not measured cannot be improved: latency percentiles and prediction distributions feed alerting and drift checks.",
            tradeoffs: "Logging inputs raises privacy obligations. Log only what monitoring needs, and protect it.",
          },
        },
      ],
    ],
  },
  {
    id: "mlops",
    label: "MLOps lifecycle",
    blurb: "A closed loop from data to retraining, with tests and monitoring in the path.",
    cols: 5,
    loop: "Drift signals feed back into Data & Training",
    stages: [
      [
        {
          id: "data",
          label: "Data & Features",
          sub: "versioned",
          detail: {
            purpose: "Produce versioned datasets and reproducible features.",
            technology: "PySpark / Databricks, S3, DVC.",
            why: "You cannot reproduce or debug a model without knowing exactly what data trained it.",
            tradeoffs: "Versioning adds storage and process overhead, but it is cheap next to an unreproducible model.",
          },
        },
      ],
      [
        {
          id: "train",
          label: "Training & Tracking",
          sub: "MLflow",
          detail: {
            purpose: "Run training and record parameters, metrics and artifacts for every run.",
            technology: "MLflow, Weights & Biases.",
            why: "Tracked experiments make results comparable and models promotable with evidence.",
            tradeoffs: "Tracking is only useful if teams log consistently. Standard templates help.",
          },
        },
      ],
      [
        {
          id: "ci",
          label: "CI / CD",
          sub: "GitHub Actions",
          detail: {
            purpose: "Test, lint and package every change automatically.",
            technology: "GitHub Actions, Pytest, Ruff, Black.",
            why: "Model code is production code, and automated checks keep releases boring.",
            tradeoffs: "Slow pipelines get bypassed, so keep the fast checks fast and run heavy ones on a schedule.",
          },
        },
      ],
      [
        {
          id: "deploy",
          label: "Deploy & Serve",
          sub: "Docker · SageMaker · EKS",
          detail: {
            purpose: "Ship the model as a containerized service or managed endpoint.",
            technology: "Docker, AWS SageMaker, EKS.",
            why: "Containers make environments identical from laptop to production, and managed platforms handle scaling.",
            tradeoffs: "Kubernetes gives control but adds operational load; SageMaker endpoints are simpler but less flexible.",
          },
        },
      ],
      [
        {
          id: "monitor",
          label: "Monitor & Drift",
          sub: "CloudWatch · Evidently AI",
          detail: {
            purpose: "Watch service health and detect data or prediction drift.",
            technology: "CloudWatch, Evidently AI.",
            why: "Models decay silently as the world changes. Drift monitoring is the trigger to retrain.",
            tradeoffs: "Drift statistics can over-alert. Tie thresholds to business impact, not just distribution distance.",
          },
        },
        {
          id: "retrain",
          label: "Retraining",
          sub: "automated pipeline",
          detail: {
            purpose: "Retrain and re-evaluate on fresh data, then promote through the same CI/CD gates.",
            technology: "Scheduled or drift-triggered pipelines.",
            why: "Closing the loop keeps models current without heroics.",
            tradeoffs: "Automatic retraining needs a strict evaluation gate so a worse model is never promoted.",
          },
        },
      ],
    ],
  },
];

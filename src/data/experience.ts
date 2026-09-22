/**
 * Experience content is intentionally limited to what the resume supports.
 * Inspire Infosol areas list the topics only; add specifics from the resume as needed
 * (each `detail` is a plain sentence describing the area, no invented metrics).
 */

export type ExperienceArea = {
  title: string;
  detail: string;
  tags: string[];
};

export type Role = {
  company: string;
  title: string;
  period: string;
  location: string;
  current?: boolean;
  summary: string;
  areas: ExperienceArea[];
};

export const experience: Role[] = [
  {
    company: "UnitedHealthcare",
    title: "AI/ML Engineer",
    period: "January 2025 – Present",
    location: "Horsham, PA",
    current: true,
    summary: "Production Generative AI and machine learning systems across healthcare.",
    areas: [
      {
        title: "Enterprise RAG",
        detail: "Clinical RAG over CMS guidelines: hybrid retrieval, reranking, Claude on Bedrock, and continuous evaluation.",
        tags: ["Bedrock", "Claude", "LangChain", "Qdrant", "BM25", "Cohere Rerank", "RAGAS", "TruLens"],
      },
      {
        title: "LLM fine-tuning",
        detail: "Parameter-efficient fine-tuning of LLaMA 3.1 8B and Mistral 7B on 45K prior-authorization summaries.",
        tags: ["QLoRA", "PEFT", "bitsandbytes", "SageMaker"],
      },
      {
        title: "Agentic AI",
        detail: "LangGraph workflow for multi-step clinical validation with human review, cutting turnaround from 3 days to under 4 hours.",
        tags: ["LangGraph", "LangChain", "Guardrails", "Human-in-the-loop"],
      },
      {
        title: "Claims prediction",
        detail: "Claims denial prediction, readmission risk and survival analysis; risk models on 12M+ claims served in real time.",
        tags: ["LightGBM", "XGBoost", "TreeSHAP", "FastAPI"],
      },
      {
        title: "Healthcare NLP",
        detail: "Biomedical language understanding for clinical text.",
        tags: ["BioBERT", "spaCy", "NER", "Transformers"],
      },
      {
        title: "MLOps",
        detail: "Automated training, CI/CD, model monitoring, drift detection and retraining.",
        tags: ["SageMaker", "MLflow", "Docker", "EKS", "GitHub Actions", "Evidently AI"],
      },
      {
        title: "Cloud infrastructure",
        detail: "AWS infrastructure for data, training and inference workloads.",
        tags: ["S3", "Lambda", "ECS", "EKS", "CloudWatch"],
      },
      {
        title: "Responsible AI",
        detail: "Guardrails, evaluation, explainability and human oversight built into the architecture; privacy and compliance by design.",
        tags: ["Guardrails AI", "TreeSHAP", "Integrated Gradients", "Human review"],
      },
    ],
  },
  {
    company: "Inspire Infosol Pvt Ltd.",
    title: "AI/ML Engineer",
    period: "February 2023 – December 2024",
    location: "Hyderabad, India",
    summary: "Applied machine learning across prediction, NLP, document AI and computer vision.",
    areas: [
      { title: "Churn prediction", detail: "Predictive modeling to identify customers likely to churn.", tags: ["Predictive modeling"] },
      { title: "Fraud detection", detail: "Machine learning models to flag fraudulent activity.", tags: ["Classification"] },
      { title: "NLP classification", detail: "Text classification models for language-understanding tasks.", tags: ["NLP"] },
      { title: "Document AI", detail: "Extracting structured information from documents.", tags: ["Document processing"] },
      { title: "Recommendation systems", detail: "Models that rank and recommend relevant items.", tags: ["Recommenders"] },
      { title: "Forecasting", detail: "Time-series forecasting for planning and demand-style problems.", tags: ["Time series"] },
      { title: "Computer vision", detail: "Image-based models for detection and recognition tasks.", tags: ["Computer vision"] },
      { title: "FastAPI inference", detail: "Serving trained models behind FastAPI endpoints.", tags: ["FastAPI"] },
      { title: "MLflow / DVC", detail: "Experiment tracking with MLflow and data/model versioning with DVC.", tags: ["MLflow", "DVC"] },
    ],
  },
];

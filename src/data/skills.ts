/** Skill lists come straight from the resume. Descriptions are neutral one-line definitions. */

export type SkillCategory = {
  id: string;
  title: string;
  blurb: string;
  skills: { name: string; note: string }[];
};

const s = (name: string, note: string) => ({ name, note });

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    title: "Programming & Data",
    blurb: "Languages and data-processing tools",
    skills: [
      s("Python", "Primary language for ML, data pipelines and services."),
      s("SQL", "Querying and shaping relational data."),
      s("Pandas", "In-memory tabular data analysis."),
      s("Polars", "Fast, multi-threaded DataFrame library."),
      s("NumPy", "N-dimensional arrays and numerical computing."),
      s("PySpark", "Distributed data processing on Spark."),
      s("Databricks", "Unified platform for Spark-based data and ML workloads."),
    ],
  },
  {
    id: "ml",
    title: "Machine Learning",
    blurb: "Classical and predictive modeling",
    skills: [
      s("Scikit-learn", "Classical ML algorithms, pipelines and metrics."),
      s("XGBoost", "Gradient-boosted trees for tabular data."),
      s("LightGBM", "Fast histogram-based gradient boosting."),
      s("CatBoost", "Gradient boosting with native categorical handling."),
      s("Random Forest", "Bagged decision-tree ensembles."),
      s("Time Series", "Forecasting and temporal modeling."),
      s("Model Evaluation", "Choosing metrics, validation schemes and error analysis."),
    ],
  },
  {
    id: "dl",
    title: "Deep Learning & NLP",
    blurb: "Neural networks, language and vision",
    skills: [
      s("PyTorch", "Deep learning framework for research and production."),
      s("TensorFlow", "End-to-end deep learning platform."),
      s("Transformers", "Attention-based architectures and the Hugging Face library."),
      s("BERT", "Bidirectional encoder for language understanding."),
      s("RoBERTa", "Robustly optimised BERT pretraining variant."),
      s("BioBERT", "BERT pretrained on biomedical text."),
      s("spaCy", "Production NLP pipelines."),
      s("NER", "Named entity recognition."),
      s("OpenCV", "Classical computer vision toolkit."),
      s("YOLOv8", "Real-time object detection."),
    ],
  },
  {
    id: "genai",
    title: "Generative AI",
    blurb: "LLM applications and orchestration",
    skills: [
      s("LLMs", "Large language models for generation and reasoning."),
      s("RAG", "Grounding LLM answers in retrieved documents."),
      s("LangChain", "Framework for composing LLM applications."),
      s("LangGraph", "Stateful, graph-based agent workflows."),
      s("LlamaIndex", "Data framework for LLM retrieval apps."),
      s("Prompt Engineering", "Designing and testing prompts and output formats."),
      s("AWS Bedrock", "Managed access to foundation models on AWS."),
      s("OpenAI API", "Hosted LLM and embedding models."),
      s("LLaMA", "Open-weight LLM family from Meta."),
      s("vLLM", "High-throughput LLM inference engine."),
    ],
  },
  {
    id: "retrieval",
    title: "Retrieval",
    blurb: "Search over text and vectors",
    skills: [
      s("Qdrant", "Vector database with metadata filtering."),
      s("Pinecone", "Managed vector database."),
      s("FAISS", "Library for efficient similarity search."),
      s("pgvector", "Vector search inside PostgreSQL."),
      s("BM25", "Lexical ranking for exact-term matching."),
      s("Hybrid Search", "Combining dense and lexical retrieval."),
      s("Embeddings", "Dense vector representations of text."),
      s("Reranking", "Re-scoring candidates for precision before generation."),
    ],
  },
  {
    id: "mlops",
    title: "MLOps & Cloud",
    blurb: "Delivery, infrastructure and monitoring",
    skills: [
      s("AWS SageMaker", "Managed training, tuning and hosting for ML."),
      s("S3", "Object storage for datasets and artifacts."),
      s("Lambda", "Serverless compute for event-driven tasks."),
      s("ECS", "Managed container orchestration on AWS."),
      s("EKS", "Managed Kubernetes on AWS."),
      s("Docker", "Containerised, reproducible environments."),
      s("MLflow", "Experiment tracking and model registry."),
      s("GitHub Actions", "CI/CD automation."),
      s("CloudWatch", "Metrics, logs and alarms on AWS."),
      s("Evidently AI", "Data and model drift monitoring."),
      s("Weights & Biases", "Experiment tracking and visualisation."),
    ],
  },
  {
    id: "apis",
    title: "APIs & Engineering",
    blurb: "Serving and code quality",
    skills: [
      s("FastAPI", "Async Python web framework with typed request schemas."),
      s("REST APIs", "Resource-oriented HTTP service design."),
      s("Uvicorn", "ASGI server for Python web apps."),
      s("Pytest", "Python testing framework."),
      s("Ruff", "Fast Python linter and formatter."),
      s("Black", "Opinionated Python code formatter."),
      s("Git", "Version control and collaboration."),
    ],
  },
];

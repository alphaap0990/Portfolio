/**
 * Every figure here comes from the resume. Do not add numbers that are not
 * supported by it. `context` is only filled in where the resume ties the
 * metric to a specific system; the rest are intentionally unattributed.
 */

export type Metric = {
  /** Display string, also used for SEO / no-JS rendering */
  display: string;
  prefix?: string;
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  context?: string;
  /** 0–1 fill for the meter (only for bounded ratios) */
  meter?: number;
};

export const impactStrip: Metric[] = [
  { display: "400K+", value: 400, suffix: "K+", label: "CMS guideline pages processed" },
  { display: "12M+", value: 12, suffix: "M+", label: "Claims analyzed" },
  { display: "5TB+", value: 5, suffix: "TB+", label: "Claims data processed" },
  { display: "2M+", value: 2, suffix: "M+", label: "Records processed daily" },
  { display: "3.8×", value: 3.8, suffix: "×", decimals: 1, label: "GPU throughput improvement" },
  { display: "92%", value: 92, suffix: "%", label: "RAG latency reduction" },
];

export type MetricGroup = { title: string; blurb: string; items: Metric[] };

export const metricGroups: MetricGroup[] = [
  {
    title: "Speed & efficiency",
    blurb: "Latency, cost and throughput",
    items: [
      { display: "92%", value: 92, suffix: "%", label: "RAG latency reduction", context: "Clinical RAG platform", meter: 0.92 },
      { display: "42%", value: 42, suffix: "%", label: "Token / cost reduction", context: "Clinical RAG platform", meter: 0.42 },
      { display: "48%", value: 48, suffix: "%", label: "Training-time reduction", meter: 0.48 },
      { display: "3.8×", value: 3.8, suffix: "×", decimals: 1, label: "GPU throughput" },
      { display: "<80ms", prefix: "<", value: 80, suffix: "ms", label: "P99 inference latency", context: "Claims risk prediction" },
    ],
  },
  {
    title: "Model quality",
    blurb: "Accuracy and discrimination",
    items: [
      { display: "31%", value: 31, suffix: "%", label: "Retrieval accuracy improvement", context: "Clinical RAG platform", meter: 0.31 },
      { display: "27%", value: 27, suffix: "%", label: "Extraction accuracy improvement", context: "Medical-necessity extraction (fine-tuned LLM)", meter: 0.27 },
      { display: "0.89", value: 0.89, decimals: 2, label: "ROC-AUC", context: "Claims risk prediction", meter: 0.89 },
    ],
  },
  {
    title: "Scale",
    blurb: "Data and document volume",
    items: [
      { display: "400K+", value: 400, suffix: "K+", label: "Guideline pages", context: "Clinical RAG platform" },
      { display: "12M+", value: 12, suffix: "M+", label: "Claims", context: "Claims risk prediction" },
      { display: "5TB+", value: 5, suffix: "TB+", label: "Data processed" },
      { display: "2M+", value: 2, suffix: "M+", label: "Records / day" },
    ],
  },
];

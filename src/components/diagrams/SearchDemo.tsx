"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/ui/Icons";

const corpus = [
  { id: "chunk", title: "Chunking", text: "Split documents into passages that respect their structure. Smaller chunks retrieve precisely, larger chunks keep more context." },
  { id: "embed", title: "Embeddings", text: "Embedding models map text to vectors so passages with similar meaning end up close together in vector space." },
  { id: "faiss", title: "FAISS index", text: "FAISS builds an index over vectors for fast nearest-neighbour search, either exact or approximate." },
  { id: "bm25", title: "BM25", text: "BM25 ranks documents by exact term overlap, weighting rare terms higher and normalising for document length." },
  { id: "hybrid", title: "Hybrid search", text: "Hybrid search combines dense vector retrieval with keyword retrieval so both meaning and exact terms are matched." },
  { id: "rerank", title: "Reranking", text: "A cross-encoder reranker rescoring the top candidates improves precision before context reaches the language model." },
  { id: "eval", title: "Evaluation", text: "Retrieval is evaluated with recall and precision on labelled queries, and answers are checked for faithfulness to the retrieved context." },
  { id: "qlora", title: "QLoRA", text: "QLoRA fine-tunes a 4-bit quantized model with low-rank adapters, cutting the GPU memory needed for training." },
  { id: "drift", title: "Drift monitoring", text: "Drift monitoring compares live data distributions with training data to decide when a model should be retrained." },
];

const stop = new Set("a an the of to and or in on for with by is are be so that this it as at from into how why what when which do does can should before after over".split(" "));

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t && !stop.has(t))
    .map((t) => (t.length > 4 ? t.replace(/(ing|ed|es|s)$/, "") : t));

const suggestions = ["hybrid search", "exact term matching", "reduce GPU memory fine-tuning", "when to retrain a model"];

type Hit = { id: string; title: string; text: string; score: number; terms: string[] };

export function SearchDemo() {
  const [query, setQuery] = useState("hybrid search");

  const engine = useMemo(() => {
    const tokenized = corpus.map((d) => ({ ...d, tokens: tokenize(`${d.title} ${d.text}`) }));
    const df = new Map<string, number>();
    tokenized.forEach((d) => new Set(d.tokens).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
    const idf = (t: string) => Math.log(1 + tokenized.length / (df.get(t) ?? 1));
    const vec = (tokens: string[]) => {
      const v = new Map<string, number>();
      tokens.forEach((t) => v.set(t, (v.get(t) ?? 0) + 1));
      v.forEach((tf, t) => v.set(t, tf * idf(t)));
      return v;
    };
    const norm = (v: Map<string, number>) => Math.sqrt([...v.values()].reduce((a, b) => a + b * b, 0));
    const docs = tokenized.map((d) => {
      const v = vec(d.tokens);
      return { ...d, v, n: norm(v) };
    });
    return { docs, vec, norm };
  }, []);

  const hits: Hit[] = useMemo(() => {
    const q = tokenize(query);
    if (!q.length) return [];
    const { docs, vec, norm } = engine;
    const qv = vec(q);
    const qn = norm(qv);
    return docs
      .map((d) => {
        let dot = 0;
        const terms: string[] = [];
        qv.forEach((w, t) => {
          const dw = d.v.get(t);
          if (dw) {
            dot += w * dw;
            terms.push(t);
          }
        });
        return { id: d.id, title: d.title, text: d.text, score: qn && d.n ? dot / (qn * d.n) : 0, terms };
      })
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [query, engine]);

  return (
    <div className="rounded-xl border border-line bg-elev/60 p-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-accent">Mock search interface</p>
      <p className="text-xs text-subtle">
        A small TF-IDF ranker running in your browser over 9 sample passages. The real project ranks with OpenAI Embeddings + FAISS.
      </p>

      <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-3">
        <label htmlFor="rag-demo-query" className="sr-only">
          Search query
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            id="rag-demo-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: hybrid search"
            autoComplete="off"
            className="h-10 w-full rounded-lg border border-line-strong bg-base pl-9 pr-3 text-sm text-fg placeholder:text-subtle focus:border-accent-line focus:outline-none"
          />
        </div>
      </form>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQuery(s)}
            className="rounded-full border border-line px-2.5 py-1 text-[11.5px] text-muted transition hover:border-accent-line hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2" aria-live="polite">
        {hits.map((h, i) => (
          <li key={h.id} className="rounded-lg border border-line bg-surface p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium text-fg">
                <span className="mr-2 font-mono text-[11px] text-subtle">#{i + 1}</span>
                {h.title}
              </span>
              <span className="tabular font-mono text-[11px] text-accent">score {h.score.toFixed(2)}</span>
            </div>
            <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-line" aria-hidden>
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(6, h.score * 100)}%` }} />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">{h.text}</p>
            <p className="mt-1.5 font-mono text-[10.5px] text-subtle">matched: {h.terms.join(", ")}</p>
          </li>
        ))}
        {hits.length === 0 && (
          <li className="rounded-lg border border-dashed border-line p-3 text-xs leading-relaxed text-subtle">
            No lexical overlap. This is the gap dense embeddings close: they match by meaning, not shared words.
          </li>
        )}
      </ul>
    </div>
  );
}

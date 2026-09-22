"use client";

import { useEffect, useRef, useState } from "react";
import type { Metric } from "@/data/metrics";

const format = (m: Metric, v: number) => `${m.prefix ?? ""}${v.toFixed(m.decimals ?? 0)}${m.suffix ?? ""}`;

/**
 * Counts up once when scrolled into view. The server-rendered text is the final value,
 * so crawlers, no-JS visitors and reduced-motion users always see the real number.
 */
export function CountUp({ metric, className }: { metric: Metric; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(metric.display);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setText(t < 1 ? format(metric, metric.value * eased) : metric.display);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [metric]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{metric.display}</span>
      <span aria-hidden>{text}</span>
    </span>
  );
}

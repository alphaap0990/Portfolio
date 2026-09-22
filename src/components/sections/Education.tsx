import { education } from "@/data/resume";
import { Reveal } from "@/components/ui/Reveal";
import { Maybe } from "@/components/ui/Chip";

export function Education() {
  return (
    <div>
      <Reveal>
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-fg">Education</h3>
      </Reveal>
      <ol className="relative space-y-3 border-l border-line pl-6">
        {education.map((e, i) => (
          <li key={e.degree} className="relative">
            <span aria-hidden className="absolute -left-[29px] top-6 h-2.5 w-2.5 rounded-full border-2 border-line-strong bg-base" />
            <Reveal delay={i * 0.06}>
              <div className="card p-5">
                <p className="text-[15px] font-medium text-fg">{e.degree}</p>
                <p className="mt-0.5 text-sm text-muted">{e.institution}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-subtle">
                  <span>
                    Focus: <Maybe value={e.focus} />
                  </span>
                  <span>
                    <Maybe value={e.period} />
                  </span>
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

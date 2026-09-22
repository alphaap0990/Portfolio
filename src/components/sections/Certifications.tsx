import { certifications } from "@/data/resume";
import { isPlaceholder } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

export function Certifications() {
  return (
    <div>
      <Reveal>
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-fg">Certifications</h3>
      </Reveal>
      <ul className="grid gap-3 sm:grid-cols-2">
        {certifications.map((c, i) => (
          <li key={c.name}>
            <Reveal delay={i * 0.05} className="h-full">
              <div className="card flex h-full flex-col justify-between gap-4 p-5">
                <div>
                  <p className="text-[15px] font-medium leading-snug text-fg">{c.name}</p>
                  <p className="mt-1 text-xs text-subtle">{c.issuer}</p>
                </div>
                {/* No credential link until a real URL is supplied: a dead "View credential"
                    button is worse than none. */}
                {!isPlaceholder(c.url) && (
                  <div>
                    <LinkButton href={c.url} variant="ghost" size="sm" icon={<ArrowUpRightIcon width={13} height={13} />} className="-ml-3.5">
                      View credential
                    </LinkButton>
                  </div>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

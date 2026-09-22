import { site } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/Icons";

export function Contact() {
  return (
    <Section id="contact">
      <Reveal>
        <div className="card relative overflow-hidden px-6 py-12 text-center md:px-12 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 max-w-lg rounded-full bg-accent/10 blur-3xl"
          />
          <p className="eyebrow relative mb-3">Contact</p>
          <h2 id="contact-title" className="relative text-3xl font-semibold tracking-tight text-fg md:text-4xl">
            Let&apos;s build something useful.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Interested in production AI systems, Generative AI, machine learning, or applied ML engineering? I&apos;d be happy to connect.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href={`mailto:${site.email}`} variant="primary" icon={<MailIcon />}>
              Email
            </LinkButton>
            <LinkButton href={site.links.linkedin} icon={<LinkedInIcon />}>
              LinkedIn
            </LinkButton>
            <LinkButton href={site.links.github} icon={<GitHubIcon />}>
              GitHub
            </LinkButton>
          </div>

          <p className="relative mt-5 text-sm text-subtle">
            <a href={`mailto:${site.email}`} className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg">
              {site.email}
            </a>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

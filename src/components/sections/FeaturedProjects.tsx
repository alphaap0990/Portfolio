import { projects } from "@/data/projects";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "./ProjectCard";

export function FeaturedProjects() {
  return (
    <Section id="projects">
      <SectionHeader
        id="projects"
        eyebrow="Featured projects"
        title="Systems I have built"
        description={
          <>
            Each card covers the problem, the engineering challenge, the architecture and the result. Cards marked{" "}
            <span className="text-fg">Professional Experience</span> come from my work at UnitedHealthcare; the one marked{" "}
            <span className="text-fg">Portfolio Project</span> is a personal build.
          </>
        }
      />
      <div className="space-y-8">
        {projects.map((p) => (
          <Reveal key={p.slug}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

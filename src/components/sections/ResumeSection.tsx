import { Section, SectionHeader } from "@/components/ui/Section";
import { ResumeCTA } from "./ResumeCTA";
import { Education } from "./Education";
import { Certifications } from "./Certifications";

export function ResumeSection() {
  return (
    <Section id="resume">
      <SectionHeader id="resume" eyebrow="Resume" title="Experience at a glance" />
      <ResumeCTA />
      <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Education />
        <Certifications />
      </div>
    </Section>
  );
}

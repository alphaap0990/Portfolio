import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ImpactMetrics } from "@/components/sections/ImpactMetrics";
import { About } from "@/components/sections/About";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { Skills } from "@/components/sections/Skills";
import { AISystemsLab } from "@/components/sections/AISystemsLab";
import { NumbersSection } from "@/components/sections/NumbersSection";
import { GitHubSection } from "@/components/sections/GitHubSection";
import { DeepDives } from "@/components/sections/DeepDives";
import { ResumeSection } from "@/components/sections/ResumeSection";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <ImpactMetrics />
        <About />
        <FeaturedProjects />
        <ExperienceTimeline />
        <Skills />
        <AISystemsLab />
        <NumbersSection />
        <GitHubSection />
        <DeepDives />
        <ResumeSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

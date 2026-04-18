import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import ContactSection from "../components/ContactSection";
import ParallaxSection from "../components/ParallaxSection";
import DotGrid from "@/components/DotGrid";
import HRSection from "@/components/HRSection";
import GbaParallaxBackdrop from "@/components/GbaParallaxBackdrop";

const sections = [
  AboutSection,
  HRSection,
  ExperienceSection,
  ProjectsSection,
  SkillsSection,
  ContactSection,
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text-primary">
      <GbaParallaxBackdrop />

      <div className="pointer-events-none fixed inset-0 z-10 opacity-35">
        <DotGrid
          dotSize={2}
          gap={18}
          baseColor="#ffd166"
          activeColor="#8bd450"
          proximity={120}
          shockRadius={220}
          shockStrength={4}
          resistance={800}
          returnDuration={1.4}
        />
      </div>

      <div className="relative z-20">
        <HeroSection />
        {sections.map((Section, index) => (
          <ParallaxSection key={Section.name} className={index === 0 ? "" : ""}>
            <Section />
          </ParallaxSection>
        ))}
      </div>
    </main>
  );
}

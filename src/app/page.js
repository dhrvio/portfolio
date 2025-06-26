import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import ContactSection from "../components/ContactSection";
import ParallaxSection from "../components/ParallaxSection";
import DotGrid from "@/components/DotGrid";
import HRSection from "@/components/HRSection";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* BACKGROUND IMAGE (lowest layer) */}
      <div className="absolute top-[64px] w-full h-[calc(100vh-64px)] z-0">
        <img src="/images/bg2.png" alt="bg" className="w-full h-full object-cover" />
      </div>

      {/* DOT GRID (above image) */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <DotGrid
          dotSize={1.8}
          gap={15}
          baseColor="#D4AF37"
          activeColor="#D4AF37"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-primary/10 z-20"></div>

      {/* PAGE CONTENT */}
      <div className="relative z-30 h-[100vh] overflow-auto">
        {/* HERO – no parallax so it fills the screen */}
        <HeroSection />

        {/* About – subtle parallax */}
        <ParallaxSection speed={0.15}>
          <AboutSection />
        </ParallaxSection>

        {/* HR section – subtle parallax */}
        <ParallaxSection speed={0.15}>
          <HRSection />
        </ParallaxSection>

        {/* Experience – slightly slower parallax */}
        <ParallaxSection speed={0.1}>
          <ExperienceSection />
        </ParallaxSection>

        {/* Projects – a little faster for depth */}
        <ParallaxSection speed={0.25}>
          <ProjectsSection />
        </ParallaxSection>

        {/* Skills – mild parallax */}
        <ParallaxSection speed={0.12}>
          <SkillsSection />
        </ParallaxSection>

        {/* Contact – final call to action */}
        <ParallaxSection speed={0.2}>
          <ContactSection />
        </ParallaxSection>
      </div>
    </div>
  );
}

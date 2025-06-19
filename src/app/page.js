// src/app/page.js
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import ContactSection from "../components/ContactSection";
import ParallaxSection from "../components/ParallaxSection";
import DotGrid from "@/components/DotGrid";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 w-full h-full object-cover">
        <DotGrid
          dotSize={4}
          gap={15}
          baseColor="#eeeeee"
          activeColor="#eeeeee"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* PAGE CONTENT */}
      <div className="relative z-10 h-[100vh] overflow-auto">
        {/* HERO – no parallax so it fills the screen */}
        <HeroSection />

        {/* About – subtle parallax */}
        <ParallaxSection speed={0.15}>
          <AboutSection />
        </ParallaxSection>

        {/* Experience – slightly slower parallax */}
        <ParallaxSection speed={0.1} className="">
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

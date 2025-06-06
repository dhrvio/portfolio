// src/app/page.js
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import ContactSection from "../components/ContactSection";
import ParallaxSection from "../components/ParallaxSection";
import WaveDivider from "../components/WaveDivider";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* 1) VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2) DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* 3) PAGE CONTENT */}
      <div className="relative z-10 h-[100vh] overflow-auto">
        {/* HERO – no parallax so it fills the screen */}
        <HeroSection />

        {/* About – subtle parallax */}
        <ParallaxSection speed={0.15}>
          <AboutSection />
        </ParallaxSection>

        {/* Divider */}
        <WaveDivider />

        {/* Experience – slightly slower parallax */}
        <ParallaxSection speed={0.1} className="">
          <ExperienceSection />
        </ParallaxSection>

        {/* Divider (flip) */}
        <WaveDivider />

        {/* Projects – a little faster for depth */}
        <ParallaxSection speed={0.25}>
          <ProjectsSection />
        </ParallaxSection>

        {/* Divider */}
        <WaveDivider />

        {/* Skills – mild parallax */}
        <ParallaxSection speed={0.12}>
          <SkillsSection />
        </ParallaxSection>

        {/* Divider */}
        <WaveDivider />

        {/* Contact – final call to action */}
        <ParallaxSection speed={0.2}>
          <ContactSection />
        </ParallaxSection>
      </div>
    </div>
  );
}

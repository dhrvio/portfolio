'use client';
import { resumeData } from "../lib/resumeData";
import { motion } from "framer-motion";
import SplitText from "./SplitText";

export default function HeroSection() {
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <div
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Glitchy Name */}
      <motion.h4
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-5xl md:text-9xl uppercase neon-flicker mb-4 text-accent/15"
        style={{ animation: "neon-flicker 3s infinite alternate" }}
      >
        {resumeData.personal.name}
      </motion.h4>

      {/* Title */}
      <SplitText
        text={resumeData.personal.title}
        className="md:text-2xl font-bold text-center text-text-primary md:w-[50%]"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        onLetterAnimationComplete={handleAnimationComplete}
      />

      {/* Neon Underline */}
      <div className="h-0.5 md:w-2xl bg-accent mb-8 animate-pulse"></div>

      {/* CTA Button */}
      <motion.a
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        href="#about"
        className="inline-block px-8 py-4 border-2 border-accent text-accent font-semibold uppercase rounded-full hover:bg-accent hover:text-primary transition-all duration-300 ease-out shadow-neon"
      >
        Learn More
      </motion.a>
    </div>
  );
}

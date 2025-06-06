'use client';
import { resumeData } from "../lib/resumeData";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* If you want, you can add a subtle SVG behind the text, but the video is already behind. */}

      {/* Glitchy Name */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-8xl md:text-8xl font-extrabold uppercase neon-flicker mb-4"
        style={{ animation: "neon-flicker 3s infinite alternate" }}
      >
        {resumeData.personal.name}
      </motion.h1>

      {/* Title with Slow Glow */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-2xl md:text-3xl tracking-widest glow-text mb-8"
        style={{ animation: "neon-glow 4s ease-in-out infinite alternate" }}
      >
        {resumeData.personal.title}
      </motion.p>

      {/* Neon Underline */}
      <div className="h-1 w-32 bg-accent mb-8 animate-pulse"></div>

      {/* CTA Button */}
      <motion.a
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        href="#about"
        className="inline-block px-8 py-4 border-2 border-accent text-accent font-semibold uppercase rounded-full hover:bg-accent hover:text-black transition-all duration-300 ease-out shadow-neon"
      >
        Learn More
      </motion.a>
    </div>
  );
}

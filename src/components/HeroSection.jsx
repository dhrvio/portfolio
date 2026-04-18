"use client";

import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { resumeData } from "../lib/resumeData";
import SplitText from "./SplitText";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[88vh] items-center justify-center px-5 pb-16 pt-28 text-center md:pt-32"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-3 rounded-gba border-2 border-ink bg-cartridge px-4 py-2 font-pixel text-xs uppercase tracking-normal text-ink shadow-raised"
        >
          <Gamepad2 size={16} />
          Player 1 Ready
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="font-pixel text-[clamp(2.2rem,8vw,6.8rem)] font-black uppercase leading-[1.05] text-highlight drop-shadow-[4px_4px_0_var(--color-ink)]"
        >
          {resumeData.personal.name}
        </motion.h1>

        <div className="mt-6 max-w-3xl text-balance text-lg font-semibold text-text-primary md:text-2xl">
          <SplitText
            text={resumeData.personal.title}
            className="text-center"
            delay={45}
            duration={0.45}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-80px"
            textAlign="center"
          />
        </div>

        <div className="mt-8 h-2 w-full max-w-xl border-2 border-ink bg-screen shadow-raised">
          <div className="h-full w-3/4 bg-link-hover" />
        </div>

        <motion.a
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.3 }}
          href="#about"
          className="pixel-button mt-10 px-8 py-3 text-sm"
        >
          Start
        </motion.a>
      </div>
    </section>
  );
}

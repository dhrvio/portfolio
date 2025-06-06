"use client";
import Image from "next/image";
import { resumeData } from "../lib/resumeData";

export default function AboutSection() {
  const { personal } = resumeData;

  return (
    <section
      id="about"
      className="py-24 px-6 md:px-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10"
    >
      {/* Left Column */}
      <div className="flex flex-col items-center space-y-6 reveal">
        {/* Name + Title */}
        <h2 className="text-4xl font-extrabold tracking-wider neon-flicker text-center">
          {personal.name}
        </h2>
        <p className="text-lg text-gray-300 text-center">{personal.title}</p>

        {/* Contact Links */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm tracking-wide uppercase mt-4">
          <a
            href={`mailto:${personal.email}`}
            className="text-accent hover:text-white transition-colors duration-300 underline underline-offset-4"
          >
            Email
          </a>
          <span className="text-gray-500">|</span>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:text-white transition-colors duration-300 underline underline-offset-4"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6 reveal">
        <h3 className="text-3xl font-bold uppercase tracking-wider underline decoration-accent decoration-2 neon-glow">
          About Me
        </h3>
        <p className="text-gray-200 leading-loose text-lg">
          {personal.summary}
        </p>
      </div>
    </section>
  );
}

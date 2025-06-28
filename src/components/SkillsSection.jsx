import { resumeData } from "../lib/resumeData";
import Image from "next/image";

export default function SkillsSection() {
  return (
    <section id="skills" className="py-1 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 flex justify-center items-center -z-10 bg-primary rounded-4xl border border-text-light/10">
        <Image
          src="/images/techstack.png"
          alt="Tech Stack Background"
          fill
          className="object-contain opacity-20"
          priority
        />
      </div>

      {/* Skills Content */}
      <div className="relative py-4 px-6 md:px-20 my-20">
        <h2 className="text-6xl font-bold text-center mb-12 neon-flicker reveal text-text-primary">
          Skills
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {resumeData.skills.map((skill, idx) => (
            <div key={idx} className="space-y-2 reveal">
              <div className="flex justify-between items-center">
                <span className="font-medium text-text-primary">
                  {skill.name}
                </span>
                <span className="text-sm text-text-light/80">
                  {skill.level}%
                </span>
              </div>
              <div className="w-full h-3 bg-text-light/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-1000 ease-out"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

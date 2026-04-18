import Image from "next/image";
import { resumeData } from "../lib/resumeData";

export default function SkillsSection() {
  return (
    <section id="skills" className="px-5 py-16 md:py-24">
      <div className="pixel-panel relative mx-auto max-w-6xl overflow-hidden p-6 md:p-8">
        <Image
          src="/images/gba/ships.png"
          alt=""
          fill
          className="pixelated pointer-events-none object-cover opacity-10"
          sizes="100vw"
        />
        <div className="relative">
          <div className="reveal mb-10 text-center">
            <p className="font-pixel text-xs uppercase text-highlight">
              Equipped Items
            </p>
            <h2 className="mt-3 font-pixel text-3xl font-black uppercase md:text-5xl">
              Skills
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-5">
            {resumeData.skills.map((skill) => (
              <div key={skill.name} className="reveal">
                <div className="mb-2 flex items-center justify-between gap-4 font-pixel text-xs uppercase">
                  <span>{skill.name}</span>
                  <span className="text-highlight">{skill.level}%</span>
                </div>
                <div className="h-5 border-2 border-ink bg-background shadow-raised">
                  <div
                    className="h-full bg-screen"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

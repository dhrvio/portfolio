// src/components/SkillsSection.jsx
import { resumeData } from "../lib/resumeData";

export default function SkillsSection() {
  return (
    <section id="skills" className='py-1'>
      <div className="py-24 px-6 md:px-20 bg-black rounded-4xl border border-zinc-100 my-20">
        <h2 className="text-4xl font-bold text-center mb-12 neon-flicker reveal">
          Skills
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {resumeData.skills.map((skill, idx) => (
            <div key={idx} className="space-y-2 reveal">
              <div className="flex justify-between items-center">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-gray-400">{skill.level}%</span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
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

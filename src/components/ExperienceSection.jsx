// src/components/ExperienceSection.jsx
import { resumeData } from "../lib/resumeData";

export default function ExperienceSection() {
  return (
    <div id="experience" className="py-24 bg-black/90 px-6 md:px-20">
      <div className="max-w-5xl mx-auto space-y-12">
        <h2 className="text-4xl font-bold text-center mb-8 neon-flicker reveal">
          Experience
        </h2>

        {resumeData.experience.map((job, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start reveal"
          >
            {/* Date */}
            <div className="md:col-span-1 text-accent text-sm uppercase tracking-wide">
              {job.date}
            </div>

            {/* Content */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="text-2xl font-semibold">{job.role}</h3>
              <p className="italic text-gray-400">{job.company}</p>
              <ul className="space-y-2 ml-4 list-disc list-inside text-gray-300">
                {job.bulletPoints.map((bullet, i) => (
                  <li key={i} className="hover:text-accent transition-colors">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

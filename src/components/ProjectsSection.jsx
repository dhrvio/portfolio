import Image from "next/image";
import { resumeData } from "../lib/resumeData";

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-1">
      <div className="py-24 px-6 md:px-20 bg-primary rounded-4xl border border-text-light/10 my-20">
        <h2 className="text-4xl font-bold text-center mb-12 neon-flicker reveal text-text-primary">
          Projects
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {resumeData.projects.map((proj, idx) => (
            <a
              key={idx}
              href={proj.link || "#"}
              target="_blank"
              rel="noreferrer"
              className="group block bg-primary/80 border border-text-light/20 rounded-xl overflow-hidden shadow-neon transform transition-transform duration-300 ease-out hover:scale-105 hover:rotate-1"
            >
              {/* Image with tilt */}
              {proj.image && (
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={proj.image}
                    alt={proj.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-semibold neon-flicker group-hover:text-accent transition-colors duration-300 text-text-primary">
                  {proj.name}
                </h3>
                <p className="text-text-light">{proj.description}</p>
                <ul className="list-disc list-inside text-text-light/80 space-y-1 text-sm">
                  {proj.bullets.map((bullet, i) => (
                    <li key={i} className="hover:text-accent transition-colors">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

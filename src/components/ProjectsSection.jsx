import Image from "next/image";
import { resumeData } from "../lib/resumeData";

export default function ProjectsSection() {
  return (
    <section id="projects" className="px-5 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-10 text-center">
          <p className="font-pixel text-xs uppercase text-highlight">
            Cartridge Library
          </p>
          <h2 className="mt-3 font-pixel text-3xl font-black uppercase md:text-5xl">
            Projects
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {resumeData.projects.map((project) => (
            <article key={project.name} className="pixel-card reveal overflow-hidden">
              {project.image ? (
                <div className="relative h-48 border-b-2 border-ink">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover pixelated"
                  />
                </div>
              ) : (
                <div className="pixel-grid flex h-40 items-center justify-center border-b-2 border-ink bg-screen">
                  <span className="font-pixel text-5xl font-black text-screen-dark">
                    {project.name.slice(0, 2)}
                  </span>
                </div>
              )}

              <div className="space-y-4 p-6">
                <h3 className="font-pixel text-xl font-black uppercase leading-snug">
                  {project.name}
                </h3>
                <p className="leading-7">{project.description}</p>
                <ul className="space-y-3 text-sm leading-6">
                  {project.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                {/* Project redirection is intentionally disabled for now. */}
                {/* <a href={project.link} target="_blank" rel="noreferrer">Open project</a> */}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

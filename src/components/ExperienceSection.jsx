import { resumeData } from "../lib/resumeData";

export default function ExperienceSection() {
  return (
    <section id="experience" className="px-5 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="reveal">
            <p className="font-pixel text-xs uppercase text-highlight">
              Campaign Progress
            </p>
            <h2 className="mt-3 font-pixel text-3xl font-black uppercase md:text-5xl">
              Experience
            </h2>
          </div>
          <p className="reveal max-w-xl text-text-light">
            Frontend work across startup-paced product teams, with a focus on
            responsive interfaces, production polish, and fast iteration.
          </p>
        </div>

        <div className="space-y-6">
          {resumeData.experience.map((job) => (
            <article
              key={`${job.role}-${job.date}`}
              className="pixel-card reveal grid gap-5 p-5 md:grid-cols-[180px_1fr] md:p-6"
            >
              <div className="font-pixel text-xs uppercase text-primary">
                {job.date}
              </div>
              <div>
                <h3 className="font-pixel text-xl font-black uppercase leading-snug">
                  {job.role}
                </h3>
                <p className="mt-2 font-bold text-primary">{job.company}</p>
                <ul className="mt-4 space-y-3 text-sm leading-6">
                  {job.bulletPoints.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 bg-accent" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

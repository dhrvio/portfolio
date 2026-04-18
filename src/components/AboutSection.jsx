import { MapPin } from "lucide-react";
import { resumeData } from "../lib/resumeData";

export default function AboutSection() {
  const { personal } = resumeData;

  return (
    <section id="about" className="px-5 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-stretch">
        <div className="pixel-screen reveal flex flex-col justify-between gap-8 p-6 md:p-8">
          <div>
            <p className="font-pixel text-xs uppercase text-screen-dark">
              Save File
            </p>
            <h2 className="mt-4 font-pixel text-3xl font-black uppercase leading-tight md:text-4xl">
              {personal.name}
            </h2>
            <p className="mt-4 text-lg font-bold">{personal.title}</p>
          </div>

          <div className="space-y-3 font-pixel text-xs uppercase">
            <p className="flex items-center gap-2">
              <MapPin size={16} />
              {personal.location}
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="pixel-button px-4 py-2" href={`mailto:${personal.email}`}>
                Email
              </a>
              <a
                className="pixel-button bg-highlight px-4 py-2"
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="pixel-panel reveal p-6 md:p-8">
          <p className="font-pixel text-xs uppercase text-highlight">Quest Log</p>
          <h3 className="mt-3 font-pixel text-2xl font-black uppercase text-text-primary md:text-3xl">
            About
          </h3>
          <p className="mt-6 text-lg leading-8 text-text-light">
            {personal.summary}
          </p>
        </div>
      </div>
    </section>
  );
}

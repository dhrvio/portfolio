import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export default function HRSection() {
  return (
    <section className="px-5 py-10 md:py-16">
      <div className="pixel-card reveal mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 p-6 text-center md:flex-row md:text-left">
        <div>
          <p className="font-pixel text-xs uppercase text-primary">
            Bonus Stage
          </p>
          <h2 className="mt-3 font-pixel text-2xl font-black uppercase leading-snug md:text-3xl">
            Tired of the same portfolio loop?
          </h2>
          <p className="mt-3 max-w-2xl leading-7">
            Take a quick break in the mini arcade, then come back with a fresh
            high score.
          </p>
        </div>
        <Link href="/games" className="pixel-button px-6 py-3 text-sm">
          <Gamepad2 size={18} />
          Games
        </Link>
      </div>
    </section>
  );
}

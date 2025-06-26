"use client";
import Link from "next/link";

const HRSection = () => {
  return (
    <section className="text-center py-16 px-4">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-text-primary">
        Are you an HR? Tired of seeing the same old portfolios again and again? <br />
        Take a break — play some games!
      </h1>

      <Link href="/games">
        <button className="mt-4 px-6 py-3 bg-accent text-primary font-bold uppercase rounded-full hover:bg-accent/80 transition duration-300">
          Go to Games
        </button>
      </Link>
    </section>
  );
};

export default HRSection;

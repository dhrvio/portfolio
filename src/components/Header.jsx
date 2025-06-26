"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["About", "Experience", "Projects", "Skills", "Contact"];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-primary/80 backdrop-blur-md`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href={`/`}
            className="text-2xl font-bold text-accent duration-200">
            DS
          </a>

          {/* Desktop Nav */}
          <ul className="hidden md:flex space-x-10 text-sm uppercase tracking-widest text-text-light">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`/#${item.toLowerCase()}`}
                  className="relative hover:text-accent transition-colors duration-200 group"
                >
                  {item}
                  <span className="block h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-text-primary z-50"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[64px] md:hidden w-full bg-primary text-text-primary z-40 flex flex-col items-center py-6 space-y-6"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="uppercase tracking-wider hover:text-accent transition"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

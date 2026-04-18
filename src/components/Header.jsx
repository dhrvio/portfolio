"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  ChevronDown,
  Code2,
  Gamepad2,
  ListTree,
  Mail,
  Menu,
  Sparkles,
  User,
  X,
} from "lucide-react";

const navItems = [
  { label: "About", icon: User },
  { label: "Experience", icon: Briefcase },
  { label: "Projects", icon: Code2 },
  { label: "Skills", icon: Sparkles },
  { label: "Contact", icon: Mail },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const closeMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full border-b-2 border-ink bg-primary/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 text-text-primary md:px-6">
          <Link
            href="/"
            className="rounded-pixel border-2 border-ink bg-highlight px-3 py-2 font-pixel text-lg font-black text-ink shadow-raised"
          >
            DS
          </Link>

          <div className="hidden items-center gap-5 font-pixel text-xs uppercase md:flex">
            <div className="relative">
              <button
                type="button"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-pixel px-3 py-2 transition hover:bg-secondary focus-visible:bg-secondary"
              >
                <ListTree size={16} />
                Menu
                <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="pixel-card absolute right-0 mt-3 w-56 overflow-hidden p-2">
                  {navItems.map(({ label, icon: Icon }) => (
                    <a
                      key={label}
                      href={`/#${label.toLowerCase()}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-pixel px-3 py-2 text-sm transition hover:bg-screen"
                    >
                      <Icon size={16} />
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a
              href="/games"
              className="flex items-center gap-2 rounded-pixel px-3 py-2 transition hover:bg-secondary focus-visible:bg-secondary"
            >
              <Gamepad2 size={16} />
              Games
            </a>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="rounded-pixel border-2 border-ink bg-cartridge p-2 text-ink shadow-raised md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed left-0 top-[62px] z-40 flex w-full flex-col gap-3 border-b-2 border-ink bg-primary p-5 font-pixel text-sm uppercase text-text-primary shadow-pixel md:hidden"
          >
            <a
              href="/games"
              className="flex items-center gap-3 rounded-pixel bg-secondary px-4 py-3"
              onClick={closeMenus}
            >
              <Gamepad2 size={18} />
              Games
            </a>
            {navItems.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href={`/#${label.toLowerCase()}`}
                className="flex items-center gap-3 rounded-pixel px-4 py-3 hover:bg-secondary"
                onClick={closeMenus}
              >
                <Icon size={18} />
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

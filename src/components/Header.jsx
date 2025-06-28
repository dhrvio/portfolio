"use client";
import { useState } from "react";
import {
  motion,
  AnimatePresence
} from "framer-motion";
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Gamepad2,
  User,
  Briefcase,
  Code2,
  Sparkles,
  Mail,
  ListTree
} from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { label: "About", icon: <User size={16} /> },
    { label: "Experience", icon: <Briefcase size={16} /> },
    { label: "Projects", icon: <Code2 size={16} /> },
    { label: "Skills", icon: <Sparkles size={16} /> },
    { label: "Contact", icon: <Mail size={16} /> }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-primary/80 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-text-light">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-accent">DS</a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 uppercase tracking-wider text-sm">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center hover:text-accent transition"
              >
                <ListTree size={16} className="mr-1" />
                MENU <ChevronDown size={16} className="ml-1 mt-0.5" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-primary border border-text-light/10 rounded-lg shadow-lg z-30">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={`/#${item.label.toLowerCase()}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-accent/10"
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a
              href="/games"
              className="flex items-center gap-2 hover:text-accent transition"
            >
              <Gamepad2 size={16} /> GAMES
            </a>
          </div>

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
            <a
              href="/games"
              className="flex items-center gap-2 uppercase tracking-wider hover:text-accent transition"
              onClick={() => setMenuOpen(false)}
            >
              <Gamepad2 size={18} /> Games
            </a>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={`/#${item.label.toLowerCase()}`}
                className="flex items-center gap-2 uppercase tracking-wider hover:text-accent transition"
                onClick={() => setMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

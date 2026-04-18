"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function GameModal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="pixel-panel relative max-h-[88vh] w-full max-w-xl overflow-y-auto p-5 text-text-primary md:p-6"
            initial={{ scale: 0.94, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 14 }}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-pixel border-2 border-ink bg-accent p-2 text-ink shadow-raised"
              onClick={onClose}
              aria-label="Close game"
            >
              <X size={20} />
            </button>
            <h2 className="mb-5 pr-12 font-pixel text-2xl font-black uppercase text-highlight">
              {title}
            </h2>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

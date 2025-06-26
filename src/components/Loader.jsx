"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 bg-[var(--color-primary)] z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-[var(--color-accent)] text-2xl sm:text-3xl font-semibold tracking-wide"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 1.5, ease: "easeInOut" }}
      >
        Loading...
      </motion.div>
    </motion.div>
  );
}

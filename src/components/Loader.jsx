"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="pixel-screen px-8 py-6 font-pixel text-lg font-black uppercase text-ink"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 0.9,
          ease: "easeInOut",
        }}
      >
        Loading
      </motion.div>
    </motion.div>
  );
}

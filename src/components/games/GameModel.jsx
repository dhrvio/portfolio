"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function GameModal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-primary text-accent p-6 rounded-xl w-[90%] max-w-md relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button className="absolute top-5 right-5" onClick={onClose}>
              <X size={34} />
            </button>
            <h2 className="text-2xl  font-bold mb-4">{title}</h2>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

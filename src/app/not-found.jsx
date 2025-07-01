"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-primary] text-[--color-text-primary] px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-bold text-[--color-accent] mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="mb-6 text-[--color-text-light]">Sorry, the page you’re looking for doesn’t exist.</p>
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-[--color-accent] hover:underline">
            <ArrowLeft size={20} /> Back to Home
          </span>
        </Link>
      </motion.div>
    </div>
  );
}

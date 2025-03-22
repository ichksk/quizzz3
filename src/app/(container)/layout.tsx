"use client"

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center">
      <AnimatePresence>
        <motion.div
          layout
          transition={{ layout: { duration: 0.3 } }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
"use client"

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {

  return (
    <AnimatePresence mode='wait'>
      <div className="flex justify-center items-center">
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
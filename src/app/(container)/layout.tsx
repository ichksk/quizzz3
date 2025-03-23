"use client"

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { ContainerBadge } from './_components/badge';
import { Saved } from './_components/saved';
import { ContainerTitle } from './_components/title';

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode='wait'>
      <div className="flex flex-col justify-center items-center space-y-4">
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-lg w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-10 overflow-hidden"
        >
          <ContainerTitle />
          <ContainerBadge />
          {children}

        </motion.div>
        {pathname === '/' && <Saved />}
      </div>
    </AnimatePresence>
  );
}
"use client";
import { motion } from 'framer-motion';
import { JSX } from 'react';

export default function RoomLayout({ children }: { children: JSX.Element }) {
  const patterns = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    size: Math.random() * 80 + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.07 + 0.03,
    duration: Math.random() * 30 + 20
  }));


  return (
    <div className={`min-h-[100dvh]`}>
      {patterns.map(pattern => (
        <motion.div
          key={pattern.id}
          className="absolute rounded-full bg-blue-500 z-0"
          style={{
            width: pattern.size,
            height: pattern.size,
            left: `${pattern.x}%`,
            top: `${pattern.y}%`,
            opacity: pattern.opacity
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [pattern.opacity, pattern.opacity * 1.5, pattern.opacity]
          }}
          transition={{
            duration: pattern.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
      <div className='p-8 pb-20 sm:p-20'>
        {children}
      </div>
    </div>
  )
}
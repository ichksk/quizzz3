"use client";
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const CustomNotFound = () => {
  const router = useRouter();

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden"
        variants={fadeUp}
        custom={0}
      >
        <motion.div
          className="relative bg-blue-50 p-8 flex justify-center select-none"
          variants={fadeUp}
          custom={1}
        >
          <div className="text-9xl">🔍</div>
          <div className="absolute animate-bounce bottom-6 right-20 text-4xl">❓</div>
          <div className="absolute animate-ping bottom-24 left-24 text-4xl">❓</div>
        </motion.div>

        <motion.div className="p-6 text-center" variants={fadeUp} custom={2}>
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-2"
            variants={fadeUp}
            custom={3}
          >
            おや？
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-6"
            variants={fadeUp}
            custom={4}
          >
            参加中のクイズゲームが見つかりませんでした
          </motion.p>
          <motion.p
            className="text-gray-500 mb-8"
            variants={fadeUp}
            custom={5}
          >
            もう一度参加してみてください！
          </motion.p>

          <motion.button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 cursor-pointer"
            variants={fadeUp}
            custom={6}
          >
            <Home className="mr-2" size={20} />
            ホームに戻る
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-8 flex justify-center"
        variants={fadeUp}
        custom={7}
      >
        <div className="flex space-x-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-8 bg-gray-300 opacity-0 rounded-full transform rotate-12"
              style={{
                animation: `footprintAppear ${2.5 + i * 0.5}s forwards,
                           footprintFloat 2s ease-in-out infinite`,
                animationDelay: `0s, ${2.5 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes footprintAppear {
          0% { opacity: 0; transform: translateY(-5px) rotate(12deg); }
          ${(100 / (2.5)).toFixed(1)}% { opacity: 0.7; transform: translateY(0) rotate(12deg); }
          100% { opacity: 0.7; transform: translateY(0) rotate(12deg); }
        }

        @keyframes footprintFloat {
          0% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-3px) rotate(12deg); }
          100% { transform: translateY(0) rotate(12deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default CustomNotFound;

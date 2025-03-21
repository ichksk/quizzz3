"use client"

import { JoinQuizForm } from '@/components/joinQuizForm';
import { motion } from 'framer-motion';

export default function JoinQuizPage() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-lg"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
              クイズに参加
            </h1>
            <span className="absolute -top-4 -right-6 text-3xl transform rotate-12">🎮</span>
          </div>

          <div className="h-1.5 w-32 mx-auto bg-gradient-to-r from-green-400 to-teal-500 rounded-full my-4"></div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-600"
          >
            ルームコードを入力してゲームに参加しましょう！
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <JoinQuizForm />
        </motion.div>
      </motion.main>
    </div>
  );
}
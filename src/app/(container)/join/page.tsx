"use client"

import { motion } from 'framer-motion';

import { BackButton } from '@/components/backButton';

import { JoinQuizForm } from './_components/joinQuizForm';

export default function JoinQuizPage() {
  const subtleAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <span className="absolute -top-4 -right-6 text-3xl transform rotate-12 select-none">🎮</span>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
            クイズに参加
          </h1>
        </div>

        <div className="h-1.5 w-32 mx-auto bg-gradient-to-r from-green-400 to-teal-500 rounded-full mb-4"></div>

        <p className="text-gray-600">
          ルームコードを入力してゲームに参加しましょう！
        </p>
      </div>

      <motion.div
        {...subtleAnimation}
      >
        <JoinQuizForm />
      </motion.div>
      <BackButton />
    </div>
  );
}
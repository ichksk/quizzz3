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
    <>
      <div className="text-center mb-8">
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
    </>
  );
}
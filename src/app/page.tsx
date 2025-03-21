"use client"

import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, JSX } from 'react';
import { UsernameField } from '@/components/usernameField';
import { getCookie } from '@/server/cookies';
import { motion } from 'framer-motion';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function Home(): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (showError && e.target.value.trim()) {
      setShowError(false);
    }
  };

  const validateUsername = async () => {
    if (!(await getCookie("username"))?.trim()) {
      setError('名前を入力してくださいっ！🙏');
      setShowError(true);
      return false;
    }
    return true;
  };

  const handleCreateQuiz = async () => {
    if (await validateUsername()) {
      router.push(`/new`);
    }
  };

  const handleJoinQuiz = async () => {
    if (await validateUsername()) {
      router.push(`/join`);
    }
  };

  return (
    <div className={`min-h-[100dvh] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8 pb-20 sm:p-20 ${montserrat.className}`}>
      <div className="flex flex-col items-center justify-center min-h-[80dvh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-8 items-center max-w-md w-full bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-lg"
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                クイズ大会メーカー
              </h1>
              <span className="absolute -top-6 -right-8 text-5xl transform rotate-12 select-none">✨</span>
            </div>

            <div className="h-2 w-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-4 mb-8"></div>
          </div>

          <UsernameField
            onChange={handleUsernameChange}
            error={error}
            showError={showError}
          />

          <div className="flex flex-col gap-4 w-full">
            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium text-base cursor-pointer relative overflow-hidden group"
              onClick={handleCreateQuiz}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
              <span className="relative z-10 flex items-center justify-center">
                <span className="mr-2">✏️</span>
                クイズを作る
              </span>
            </button>

            <button
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium text-base cursor-pointer relative overflow-hidden group"
              onClick={handleJoinQuiz}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
              <span className="relative z-10 flex items-center justify-center">
                <span className="mr-2">🎲</span>
                クイズに参加する
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

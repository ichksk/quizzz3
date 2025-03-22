"use client"

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, JSX } from 'react';

import { UsernameField } from '@/components/usernameField';
import { getCookie } from '@/server/cookies';

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
    <div className="max-w-md w-full">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
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
      </div>
    </div>
  );
}

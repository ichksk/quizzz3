"use client"

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[100dvh] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-3xl font-bold text-center mb-8">クイズアプリ&#x1f600;</h1>

          <UsernameField
            onChange={handleUsernameChange}
            error={error}
            showError={showError}
          />

          <div className="flex flex-col gap-4 w-full max-w-md">
            <button
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex-1 font-medium text-base cursor-pointer"
              onClick={handleCreateQuiz}
            >
              クイズを作る
            </button>
            <button
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex-1 font-medium text-base cursor-pointer"
              onClick={handleJoinQuiz}
            >
              クイズに参加する
            </button>
          </div>
        </div>
      </main >
    </div >
  );
}
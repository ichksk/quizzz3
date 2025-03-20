"use client"

import { JoinQuizForm } from '@/components/joinQuizForm';

export default function JoinQuizPage() {
  return (
    <div className="min-h-[100dvh] p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold mb-4">クイズに参加</h1>
          <p className="text-gray-600">ルームコードを入力してゲームに参加しましょう！</p>
        </div>
        <JoinQuizForm />
      </main>
    </div>
  );
}
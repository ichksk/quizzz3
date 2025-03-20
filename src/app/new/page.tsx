"use client";

import { getCookie, setCookie } from "@/server/cookies";
import { QuizForm } from "@/components/quizForm";
import { loadingAtom, quizFormAtom } from "@/lib/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createRoom, createQuiz, joinRoom } from "@/server/actions"; // サーバーアクションをインポート

export default function CreateQuizPage() {
  const quizData = useAtomValue(quizFormAtom);
  const setLoading = useSetAtom(loadingAtom);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ユーザー名を取得
      const username = await getCookie("username");
      if (!username) {
        toast.error("ユーザー名が設定されていません");
        return;
      }

      // 入力チェック
      if (!quizData.question) {
        toast.error("問題文を入力してください");
        return;
      }

      if (quizData.choices.length < 2) {
        toast.error("選択肢は最低2つ必要です");
        return;
      }

      // 1. ルームを作成
      const room = await createRoom(username);

      // ルームコードをクッキーに保存
      await setCookie("roomCode", room.roomCode);

      // 2. クイズを作成
      await createQuiz({
        roomCode: room.roomCode,
        question: quizData.question,
        choices: quizData.choices.map((choice, index) => ({
          text: choice,
          isCorrect: index === quizData.correctChoiceIndex,
        })),
        timeLimit: quizData.timeLimit,
        order: 0,
      });

      await joinRoom(room.roomCode, username, true);

      toast.success('クイズを作成しました');
      router.push('/room');
    } catch (error) {
      console.error("クイズ作成エラー:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('クイズの作成に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">クイズを作成</h1>
        <QuizForm
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
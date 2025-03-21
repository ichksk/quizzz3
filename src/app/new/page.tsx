"use client";

import { getCookie } from "@/server/cookies";
import { QuizForm } from "@/components/quizForm";
import { loadingAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createRoom, createQuiz } from "@/server/actions"; // サーバーアクションをインポート
import { QuizSubmit } from "@/types/schemas";

export default function CreateQuizPage() {
  const setLoading = useSetAtom(loadingAtom);
  const router = useRouter();

  const handleSubmit = async (formData: QuizSubmit) => {
    setLoading(true);
    try {
      await createRoom();
      await createQuiz(formData);
      toast.success("クイズを作成しました");
      router.push("/room");
    } catch (error) {
      console.error("クイズ作成エラー:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("クイズの作成に失敗しました");
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
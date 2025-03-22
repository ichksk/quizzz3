"use client";

import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { BackButton } from "@/shared/backButton";
import { QuizForm } from "@/shared/quizForm";
import { loadingAtom } from "@/lib/atoms";
import { createRoom, createQuiz } from "@/server/actions";
import { QuizSubmit } from "@/types/schemas";

export default function CreateQuizPage() {
  const setLoading = useSetAtom(loadingAtom);
  const router = useRouter();

  const handleSubmit = async (formData: QuizSubmit) => {
    setLoading(true);
    try {
      const res = await createRoom();
      if (!res.success) {
        throw new Error(res.error);
      }
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
    <div className="max-w-md w-full">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <span className="mr-3 select-none">✏️</span>
            クイズを作成
          </h1>
        </div>
      </div>

      <div>
        <QuizForm onSubmit={handleSubmit} />
      </div>

      <div className="w-full flex justify-center mt-8">
        <div className="text-sm text-gray-500 flex items-center">
          <span className="mr-2">💡</span>
          <span>作成したクイズは「ルーム」でプレイできます</span>
        </div>
      </div>
      <BackButton />
    </div>
  );
}
"use client";

import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { BackButton } from "@/components/backButton";
import { QuizForm } from "@/components/quizForm";
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
    <>
      <QuizForm onSubmit={handleSubmit} />
      <div className="w-full flex justify-center mt-8">
        <div className="text-sm text-gray-500 flex items-center">
          <span className="mr-2">💡</span>
          <span>作成したクイズは「ルーム」でプレイできます</span>
        </div>
      </div>
      <BackButton />
    </>
  );
}
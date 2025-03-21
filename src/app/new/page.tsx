"use client";

import { QuizForm } from "@/components/quizForm";
import { loadingAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createRoom, createQuiz } from "@/server/actions";
import { QuizSubmit } from "@/types/schemas";
import { motion } from "framer-motion";

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
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-lg"
      >
        <div className="flex items-center mb-8">
          <motion.div
            initial={{ scale: 0.9, x: -10 }}
            animate={{ scale: 1, x: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <span className="mr-3 select-none">✏️</span>
              クイズを作成
            </h1>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-1.5 flex-grow ml-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full origin-left"
          ></motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <QuizForm onSubmit={handleSubmit} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full flex justify-center mt-8"
        >
          <div className="text-sm text-gray-500 flex items-center">
            <span className="mr-2">💡</span>
            <span>作成したクイズは「ルーム」でプレイできます</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
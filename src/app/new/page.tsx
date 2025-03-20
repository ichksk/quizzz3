"use client";

// import { initQuiz } from "@/backend/initQuiz";
import { getCookie, setCookie } from "@/backend/cookies";
import { QuizForm } from "@/components/quizForm";
import { loadingAtom, quizFormAtom } from "@/lib/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { joinRoom } from "@/backend/joinRoom";

export default function CreateQuizPage() {
  const router = useRouter()
  const setLoading = useSetAtom(loadingAtom)
  const quizForm = useAtomValue(quizFormAtom)

  const quizData = {
    question: quizForm.question,
    choices: quizForm.choices.map((text, index) => ({
      text,
      isCorrect: index === quizForm.correctChoiceIndex,
      order: index
    })),
    timeLimit: quizForm.timeLimit
  }

  const handleSubmit = async () => {
    // "use server";
    // setLoading(true)
    // try {
    //   const room = await initQuiz(quizData)
    //   await setCookie("roomCode", room.roomCode)

    //   const username = await getCookie("username")
    //   if (username) {
    //     const res = await joinRoom(room.roomCode, username, true)
    //     if (res.success) {
    //       toast.success('クイズを作成しました');
    //       router.push(`/room`)
    //       return
    //     } else {
    //       toast.error('クイズの作成に失敗しました');
    //     }
    //   }
    //   toast.error('クイズの作成に失敗しました');
    // } catch {
    //   toast.error('クイズの作成に失敗しました');
    // } finally {
    //   setLoading(false)
    // }
  }

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
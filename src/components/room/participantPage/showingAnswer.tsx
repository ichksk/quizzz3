import { quizzesAtom, roomAtom } from "@/lib/atoms"
import { fetchQuizAnswerForParticipant } from "@/server/actions"
import { QuizAnswer, Room } from "@/types/schemas"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"

export const ShowingAnswer = () => {
  const room = useAtomValue(roomAtom) as Room
  const quizzes = useAtomValue(quizzesAtom)
  const currentQuiz = quizzes.find(quiz => quiz.order === room.currentOrder)

  const [answer, setAnswer] = useState<QuizAnswer | null>(null)

  useEffect(() => {
    if (!currentQuiz) return
    fetchQuizAnswerForParticipant(currentQuiz.id).then(res => {
      if (res.success) {
        setAnswer(res.data)
      }
    })
  }, [])

  return (
    <div className="text-center flex flex-col items-center space-y-4">
      <p className="text-2xl font-bold">回答を発表します！</p>
      {answer ? (
        <>
          <p className="text-lg">あなたの回答: <span className="font-semibold">{answer.choiceText}</span></p>
          <p className="text-lg">正解: <span className="font-semibold">{answer.correctChoiceText}</span></p>
          <p className={`text-xl ${answer.isCorrect ? "text-green-600" : "text-red-600"} font-bold`}>
            {answer.isCorrect ? "正解！" : "不正解"}
          </p>
        </>
      ) : (
        <p className="text-lg text-gray-600">回答を読み込み中...</p>
      )}
    </div>)
}
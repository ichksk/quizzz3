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
  }, [currentQuiz])

  return (
    <div className="max-w-md mx-auto p-6 bg-yellow-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-4">
        正解発表
      </h2>
      <div className="mb-4">
        <p className="text-lg font-medium">問題:</p>
        <p className="text-xl">{currentQuiz?.question}</p>
      </div>
      {currentQuiz?.image && (
        <div className="mb-4">
          <img
            src={currentQuiz.image}
            alt="問題の画像"
            className="w-full h-auto rounded-md object-cover"
          />
        </div>
      )}
      <div className="mt-6">
        {answer ? (
          <div className="space-y-3 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-white">
            <p className="text-lg">
              <span className="font-medium">あなたの回答: </span>
              <span className="font-semibold">{answer.choiceText}</span>
            </p>
            <p className="text-lg">
              <span className="font-medium">正解: </span>
              <span className="font-semibold">{answer.correctChoiceText}</span>
            </p>
            <p className={`text-2xl font-bold ${answer.isCorrect ? "text-green-600" : "text-red-600"}`}>
              {answer.isCorrect ? "正解！🥳🎉" : "不正解😭"}
            </p>
          </div>
        ) : (
          <p className="text-lg text-gray-600 text-center">回答を読み込み中...</p>
        )}
      </div>
    </div>
  )
}

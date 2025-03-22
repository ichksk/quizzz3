import { useAtomValue } from "jotai"
import { Send, Lock, Check, Flag } from "lucide-react"

import { ImagePreview } from "@/shared/imagePreview"
import { participantsAtom, quizAnswersAtom, quizzesAtom, roomAtom } from "@/lib/atoms"
import { proceedQuiz } from "@/server/actions"
import { QuizForOwner, QuizStatus } from "@/types/schemas"

export const CurrentQuiz = () => {
  const room = useAtomValue(roomAtom)
  const quizzes = useAtomValue(quizzesAtom)
  const quizAnswers = useAtomValue(quizAnswersAtom)
  const participants = useAtomValue(participantsAtom)
  const currentQuiz = room && quizzes[room.currentOrder] as QuizForOwner

  if (!currentQuiz) return null

  // 各選択肢の投票数を、回答の choiceIndex と比較して計算
  const getVoteCount = (choiceIndex: number) => {
    return quizAnswers.filter(answer => answer.choiceIndex === choiceIndex).length
  }

  // QuizStatusに応じて適切なアイコンを返すヘルパー関数
  const renderIcon = () => {
    switch (currentQuiz.status) {
      case QuizStatus.DISPLAYING:
        return <Lock className="w-5 h-5 mr-2" />
      case QuizStatus.ANSWER_CLOSED:
        return <Check className="w-5 h-5 mr-2" />
      case QuizStatus.SHOWING_ANSWER:
        return room.currentOrder >= quizzes.length - 1
          ? <Flag className="w-5 h-5 mr-2" />
          : <Send className="w-5 h-5 mr-2" />
      default:
        return <Send className="w-5 h-5 mr-2" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between space-y-4">
        <p className="text-md text-gray-600">
          第{room.currentOrder + 1}問 / 全{quizzes.length}問
        </p>
        <button
          className="flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 shadow-md cursor-pointer"
          onClick={proceedQuiz}
        >
          {renderIcon()}
          {(() => {
            switch (currentQuiz.status) {
              case QuizStatus.DISPLAYING:
                return "解答を締め切る";
              case QuizStatus.ANSWER_CLOSED:
                return "正解を発表";
              case QuizStatus.SHOWING_ANSWER:
                return room.currentOrder >= quizzes.length - 1
                  ? "クイズ終了"
                  : "次の問題へ";
              default:
                return "";
            }
          })()}
        </button>
      </div>

      {/* 問題表示部分 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm space-y-4">
        <div>
          <p className="text-lg font-medium">問題:</p>
          <p className="text-xl">{currentQuiz?.question}</p>
        </div>

        {/* 画像がある場合は余白や大きさを調整 */}
        {currentQuiz.image && (
          <ImagePreview image={currentQuiz.image} />
        )}

        {/* 選択肢リスト */}
        <div className="space-y-2">
          {currentQuiz.choices.map((choice, index) => {
            const voteCount = getVoteCount(index)
            return (
              <div key={index} className="relative p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p>
                      {index + 1}. {choice}
                    </p>
                    <span className="text-sm text-gray-500">({voteCount}票)</span>
                  </div>
                  {index === currentQuiz.correctChoiceIndex && (
                    <span className="px-2 py-0.5 text-sm text-green-700 bg-green-100 rounded-full">
                      正解
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 回答一覧 */}
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            回答状況({participants.length - 1}人中{quizAnswers.length || 0}人が回答済み)
          </h4>
          <ul className="divide-y divide-gray-200">
            {quizAnswers.map((answer, idx) => (
              <li key={idx} className="py-2 text-sm text-gray-700">
                <span className="font-medium">{answer.username} さん</span> →{" "}
                <span className="font-medium">{answer.choiceText}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

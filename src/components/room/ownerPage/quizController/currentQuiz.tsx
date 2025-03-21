import { Send } from "lucide-react"
import { useAtomValue } from "jotai"
import { participantsAtom, quizAnswersAtom, quizzesAtom, roomAtom } from "@/lib/atoms"
import { proceedQuiz } from "@/server/actions"
import { QuizStatus } from "@/types/schemas"

export const CurrentQuiz = () => {
  const room = useAtomValue(roomAtom)
  const quizzes = useAtomValue(quizzesAtom)
  const quizAnswers = useAtomValue(quizAnswersAtom)
  const participants = useAtomValue(participantsAtom)
  const currentQuiz = room && quizzes[room.currentOrder]

  if (!currentQuiz) return null

  // 各選択肢の投票数を、回答の choiceIndex と比較して計算
  const getVoteCount = (choiceIndex: number) => {
    return quizAnswers.filter(answer => answer.choiceIndex === choiceIndex).length
  }

  // 全選択肢の中で最大の投票数を取得
  const maxVotes = Math.max(...currentQuiz.choices.map((_, index) => getVoteCount(index)))

  // 投票数に応じた幅のクラスを計算（例：全体を12分割）
  const calculateWidthClass = (voteCount: number) => {
    if (maxVotes === 0 || voteCount === 0) return 'w-0'
    const percentage = (voteCount / maxVotes) * 100
    if (percentage < 8.33) return 'w-1/12'
    const parts = Math.ceil(percentage / 8.33)
    return `w-${Math.min(parts, 12)}/12`
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-gray-800">出題中のクイズ</h3>
        <button className="flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 shadow-md" onClick={proceedQuiz}>
          <Send className="w-5 h-5 mr-2" />
          {(() => {
            switch (currentQuiz.status) {
              case QuizStatus.DISPLAYING:
                return "解答を締め切る";
              case QuizStatus.ANSWER_CLOSED:
                return "正解を発表";
              case QuizStatus.SHOWING_ANSWER:
                return "次の問題へ";
              default:
                return "？？？";
            }
          })()}
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <p className="text-lg text-gray-900 mb-4">{currentQuiz.question}</p>
        {currentQuiz.image && (
          <img
            src={currentQuiz.image}
            alt="アップロードした画像のプレビュー"
            className="my-4 max-w-full h-auto max-h-64 rounded-lg mx-auto object-cover"
          />
        )}

        {/* 問題の選択肢を表示 */}
        <div className="mt-4">
          {currentQuiz.choices.map((choice, index) => {
            const voteCount = getVoteCount(index)
            const widthClass = calculateWidthClass(voteCount)
            return (
              <div key={index} className="mb-4">
                <p className="text-gray-800 font-medium">{choice}</p>
                <div className="flex items-center mt-1">
                  <div className={`bg-blue-600 h-4 rounded transition-all duration-300 ${widthClass}`}></div>
                  <span className="ml-3 text-sm text-gray-700">{voteCount}票</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 回答一覧を表示 */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            回答一覧（{participants.length - 1}人中{quizAnswers.length || 0}人が回答済み）
          </h4>
          <ul className="divide-y divide-gray-200">
            {quizAnswers.map((answer, idx) => (
              <li key={idx} className="py-2 text-sm text-gray-700">
                <span className="font-medium">{answer.username} さん</span> → <span className="font-medium">{answer.choiceText}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export interface QuizAnswer {
  participantId: string;
  quizId: string;
  choiceIndex: number;
  isCorrect: boolean;
  score: number;
}

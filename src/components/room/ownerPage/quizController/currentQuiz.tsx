import { Send } from "lucide-react"
import { useAtomValue } from "jotai"
import { quizzesAtom, roomAtom } from "@/lib/atoms"

export const CurrentQuiz = () => {
  const room = useAtomValue(roomAtom)
  const quizzes = useAtomValue(quizzesAtom)
  const currentQuiz = room && quizzes[room.currentOrder]

  // 各選択肢の投票数を計算
  // const getVoteCount = (choiceId: number) => {
  //   return quizAnswers.filter(answer => answer.choice.id === choiceId).length
  // }


  if (!currentQuiz) return null

  // // 最大投票数を計算
  // const maxVotes = Math.max(
  //   ...currentQuiz.choices.map(choice => getVoteCount(choice.id))
  // )

  // widthClassを計算する関数
  // const calculateWidthClass = (voteCount: number) => {
  //   if (maxVotes === 0) return 'w-0'
  //   if (voteCount === 0) return 'w-0'

  //   // 投票があれば最小でもw-1を確保
  //   const percentage = (voteCount / maxVotes) * 100
  //   if (percentage < 8.33) return 'w-1'

  //   const parts = Math.ceil(percentage / 8.33) // 切り上げて小さい値でも表示されるように
  //   return `w-${Math.min(parts, 12)}/12` // 12以上にならないように制限
  // }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">出題中のクイズ</h3>
        <button className="inline-flex items-center px-3 py-1.5 text-[11px] sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 whitespace-nowrap">
          <Send className="w-4 h-4 mr-1 sm:mr-2" />
          次のクイズへ
        </button>      </div>
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <p className="text-lg">{currentQuiz.question}</p>
        {currentQuiz.image && (
          <img
            src={currentQuiz.image}
            alt="アップロードした画像のプレビュー"
            className="my-4 max-w-full h-auto max-h-64 rounded-lg mx-auto"
          />
        )}
      </div>
    </div >
  )
}
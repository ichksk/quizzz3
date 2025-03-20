"use client";

import { QuizForOwner, QuizStatus, RoomForOwner } from "@/types/schemas"
import { EllipsisVertical, Plus } from "lucide-react"
import { useSetAtom } from "jotai"
import { drawerOpenAtom, focusedQuizAtom } from "@/lib/atoms"

export const QuizList = ({ room }: { room: RoomForOwner }) => {
  const setDrawerOpen = useSetAtom(drawerOpenAtom)
  const setFocusedQuiz = useSetAtom(focusedQuizAtom)

  const addQuiz = () => {
    setDrawerOpen(true)
    setFocusedQuiz(null)
  }

  const handleClick = (quiz: QuizForOwner) => {
    setDrawerOpen(true)
    setFocusedQuiz(quiz)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">クイズリスト (全{room.quizzes.length}問)</h3>
        <button
          className="inline-flex items-center px-3 py-1.5 text-[11px] sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 whitespace-nowrap"
          onClick={addQuiz}
        >
          <Plus className="w-4 h-4 mr-1 sm:mr-2" />
          追加
        </button>
      </div>
      <div className="space-y-2">
        {room.quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="flex items-center gap-4 p-3 border border-gray-300 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-500">問題 {quiz.order}</span>
              <p className="truncate">{quiz.question}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <QuizStatusBadge status={quiz.status} />
              <button
                className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => handleClick(quiz)}
              >
                <EllipsisVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const QuizStatusBadge = ({ status }: { status: QuizStatus }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "DRAFT":
        return "bg-blue-100 text-blue-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "WAITING":
        return "bg-yellow-100 text-yellow-800";
      case "DISPLAYING":
        return "bg-purple-100 text-purple-800";
      case "ANSWERING":
        return "bg-indigo-100 text-indigo-800";
      case "ANSWER_CLOSED":
        return "bg-orange-100 text-orange-800";
      case "SHOWING_ANSWER":
        return "bg-sky-100 text-sky-800";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "DELETED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "DRAFT":
        return "下書き";
      case "READY":
        return "準備完了";
      case "WAITING":
        return "出題待ち状態";
      case "DISPLAYING":
        return "問題表示中";
      case "ANSWERING":
        return "回答受付中";
      case "ANSWER_CLOSED":
        return "回答締切";
      case "SHOWING_ANSWER":
        return "正解発表中";
      case "COMPLETED":
        return "出題完了";
      case "CANCELLED":
        return "出題キャンセル";
      case "DELETED":
        return "削除";
      default:
        return "不明なステータス";
    }
  }

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${getStatusStyles()}`}
    >
      {getStatusText()}
    </span>
  );
};

"use client";

import { updateRoom } from "@/server/actions";
import { RoomStatus } from "@/types/schemas";
import { Rocket } from "lucide-react"


export const StartButton = () => {
  const startQuiz = async () => {
    if (confirm("参加を締め切ります。よろしいですか？")) {
      const res = await updateRoom({ newStatus: RoomStatus.IN_PROGRESS })
      if (res.success) {
        console.log("クイズを開始しました")
      } else {
        console.error(res.error)
      }
    }
  }

  return (
    <button
      className="group inline-flex items-center px-3 py-1.5 text-[11px] sm:text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 shadow-sm transition-colors duration-200 whitespace-nowrap cursor-pointer"
      onClick={startQuiz}
    >
      <Rocket className="w-4 h-4 mr-1 sm:mr-2 group-hover:animate-wiggle" />
      クイズを始める！
    </button>
  )
}
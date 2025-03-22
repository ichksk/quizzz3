"use client";

import { Rocket } from "lucide-react"

import { startQuiz } from "@/server/actions";


export const StartButton = () => {
  const handleStart = async () => {
    const res = await startQuiz()
    if (res.success) {
      console.log("クイズを開始しました")
    } else {
      console.error(res.error)
    }
  }

  return (
    <button
      className="group inline-flex items-center px-3 py-1.5 text-[11px] sm:text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 shadow-sm transition-colors duration-200 whitespace-nowrap cursor-pointer"
      onClick={handleStart}
    >
      <Rocket className="w-4 h-4 mr-1 sm:mr-2 group-hover:animate-wiggle" />
      クイズを始める！
    </button>
  )
}
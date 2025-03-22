"use client"

import React, { useRef, useEffect } from "react"
import { useAtom } from "jotai"
import { quizFormAtom } from "@/lib/atoms"

export const QuestionField = () => {
  const [{ question: value }, setValue] = useAtom(quizFormAtom)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current
      // 初期化
      el.style.height = "auto"
      // scrollHeight分だけ高さを合わせる
      el.style.height = `${el.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      // 初期表示で 1 行分の高さを確保
      rows={1}
      value={value}
      onChange={(e) =>
        setValue((prev) => ({
          ...prev,
          question: e.target.value,
        }))
      }
      className="
        w-full
        px-4
        py-2
        border
        border-gray-300
        rounded-lg
        resize-none  /* ユーザーによるドラッグ拡張を禁止したい場合 */
        overflow-hidden
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
      "
      placeholder="例：日本で最も高い山は？"
    />
  )
}

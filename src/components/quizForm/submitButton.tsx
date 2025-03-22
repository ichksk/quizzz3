"use client"

import { useAtomValue } from "jotai";
import { quizFormAtom } from "@/lib/atoms";


interface SubmitButtonProps {
  isEdit?: boolean;
}

export const SubmitButton = ({ isEdit = false }: SubmitButtonProps) => {
  const quizForm = useAtomValue(quizFormAtom)

  const disabled = !(
    quizForm.question !== "" &&
    quizForm.choices.filter(choice => choice === "").length === 0 &&
    quizForm.correctChoiceIndex !== null
  )

  return (
    <button
      type="submit"
      className={`
        px-6 py-2 text-white rounded-lg transition-colors duration-200
        ${disabled
          ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
          : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
        }
      `}
      disabled={disabled}
    >
      {isEdit ? "変更を保存" : "作成"}
    </button>
  )
}
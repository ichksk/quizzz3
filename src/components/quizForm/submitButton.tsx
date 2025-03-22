"use client"

import { motion } from "framer-motion"
import { useAtomValue } from "jotai"

import { quizFormAtom } from "@/lib/atoms"

interface SubmitButtonProps {
  isEdit?: boolean
}

export const SubmitButton = ({ isEdit = false }: SubmitButtonProps) => {
  const quizForm = useAtomValue(quizFormAtom)

  const disabled = !(
    quizForm.question !== "" &&
    quizForm.choices.filter(choice => choice === "").length === 0 &&
    quizForm.correctChoiceIndex !== null
  )

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      animate={{
        scale: 1,
        boxShadow: disabled ? "none" : "0px 4px 15px rgba(37, 99, 235, 0.4)"
      }}
      whileHover={
        !disabled
          ? { scale: 1.05, boxShadow: "0px 8px 20px rgba(37, 99, 235, 0.6)" }
          : {}
      }
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
      className={`px-6 py-2 text-white rounded-lg w-full font-bold tracking-wide ${disabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-indigo-300 to-purple-600 cursor-pointer"
        }`}
    >
      {isEdit ? "変更を保存" : "作成"}
    </motion.button>
  )
}

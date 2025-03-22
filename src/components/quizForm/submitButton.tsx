"use client"

import { useAtomValue } from "jotai"
import { motion } from "framer-motion"
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
        backgroundColor: disabled ? "#9CA3AF" : "#2563EB", // disabled: gray、enabled: blue
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      whileHover={!disabled ? { backgroundColor: "#1D4ED8" } : {}}
      transition={{ duration: 0.2 }}
      className="px-6 py-2 text-white rounded-lg w-full"
    >
      {isEdit ? "変更を保存" : "作成"}
    </motion.button>
  )
}

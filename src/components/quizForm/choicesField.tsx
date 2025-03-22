import { motion, AnimatePresence } from "framer-motion"
import { useAtom } from "jotai"
import { Trash2, Plus } from "lucide-react"

import { quizFormAtom } from "@/lib/atoms"

export const ChoicesField = () => {
  const [quizForm, setQuizForm] = useAtom(quizFormAtom)

  return (
    <div className="space-y-4">
      <label className="block font-medium">選択肢（4つまで）</label>
      <p className="text-sm text-gray-600">
        正解となる選択肢のラジオボタンにチェックを入れてください。
      </p>
      <motion.div className="space-y-3">
        <AnimatePresence>
          {quizForm.choices.map((value, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="radio"
                id={`correct-${index}`}
                name="correct-answer"
                className="w-4 h-4 cursor-pointer"
                value={index}
                checked={index === quizForm.correctChoiceIndex}
                onChange={() => {
                  setQuizForm((prev) => ({
                    ...prev,
                    correctChoiceIndex: index,
                  }))
                }}
              />
              <motion.input
                type="text"
                id={`choice-${index}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`選択肢 ${index + 1}`}
                name={`choice-${index}`}
                onChange={(e) => {
                  setQuizForm((prev) => ({
                    ...prev,
                    choices: prev.choices.map((choice, i) =>
                      i !== index ? choice : e.target.value
                    ),
                  }))
                }}
                value={value}
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
              <motion.button
                type="button"
                className="p-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                onClick={() => {
                  setQuizForm((prev) => ({
                    ...prev,
                    choices: prev.choices.filter((_, i) => i !== index),
                    correctChoiceIndex:
                      prev.correctChoiceIndex && prev.correctChoiceIndex > index
                        ? prev.correctChoiceIndex - 1
                        : prev.correctChoiceIndex,
                  }))
                }}
                aria-label="選択肢を削除"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {quizForm.choices.length < 4 && (
          <motion.div
            className="flex items-center justify-center px-8"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{
              duration: 0.3,
              opacity: { delay: quizForm.choices.length === 3 ? 0 : 0.2 }
            }}
          >
            <motion.button
              type="button"
              className="flex items-center w-full gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => {
                setQuizForm((prev) => ({
                  ...prev,
                  choices: [...prev.choices, ""],
                }))
              }}
              disabled={quizForm.choices.length >= 4}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 246, 255, 0.6)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              選択肢を追加
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
import { ImagePreview } from "@/components/imagePreview"
import { quizzesAtom, roomAtom } from "@/lib/atoms"
import { fetchQuizAnswerForParticipant } from "@/server/actions"
import { QuizAnswer, Room } from "@/types/schemas"
import { useAtomValue } from "jotai"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"

export const ShowingAnswer = () => {
  const room = useAtomValue(roomAtom) as Room
  const quizzes = useAtomValue(quizzesAtom)
  const currentQuiz = quizzes.find(quiz => quiz.order === room.currentOrder)

  const [answer, setAnswer] = useState<QuizAnswer | null>(null)
  const [revealAnswer, setRevealAnswer] = useState(false)

  useEffect(() => {
    if (!currentQuiz) return
    fetchQuizAnswerForParticipant(currentQuiz.id).then(res => {
      if (res.success) {
        setAnswer(res.data)
        // Delay revealing the answer for animation effect
        setTimeout(() => setRevealAnswer(true), 800)
      }
    })
  }, [currentQuiz])

  return (
    <motion.div
      className="max-w-md mx-auto p-6 rounded-lg shadow-lg overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: "linear-gradient(135deg, #fef9c3 0%, #ffedd5 100%)"
      }}
    >
      {/* Background sparkles */}
      {answer && answer.isCorrect && (
        <AnimatePresence>
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-yellow-300"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                repeatType: "loop"
              }}
            />
          ))}
        </AnimatePresence>
      )}

      <motion.h2
        className="text-3xl font-bold text-center mb-6 text-amber-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        正解発表
      </motion.h2>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-lg font-medium text-amber-900">問題:</p>
        <p className="text-xl text-amber-700">{currentQuiz?.question}</p>
      </motion.div>

      {currentQuiz?.image && (
        <motion.div
          className="mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ImagePreview image={currentQuiz.image} />
        </motion.div>
      )}

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {answer ? (
          <AnimatePresence>
            <motion.div
              className="space-y-3 p-4 border-2 border-dashed border-purple-300 rounded-lg bg-white relative overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: { duration: 0.5, delay: 0.3 }
              }}
            >
              <motion.p
                className="text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-medium text-purple-700">あなたの回答: </span>
                <span className="font-semibold">{answer.choiceText}</span>
              </motion.p>

              <motion.p
                className="text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="font-medium text-purple-700">正解: </span>
                <span className="font-semibold">{answer.correctChoiceText}</span>
              </motion.p>

              <motion.div
                className="mt-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                {revealAnswer && (
                  <motion.p
                    className={`text-2xl font-bold text-center py-2 rounded-lg ${answer.isCorrect ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {answer.isCorrect ? (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: 3, repeatType: "reverse" }}
                      >
                        正解！🥳🎉
                      </motion.span>
                    ) : (
                      <motion.span
                        animate={{ y: [0, -3, 0, -3, 0] }}
                        transition={{ duration: 0.5, repeat: 3, repeatType: "reverse" }}
                      >
                        不正解😭
                      </motion.span>
                    )}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            className="h-24 flex items-center justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <p className="text-lg text-gray-600 text-center">回答を読み込み中...</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
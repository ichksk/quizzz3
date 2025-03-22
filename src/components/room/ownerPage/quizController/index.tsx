import { motion } from "framer-motion"
import { useAtomValue } from "jotai"
import { Lightbulb } from "lucide-react"

import { roomAtom } from "@/lib/atoms"
import { Room } from "@/types/schemas"

import { CurrentQuiz } from "./currentQuiz"
import { QuizDrawer } from "./quizDrawer"
import { QuizList } from "./quizList"
import { StartButton } from "./startButton"

export const QuizController = () => {
  const room = useAtomValue(roomAtom) as Room

  return (
    <>
      <QuizDrawer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-gray-200 rounded-xl shadow-sm lg:col-span-2 overflow-hidden"
      >
        <motion.div
          className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <motion.h2
            className="text-lg font-semibold flex items-center gap-2"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <Lightbulb className="w-5 h-5 text-blue-500" />
            クイズ
          </motion.h2>

          {room.status === "WAITING" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <StartButton />
            </motion.div>
          )}
        </motion.div>

        <div className="p-6">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {room.status === "IN_PROGRESS" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <CurrentQuiz />
              </motion.div>
            )}
            <QuizList />
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
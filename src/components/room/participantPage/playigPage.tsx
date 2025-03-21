import { LeaveRoomButton } from "@/components/leaveRoomButton";
import { quizzesAtom, roomAtom } from "@/lib/atoms";
import { QuizForParticipant, Room } from "@/types/schemas";
import { useAtomValue } from "jotai";
import { AnswerClosed } from "./answerClosed";
import { ShowingAnswer } from "./showingAnswer";
import { Answering } from "./answering";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const PlayingPage = () => {
  const room = useAtomValue(roomAtom) as Room;
  const quizzes = useAtomValue(quizzesAtom);
  const currentQuiz = quizzes.find((quiz) => quiz.order === room.currentOrder) as QuizForParticipant;
  const [isAnimating, setIsAnimating] = useState(true);

  // Reset animation state when quiz changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [currentQuiz.order, currentQuiz.status]);

  const getComponentForStatus = () => {
    switch (currentQuiz.status) {
      case "DISPLAYING":
        return <Answering />;
      case "ANSWER_CLOSED":
        return <AnswerClosed />;
      case "SHOWING_ANSWER":
        return <ShowingAnswer />;
      default:
        return null;
    }
  };

  // Background patterns animation
  const patterns = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    size: Math.random() * 80 + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.07 + 0.03,
    duration: Math.random() * 30 + 20
  }));

  return (
    <motion.div
      className="min-h-[100dvh] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background animated patterns */}
      {patterns.map(pattern => (
        <motion.div
          key={pattern.id}
          className="absolute rounded-full bg-blue-500"
          style={{
            width: pattern.size,
            height: pattern.size,
            left: `${pattern.x}%`,
            top: `${pattern.y}%`,
            opacity: pattern.opacity
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [pattern.opacity, pattern.opacity * 1.5, pattern.opacity]
          }}
          transition={{
            duration: pattern.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Quiz number indicator */}
      <motion.div
        className="absolute top-4 left-4 rounded-lg bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm px-4 py-2 shadow-md z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.h3
          className="text-lg md:text-xl font-semibold text-blue-700"
          animate={{
            textShadow: ["0px 0px 0px rgba(59, 130, 246, 0)", "0px 0px 5px rgba(59, 130, 246, 0.3)", "0px 0px 0px rgba(59, 130, 246, 0)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          第{room.currentOrder + 1}問目
        </motion.h3>
      </motion.div>

      {/* Main content card */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl h-fit p-6 md:p-8 max-w-2xl mx-auto mt-12 relative z-10 overflow-hidden"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Background gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-30"
          animate={{
            opacity: [0.3, 0.1, 0.3],
            background: isAnimating ? ["linear-gradient(to bottom right, #eff6ff, #eef2ff)", "linear-gradient(to bottom right, #dbeafe, #e0e7ff)"] : "linear-gradient(to bottom right, #eff6ff, #eef2ff)"
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Content with animation between states */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentQuiz.order}-${currentQuiz.status}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            {getComponentForStatus()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <LeaveRoomButton />
    </motion.div>
  );
};
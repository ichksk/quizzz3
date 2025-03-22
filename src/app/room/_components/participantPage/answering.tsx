import { motion, AnimatePresence } from "framer-motion";
import { useAtomValue } from "jotai";
import { Loader2, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { ImagePreview } from "@/components/imagePreview";
import { quizzesAtom, roomAtom } from "@/lib/atoms";
import { getQuizAnswer, submitQuizAnswer } from "@/server/actions";
import { QuizForParticipant, Room } from "@/types/schemas";

export const Answering = () => {
  const room = useAtomValue(roomAtom) as Room;
  const quizzes = useAtomValue(quizzesAtom);
  const currentQuiz = quizzes.find((quiz) => quiz.order === room.currentOrder) as QuizForParticipant;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(currentQuiz.timeLimit);

  const handleOptionSelect = async (choiceIndex: number) => {
    if (currentQuiz) {
      try {
        const res = await submitQuizAnswer({
          quizId: currentQuiz.id,
          choiceIndex,
        });
        if (res.success) {
          setSelectedOption(choiceIndex);
          setIsSubmitted(true);
        } else {
          toast.error(res.error ?? "");
        }
      } catch {
        toast.error("エラーが発生しました。もう一度お試しください。");
      }
    }
  };

  useEffect(() => {
    getQuizAnswer(currentQuiz.id).then((res) => {
      if (res.success) {
        if (res.data) {
          setSelectedOption(res.data.choiceIndex);
          setIsSubmitted(true);
        }
      }
    });
  }, [room]);

  // Animate decreasing time
  useEffect(() => {
    if (timeLeft === Infinity || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const generateHighlightColor = (index: number) => {
    const colors = ["from-blue-400 to-cyan-300", "from-purple-400 to-pink-300", "from-amber-400 to-orange-300", "from-emerald-400 to-teal-300"];
    return colors[index % colors.length];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="py-4"
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-500 break-words"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {currentQuiz.question}
        </motion.h2>

        {currentQuiz.image && (
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ImagePreview image={currentQuiz.image} />
          </motion.div>
        )}

        <motion.div
          className="flex flex-col gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentQuiz.choices.map((choice, index) => (
            (!isSubmitted || selectedOption === index) && <motion.button
              key={index}
              whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
              disabled={selectedOption !== null}
              className={`
                relative p-8 text-lg font-medium rounded-xl border-2 overflow-hidden
                transition-all duration-300
                ${selectedOption === null
                  ? 'hover:border-blue-400 hover:shadow-md active:bg-blue-100 border-gray-200'
                  : selectedOption === index
                    ? 'bg-blue-100 border-blue-500 shadow-md'
                    : 'opacity-0 h-0 min-h-0 min-w-0 p-0 m-0 border-none'
                }
              `}
              onClick={() => handleOptionSelect(index)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${generateHighlightColor(index)} opacity-0 group-hover:opacity-10 transition-opacity duration-200`}
                style={{
                  opacity: selectedOption === index ? 0.1 : 0
                }}
              />

              <div
                className={`absolute inset-0 bg-gradient-to-r ${generateHighlightColor(index)} opacity-0 hover:opacity-10 transition-opacity duration-200`}
              />
              {choice}
            </motion.button>
          ))}
        </motion.div>

        {isSubmitted && (
          <motion.div
            className="mt-8 flex flex-col items-center space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <motion.p
              className="text-gray-600 text-lg"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              しばらくお待ちください...
            </motion.p>
          </motion.div>
        )}

        {timeLeft !== Infinity && (
          <motion.div
            className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-3 flex items-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Timer className="w-5 h-5 text-orange-500" />
            <motion.span
              className="text-lg font-bold text-orange-500"
              animate={{
                scale: timeLeft <= 10 ? [1, 1.2, 1] : 1
              }}
              transition={{
                duration: timeLeft <= 10 ? 0.5 : 0,
                repeat: timeLeft <= 10 ? Infinity : 0,
                repeatType: "loop"
              }}
            >
              {timeLeft}
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
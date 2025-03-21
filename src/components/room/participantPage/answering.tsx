import { quizzesAtom, roomAtom } from "@/lib/atoms";
import { getQuizAnswer, submitQuizAnswer } from "@/server/actions";
import { QuizForParticipant, Room } from "@/types/schemas";
import { useAtomValue } from "jotai";
import { Loader2, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

  return (
    <>
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        {currentQuiz.question}
      </h2>
      {currentQuiz.image && (
        <div className="mb-6 flex justify-center">
          <img
            src={currentQuiz.image}
            alt=""
            className="max-w-full h-auto max-h-64 rounded-lg mx-auto"
          />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {currentQuiz.choices.map((choice, index) => (
          <button
            key={index}
            disabled={selectedOption !== null}
            className={`
            p-8 text-lg font-medium rounded-xl border-2 border-gray-200
            transition-all duration-300
            ${selectedOption === null
                ? 'hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100'
                : selectedOption === index
                  ? 'bg-blue-100 border-blue-500'
                  : 'opacity-0 min-h-0 min-w-0 overflow-hidden'
              }
          `}
            onClick={() => handleOptionSelect(index)}
          >
            {choice}
          </button>
        ))}
      </div>
      {isSubmitted && (
        <div className="mt-8 flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600 text-lg animate-pulse">しばらくお待ちください...</p>
        </div>
      )}

      {timeLeft !== Infinity && (
        <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-3 flex items-center space-x-2">
          <Timer className="w-5 h-5 text-orange-500" />
          <span className="text-lg font-bold text-orange-500">{timeLeft}</span>
        </div>
      )}
    </>
  )
}
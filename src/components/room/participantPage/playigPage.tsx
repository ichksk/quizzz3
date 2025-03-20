import { LeaveRoomButton } from "@/components/leaveRoomButton";
import { RoomForParticipant } from "@/types/schemas"
import { Loader2, Timer } from "lucide-react";
import { useState } from "react";

export const PlayingPage = ({ room }: { room: RoomForParticipant }) => {
  const currentQuiz = room.quizzes[room.currentOrder]
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const handleOptionSelect = (choiceId: number) => {
    // if(currentQuiz && participant){
    //   submitQuizAnswer(currentQuiz.id, {
    //     choiceId: choiceId,
    //     participantId: participant.id,
    //     answerTime: null,
    //   })
    //   .then(() => {
    //     setSelectedOption(choiceId);
    //     setIsSubmitted(true);
    //   })
    //   .catch((e) => {
    //     toast.error(e.message)
    //   })
    // }
  };

  return (
    <div className="min-h-[100dvh] bg-gray-100 p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-lg h-fit p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {currentQuiz.question}
        </h2>

        {/* Display quiz image if available */}
        {currentQuiz.image && (
          <div className="mb-6 flex justify-center">
            <img
              src={currentQuiz.image}
              alt=""
              className="max-w-full h-auto max-h-64 rounded-lg mx-auto"
            />
          </div>
        )}

        {/* 選択肢 - より大きく表示 */}
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


        {/* ローディング表示 */}
        {isSubmitted && (
          <div className="mt-8 flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-gray-600 text-lg animate-pulse">しばらくお待ちください...</p>
          </div>
        )}
      </div>

      {/* フローティング タイマー (モバイル時のみ表示) */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-3 flex items-center space-x-2">
        <Timer className="w-5 h-5 text-orange-500" />
        <span className="text-lg font-bold text-orange-500">{timeLeft}</span>
      </div>

      <LeaveRoomButton />
    </div>
  )
}
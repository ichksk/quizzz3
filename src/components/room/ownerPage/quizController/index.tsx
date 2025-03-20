
import { RoomForOwner } from "@/types/schemas"
import { StartButton } from "./startButton"
import { QuizList } from "./quizList"
import { QuizDrawer } from "./quizDrawer"
import { CurrentQuiz } from "./currentQuiz"

export const QuizController = ({ room }: { room: RoomForOwner }) => {
  return (
    <>
      <QuizDrawer />
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">クイズ</h2>
          {room.status === "WAITING" && <StartButton />}
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {room.status === "IN_PROGRESS" && (
              <CurrentQuiz room={room} />
            )}
            <QuizList room={room} />
          </div>
        </div>
      </div>
    </>
  )
}
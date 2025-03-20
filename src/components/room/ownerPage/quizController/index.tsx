// import { useRecoilValue } from "recoil"

// import { roomState } from "@/states/useRoom"

// import { CurrentQuiz } from "./currentQuiz"
// import { QuizDrawer } from "./quizDrawer"
// import { QuizList } from "./quizList"
import { RoomForOwner } from "@/types/schemas"
import { StartButton } from "./startButton"

export const QuizController = ({ room }: { room: RoomForOwner }) => {
  // const room = useRecoilValue(roomState)

  if (!room) return null

  return (
    <>
      {/* <QuizDrawer/> */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">クイズ</h2>
          {room.status === "WAITING" && <StartButton />}
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* {room.status === "IN_PROGRESS" && (
              <CurrentQuiz />
            )}
            <QuizList /> */}
          </div>
        </div>
      </div>
    </>
  )
}
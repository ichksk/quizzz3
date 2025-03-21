import { LeaveRoomButton } from "@/components/leaveRoomButton"
import { Header } from "./header"
import { ParticipantsList } from "./participantsList"
import { QuizController } from "./quizController"

export const OwnerPage = () => {

  return (
    <div className="flex flex-col container mx-auto py-8 px-4 space-y-6">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ParticipantsList />
        <QuizController />
      </div>
      <LeaveRoomButton />
    </div>
  )
}

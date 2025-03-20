import { LeaveRoomButton } from "../leaveRoomButton"
import { Header } from "./header"
import { Participants } from "./participants"

export const OwnerPage = () => {
  return (
    <div className="flex flex-col container mx-auto py-8 space-y-6">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Participants />
        {/* <QuizController /> */}
      </div>
      <LeaveRoomButton />
    </div>
  )
}

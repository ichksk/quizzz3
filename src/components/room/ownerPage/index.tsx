import { LeaveRoomButton } from "@/components/leaveRoomButton"
import { Header } from "./header"
import { ParticipantsList } from "./participantsList"
import { QuizController } from "./quizController"
import { Participant, RoomForOwner } from "@/types/schemas"

export const OwnerPage = ({ room, participant }: { room: RoomForOwner, participant: Participant }) => {

  return (
    <div className="flex flex-col container mx-auto py-8 px-4 space-y-6">
      <Header room={room as RoomForOwner} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ParticipantsList roomCode={room.roomCode} currentUserId={participant.id} />
        <QuizController room={room} />
      </div>
      <LeaveRoomButton />
    </div>
  )
}

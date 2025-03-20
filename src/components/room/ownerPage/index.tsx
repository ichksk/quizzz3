import { getParticipant, getRoomData } from "@/server/actions"
import { LeaveRoomButton } from "@/components/leaveRoomButton"
import { Header } from "./header"
import { notFound } from "next/navigation"
import { ParticipantsList } from "./participantsList"
import { QuizController } from "./quizController"
import { RoomForOwner } from "@/types/schemas"

export const OwnerPage = async () => {
  const { room } = await getRoomData()
  const { participant } = await getParticipant()

  if (!room || !participant) {
    notFound()
  }

  return (
    <div className="flex flex-col container mx-auto py-8 space-y-6">
      <Header room={room as RoomForOwner} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ParticipantsList roomCode={room.roomCode} currentUserId={participant.id} />
        <QuizController room={room as RoomForOwner} />
      </div>
      <LeaveRoomButton />
    </div>
  )
}

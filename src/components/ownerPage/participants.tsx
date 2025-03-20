import { getParticipant, getRoomData } from "@/server/actions"
import { RoomForOwner } from "@/types/schemas"
import { Crown, Users } from "lucide-react"
import { notFound } from "next/navigation"


export async function Participants() {
  const { room } = await getRoomData() as { room: RoomForOwner }
  const { participant } = await getParticipant()

  if (!room || !participant) return notFound()

  const participantsExceptMe = room.participants.filter(p => p.id !== participant.id)

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm lg:col-span-1">
      <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          参加者一覧
        </h2>
        <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 rounded-full">
          {participantsExceptMe.length}人
        </span>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {participantsExceptMe.map((participant, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {index === 0 && participant.score !== 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                <span>{participant.username}</span>
              </div>
              <span className="text-gray-600">{participant.score}点</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
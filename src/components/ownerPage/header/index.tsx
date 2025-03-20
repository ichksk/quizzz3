import { getRoomData } from "@/server/actions"
import { RoomCodeField } from "./roomCode"
import { RoomStatusBadge } from "./roomStatusBadge"
import { RoomForOwner } from "@/types/schemas"

export const Header = async () => {
  const { room } = await getRoomData()

  if (!room) {
    return null
  }

  return (
    <div className="flex items-center justify-between">
      <RoomCodeField room={room as RoomForOwner} />
      <RoomStatusBadge status={room.status} />
    </div>
  )
}
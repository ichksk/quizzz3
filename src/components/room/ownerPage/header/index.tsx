import { RoomCodeField } from "./roomCode"
import { RoomStatusBadge } from "./roomStatusBadge"
import { RoomForOwner } from "@/types/schemas"

export const Header = ({ room }: { room: RoomForOwner }) => {
  return (
    <div className="flex items-center justify-between">
      <RoomCodeField room={room as RoomForOwner} />
      <RoomStatusBadge status={room.status} />
    </div>
  )
}
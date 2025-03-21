import { useAtomValue } from "jotai"
import { RoomCodeField } from "./roomCode"
import { RoomStatusBadge } from "./roomStatusBadge"
import { Room } from "@/types/schemas"
import { roomAtom } from "@/lib/atoms"

export const Header = () => {
  const room = useAtomValue(roomAtom) as Room
  return (
    <div className="flex items-center justify-between">
      <RoomCodeField room={room as Room} />
      <RoomStatusBadge status={room.status} />
    </div>
  )
}
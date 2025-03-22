import { useAtomValue } from "jotai"
import { motion } from "framer-motion"
import { RoomCodeField } from "./roomCode"
import { RoomStatusBadge } from "./roomStatusBadge"
import { Room } from "@/types/schemas"
import { roomAtom } from "@/lib/atoms"

export const Header = () => {
  const room = useAtomValue(roomAtom) as Room

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <RoomCodeField room={room as Room} />
      <RoomStatusBadge status={room.status} />
    </motion.div>
  )
}
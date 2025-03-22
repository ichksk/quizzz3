import { motion } from "framer-motion"
import { useAtomValue } from "jotai"

import { roomAtom } from "@/lib/atoms"
import { Room } from "@/types/schemas"

import { RoomCodeField } from "./roomCode"
import { RoomStatusBadge } from "./roomStatusBadge"


export const Header = () => {
  const room = useAtomValue(roomAtom) as Room

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <RoomCodeField room={room as Room} />
      <RoomStatusBadge status={room.status} />
    </motion.div>
  )
}
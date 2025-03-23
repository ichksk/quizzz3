import { motion } from "framer-motion";
import { JSX } from "react";

import { Room } from "@/types/schemas";


export const Saved = (): JSX.Element => {
  const dummyRooms: Pick<Room, "roomCode">[] = [
    { roomCode: "ABC123" },
    { roomCode: "XYZ789" },
    { roomCode: "DEF456" },
  ];

  return (
    <motion.div
      className="max-w-lg w-full bg-white p-6 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-4">作成済みのルーム</h2>
      {dummyRooms.length > 0 ? (
        <ul>
          {dummyRooms.map((room) => (
            <motion.li
              key={room.roomCode}
              className="border-b py-2 last:border-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {room.roomCode}
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">ルームが存在しません</p>
      )}
    </motion.div>
  );
};

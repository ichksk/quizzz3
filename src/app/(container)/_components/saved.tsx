import { motion } from "framer-motion";
import { SavedRooms } from "@/types/schemas";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/server/cookies";


export const Saved = () => {
  const [savedRooms, setSavedRooms] = useState<SavedRooms>([]);

  const handleComebackRoom = async (roomCode: string) => {
    // ルームコードを元にルーム情報を取得
    console.log(roomCode)
  }

  useEffect(() => {

    (async () => {
      await setCookie("savedRooms", JSON.stringify([
        { roomCode: "3NUGO3" },
        { roomCode: "D8QDGI" },
      ]));

      const saved = await getCookie("savedRooms");
      if (saved) {
        setSavedRooms(JSON.parse(saved));
      } else {
      }
    })()

  }, []);

  return (
    <motion.div
      className="max-w-lg w-full bg-white p-6 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-4">作成済みのルーム</h2>
      {savedRooms.length > 0 ? (
        <ul>
          {savedRooms.map((room) => (
            <motion.li
              key={room.roomCode}
              className="border-b py-2 last:border-0 flex justify-between items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span>{room.roomCode}</span>
              <motion.button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleComebackRoom(room.roomCode)}
              >
                復帰
              </motion.button>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">ルームが存在しません</p>
      )}
    </motion.div>
  );
};

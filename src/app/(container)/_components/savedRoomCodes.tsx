import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { comebackRoom } from "@/server/actions";
import { getCookie } from "@/server/cookies";
import { SavedRooms } from "@/types/schemas";



export const SavedRoomCodes = () => {
  const router = useRouter();

  const [savedRoomCodes, setRoomCodes] = useState<SavedRooms>([]);

  const handleComebackRoom = async (roomCode: string) => {
    // ルームコードを元にルーム情報を取得
    const { success, error } = await comebackRoom({ roomCode });
    if (!success) {
      toast.error(error!);
    } else {
      router.push("/room");
    }
  }

  useEffect(() => {
    (async () => {
      const savedRoomCodes = await getCookie("savedRoomCodes");
      if (savedRoomCodes) {
        setRoomCodes(JSON.parse(savedRoomCodes));
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
      {savedRoomCodes.length > 0 ? (
        <ul>
          {savedRoomCodes.map((roomCode) => (
            <motion.li
              key={roomCode}
              className="border-b py-2 last:border-0 flex justify-between items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span>{roomCode}</span>
              <motion.button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleComebackRoom(roomCode)}
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

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
    const { success, error } = await comebackRoom({ roomCode });
    if (!success) {
      toast.error(error!);
    } else {
      router.push("/room");
    }
  };

  useEffect(() => {
    (async () => {
      const savedRoomCodes = await getCookie("savedRoomCodes");
      if (savedRoomCodes) {
        setRoomCodes(JSON.parse(savedRoomCodes));
      }
    })();
  }, []);

  if (savedRoomCodes.length === 0) return null;

  return (
    <motion.div
      className="max-w-lg w-full bg-white p-6 rounded-2xl shadow-2xl border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
        作成済みのルーム
      </h2>
      <ul className="space-y-4">
        {savedRoomCodes.map((roomCode, index) => (
          <motion.li
            key={roomCode}
            className="bg-gray-100 hover:bg-gray-200 rounded-xl px-5 py-3 flex justify-between items-center shadow-sm transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <span className="font-mono text-lg text-blue-600">{roomCode}</span>
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg text-sm shadow-md transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleComebackRoom(roomCode)}
            >
              🚀 復帰
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

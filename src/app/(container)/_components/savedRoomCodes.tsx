import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { comebackRoom } from "@/server/actions";
import { getCookie, setCookie } from "@/server/cookies";
import { SavedRooms } from "@/types/schemas";
import { LogIn, Trash2 } from "lucide-react";
import { Confirm } from "@/components/confirm";

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

  const handleDeleteRoom = (roomCode: string) => {
    Confirm.call({
      message: "本当に削除しますか？",
    }).then(async (confirmed) => {
      if (!confirmed) return;
      const newRoomCodes = savedRoomCodes.filter((code) => code !== roomCode);
      setRoomCodes(newRoomCodes);
      await setCookie("savedRoomCodes", JSON.stringify(newRoomCodes));
    })
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
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800 text-center">
        作成済みのルーム
      </h2>
      <ul className="space-y-4">
        {savedRoomCodes.map((roomCode, index) => (
          <motion.li
            key={roomCode}
            className="bg-gray-100 hover:bg-gray-200 rounded-xl px-5 py-3 flex justify-between items-center shadow-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.2, ease: "easeOut" }}
          >
            <span className="font-mono text-lg text-blue-600">{roomCode}</span>
            <div className="flex space-x-2">
              <motion.button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg text-sm shadow flex items-center gap-1 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleComebackRoom(roomCode)}
              >
                <LogIn size={16} />
                復帰
              </motion.button>
              <motion.button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg text-sm shadow flex items-center gap-1 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleDeleteRoom(roomCode)}
              >
                <Trash2 size={16} />
                削除
              </motion.button>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

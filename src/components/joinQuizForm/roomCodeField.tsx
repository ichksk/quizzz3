import { joinQuizFormAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useLayoutEffect } from "react";
import { motion } from "framer-motion";

export const RoomCodeField = () => {
  const [form, setForm] = useAtom(joinQuizFormAtom)
  const params = useSearchParams()

  useLayoutEffect(() => {
    setForm(prev => ({
      ...prev,
      roomCode: params.get('r') || prev.roomCode,
    }))
  }, [params])

  const handleRoomCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setForm(prev => ({
      ...prev,
      roomCode: value,
    }));
  };

  return (
    <div className="space-y-2">
      <motion.label
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        htmlFor="roomCode"
        className="block font-medium text-gray-700 flex items-center"
      >
        <span className="mr-2">🎫</span>
        ルームコード
      </motion.label>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative"
      >
        <input
          type="text"
          id="roomCode"
          value={form.roomCode}
          onChange={handleRoomCodeChange}
          className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                   shadow-sm hover:shadow transition-all duration-200"
          placeholder="例: QUIZ123"
        />
      </motion.div>
    </div>
  )
}
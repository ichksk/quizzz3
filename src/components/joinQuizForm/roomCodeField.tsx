import { joinQuizFormAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useLayoutEffect } from "react";


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
      <label htmlFor="roomCode" className="block font-medium">
        ルームコード
      </label>
      <input
        type="text"
        id="roomCode"
        value={form.roomCode}
        onChange={handleRoomCodeChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="例: QUIZ123"
      />
    </div>
  )
}
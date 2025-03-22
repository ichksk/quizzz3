import { joinQuizFormAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, FocusEvent, useLayoutEffect } from "react";

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

  const handleRoomCodeBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    // normalize("NFKC") で全角英数字を半角に変換し、toUpperCase() で小文字を大文字に変換
    const normalized = value.normalize("NFKC").toUpperCase();
    setForm(prev => ({
      ...prev,
      roomCode: normalized,
    }));
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="roomCode"
        className="block font-medium text-gray-700 flex items-center"
      >
        ルームコード
      </label>
      <div className="relative">
        <input
          type="text"
          id="roomCode"
          value={form.roomCode}
          onChange={handleRoomCodeChange}
          onBlur={handleRoomCodeBlur}
          className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent
                   shadow-sm hover:shadow transition-all duration-200"
          placeholder="例: QUIZ123"
        />
      </div>
    </div>
  )
}

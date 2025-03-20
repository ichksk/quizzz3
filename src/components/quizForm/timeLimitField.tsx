import { quizFormAtom } from "@/lib/atoms"
import { useAtom } from "jotai"

export const TimeLimitField = () => {
  const [form, setForm] = useAtom(quizFormAtom)

  return (
    <div className="space-y-2">
      <label htmlFor="timeLimit" className="block font-medium">
        制限時間
      </label>
      <select
        id="timeLimit"
        name="timeLimit"
        value={form.timeLimit}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            // "no-limit" を選択したときだけ Infinity をセットしたい場合
            timeLimit: e.target.value === "no-limit"
              ? Infinity
              : Number(e.target.value),
          }))
        }
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option
          value="no-limit"
        >
          制限時間なし
        </option>
        {[10, 20, 30, 40, 50, 60].map((seconds) => (
          <option
            key={seconds}
            value={seconds}
          >
            {seconds}秒
          </option>
        ))}
      </select>
    </div>
  )
}

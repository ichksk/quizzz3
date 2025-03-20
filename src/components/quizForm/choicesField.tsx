import { Trash2, Plus } from "lucide-react"
import { useAtom } from "jotai"
import { quizFormAtom } from "@/lib/atoms"

export const ChoicesField = () => {
  const [quizForm, setQuizForm] = useAtom(quizFormAtom)

  return (
    <div className="space-y-4">
      <label className="block font-medium">選択肢（4つまで）</label>
      <p className="text-sm text-gray-600">
        正解となる選択肢のラジオボタンにチェックを入れてください。
      </p>
      <div className="space-y-3">
        {quizForm.choices.map((value, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              type="radio"
              id={`correct-${index}`}
              name="correct-answer"
              className="w-4 h-4 cursor-pointer"
              value={index}
              checked={index === quizForm.correctChoiceIndex}
              onChange={() => {
                setQuizForm((prev) => ({
                  ...prev,
                  correctChoiceIndex: index,
                }))
              }}
            />
            <input
              type="text"
              id={`choice-${index}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`選択肢 ${index + 1}`}
              name={`choice-${index}`}
              onChange={(e) => {
                setQuizForm((prev) => ({
                  ...prev,
                  choices: prev.choices.map((choice, i) =>
                    i !== index ? choice : e.target.value
                  ),
                }))
              }}
              value={value}
            />
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
              onClick={() => {
                setQuizForm((prev) => ({
                  ...prev,
                  choices: prev.choices.filter((_, i) => i !== index),
                  correctChoiceIndex:
                    prev.correctChoiceIndex && prev.correctChoiceIndex > index
                      ? prev.correctChoiceIndex - 1
                      : prev.correctChoiceIndex,
                }))
              }}
              aria-label="選択肢を削除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div
        className={`
          transition-all duration-500 ease-out delay-200
          ${quizForm.choices.length < 4
            ? "opacity-100 h-10"
            : "opacity-0 h-0 overflow-hidden"
          }
        `}
      >
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          onClick={() => {
            setQuizForm((prev) => ({
              ...prev,
              choices: [...prev.choices, ""],
            }))
          }}
          disabled={quizForm.choices.length >= 4}
        >
          <Plus className="w-4 h-4" />
          選択肢を追加
        </button>
      </div>
    </div>
  )
}
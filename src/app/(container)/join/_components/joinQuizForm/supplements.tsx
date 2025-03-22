export const Supplements = () => {
  const steps = [
    "クイズの主催者からルームコードを受け取ってください",
    "ユーザー名を入力して「参加する」をクリックしてください",
    "ゲーム画面に移動したら、開始の合図をお待ちください"
  ];

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <span className="text-xl mr-2">📝</span>
        <h2 className="font-medium text-gray-800">参加方法</h2>
        <div className="h-0.5 flex-grow ml-4 bg-gradient-to-r from-green-300/50 to-teal-400/30 rounded-full"></div>
      </div>

      <ul className="text-sm text-gray-600 space-y-4">
        {steps.map((text, index) => (
          <li
            key={index}
            className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs mr-3 mt-0.5 flex-shrink-0">
              {index + 1}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
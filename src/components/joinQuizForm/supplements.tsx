export const Supplements = () => {
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h2 className="font-medium mb-2">📝 参加方法</h2>
      <ul className="text-sm text-gray-600 space-y-2">
        {[
          "クイズの主催者からルームコードを受け取ってください",
          "ユーザー名を入力して「参加する」をクリックしてください",
          "ゲーム画面に移動したら、開始の合図をお待ちください"
        ].map((text, index) => (
          <li key={index} className="flex">
            <span className="mr-2">•</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
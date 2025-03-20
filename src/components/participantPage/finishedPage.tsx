import { Trophy, Medal, Target } from 'lucide-react';

export async function FinishedPage() {
  // ダミーデータ
  const results = [
    { id: 1, name: "Player 1", score: 800, correctAnswers: 8, answeredTime: 45 },
    { id: 2, name: "Player 2", score: 650, correctAnswers: 7, answeredTime: 52 },
    { id: 3, name: "Player 3", score: 450, correctAnswers: 5, answeredTime: 58 },
  ];

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return "text-yellow-400";
      case 1: return "text-gray-400";
      case 2: return "text-orange-400";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 結果ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">クイズ終了！</h1>
        <p className="text-gray-600">全員の回答が完了しました</p>
      </div>

      {/* 上位3名の表彰台 */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
            順位
          </h2>
          <div className="flex justify-around items-end mb-4">
            {/* 2位 */}
            <div className="text-center">
              <div className="w-20 h-24 bg-gray-200 rounded-t-lg flex items-end justify-center">
                <div className="mb-2">
                  <Medal className={`w-8 h-8 ${getMedalColor(1)}`} />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-bold">{results[1].name}</div>
                <div className="text-sm text-gray-600">{results[1].score}pt</div>
              </div>
            </div>
            {/* 1位 */}
            <div className="text-center">
              <div className="w-20 h-32 bg-gray-200 rounded-t-lg flex items-end justify-center">
                <div className="mb-2">
                  <Medal className={`w-8 h-8 ${getMedalColor(0)}`} />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-bold">{results[0].name}</div>
                <div className="text-sm text-gray-600">{results[0].score}pt</div>
              </div>
            </div>
            {/* 3位 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-t-lg flex items-end justify-center">
                <div className="mb-2">
                  <Medal className={`w-8 h-8 ${getMedalColor(2)}`} />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-bold">{results[2].name}</div>
                <div className="text-sm text-gray-600">{results[2].score}pt</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細な結果 */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-500" />
            詳細結果
          </h2>
          <div className="space-y-4">
            {results.map((player, index) => (
              <div
                key={player.id}
                className="p-4 bg-white rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">
                    {index + 1}位: {player.name}
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {player.score}pt
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>正答数: {player.correctAnswers}/10問</div>
                  <div>平均回答時間: {player.answeredTime}秒</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

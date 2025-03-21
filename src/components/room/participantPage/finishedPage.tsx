import { Trophy, Medal, Target } from 'lucide-react';

export function FinishedPage() {

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

      {/* 結果テーブル */}
      {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">順位表</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left">順位</th>
                <th className="py-3 px-4 text-left">プレイヤー</th>
                <th className="py-3 px-4 text-left">スコア</th>
                <th className="py-3 px-4 text-left">正解数</th>
                <th className="py-3 px-4 text-left">回答時間</th>
              </tr>
            </thead>
            <tbody>
              {results.map((player, index) => (
                <tr key={player.id} className="border-t">
                  <td className="py-4 px-4 flex items-center">
                    {index < 3 ? (
                      <span className={`mr-2 ${getMedalColor(index)}`}>
                        {index === 0 ? <Trophy size={20} /> : index === 1 ? <Medal size={20} /> : <Target size={20} />}
                      </span>
                    ) : null}
                    {index + 1}
                  </td>
                  <td className="py-4 px-4">{player.name}</td>
                  <td className="py-4 px-4 font-bold">{player.score}</td>
                  <td className="py-4 px-4">{player.correctAnswers} / 10</td>
                  <td className="py-4 px-4">{player.answeredTime}秒</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* ホームに戻るボタン */}
      <div className="text-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-full font-semibold transition-colors shadow-md flex items-center mx-auto"
          onClick={() => window.location.href = '/'}
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
};

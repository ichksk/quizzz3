import { Loading } from '@/components/loading';

import { LeaveRoomButton } from '@/components/leaveRoomButton';

export async function WaitingPage({ room }: { room: any }) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
      {/* メインコンテンツ */}
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold mb-2">ルームID: {decodeURIComponent(room.roomCode)}</h1>
        <Loading />
        <p className="text-xl text-gray-700">
          ゲーム開始までお待ちください
        </p>
        <p className="text-sm text-gray-500">
          主催者がゲームを開始すると自動的に画面が切り替わります
        </p>
      </div>

      <LeaveRoomButton />
    </div>
  );
}
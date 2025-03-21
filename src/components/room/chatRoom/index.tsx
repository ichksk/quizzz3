import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAtomValue } from 'jotai';
import { roomAtom } from '@/lib/atoms';
import { ChatMessageWithId } from '@/types/schemas';



export const ChatRoom = () => {
  const [messages, setMessages] = useState<ChatMessageWithId[]>([]);
  const room = useAtomValue(roomAtom)

  useEffect(() => {
    if (!room) return;

    // rooms/${room?.roomCode}/chat コレクションの参照
    const chatCollection = collection(db, `rooms/${room?.roomCode}/chat`);
    // 送信時刻順にソート
    const q = query(chatCollection, orderBy('createdAt', 'asc'));

    // onSnapshot によりリアルタイムに変更を検知
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ChatMessageWithId[];
      setMessages(msgs);
    });

    // クリーンアップ関数でリスナー解除
    return () => unsubscribe();
  }, [room?.roomCode]);

  return (
    <div>
      <h1>チャットルーム</h1>
      <div>
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.sender?.name}: </strong>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

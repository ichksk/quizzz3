import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

import { roomAtom } from '@/lib/atoms';
import { db } from '@/lib/firebase';
import { ChatMessageWithId } from '@/types/schemas';

export const ChatRoom = () => {
  const [messages, setMessages] = useState<ChatMessageWithId[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const room = useAtomValue(roomAtom);

  useEffect(() => {
    if (!room) return;

    // rooms/${room.roomCode}/chat コレクションの参照
    const chatCollection = collection(db, `rooms/${room.roomCode}/chat`);
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

  // メッセージ送信用のハンドラー
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !newMessage.trim()) return;

    const chatCollection = collection(db, `rooms/${room.roomCode}/chat`);
    const messageData = {
      message: newMessage,
      sender: { id: 'someUserId', name: 'aaa' }, // ここは実際のユーザー情報に置き換えてください
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(chatCollection, messageData);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

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
      {/* テキストフィールドと送信ボタン */}
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button type="submit">送信</button>
      </form>
    </div>
  );
};

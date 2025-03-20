"use server";

import { revalidatePath } from "next/cache";
import { adminDB } from "@/lib/firebase-admin"; // Firebase Admin SDK の初期化 (credential設定済み)

// ルームに参加するためのサーバーアクション
export async function joinRoom(
  roomCode: string,
  username: string,
  isOwner: boolean = false
) {
  try {
    // 1. ルームが存在するか確認 (doc(roomCode) として実装)
    const roomRef = adminDB.collection("rooms").doc(roomCode);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      // ルームが見つからない場合
      return {
        success: false,
        error: "指定されたルームが存在しません。ルームコードを確認してください。"
      };
    }

    // 2. 同じユーザー名が既に存在しないか確認
    const participantRef = roomRef.collection("participants").doc(username);
    const participantSnap = await participantRef.get();
    if (participantSnap.exists) {
      // 同じユーザー名のドキュメントが既にある => 重複
      return {
        success: false,
        error: "このユーザー名は既に使用されています。別の名前を選択してください。"
      };
    }

    // 3. 新規参加者をサブコレクションに追加
    const participantData = {
      username,
      isOwner,
      joinedAt: new Date(),
    };
    await participantRef.set(participantData);

    // 4. ページを再検証 (ルーム画面を更新)
    //    Server Action 内でのみ有効 (App Router想定)
    revalidatePath(`/room`);

    return {
      success: true,
      participant: {
        // Firestore にはドキュメントIDも実際にはありませんが、username をID代わりに
        id: username,
        ...participantData,
      },
      // ルームの情報 (必要なら roomSnap.data() を展開)
      room: {
        id: roomCode,
        ...roomSnap.data(),
      } as {
        id: string,
        roomCode: string,
      },
    };
  } catch (error) {
    console.error("ルーム参加処理でエラーが発生しました:", error);
    return {
      success: false,
      error: "ルームへの参加中に問題が発生しました。もう一度お試しください。",
    };
  }
}

"use server";

import { adminDB } from "@/lib/firebase-admin";
import admin from "firebase-admin"
import { Room, Participant, RoomStatus, QuizStatus } from "@/types/models";
import { getCookie, setCookie } from "./cookies";
import { ParticipantResponse } from "@/types/schemas";

function generateRandomCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createRoom(username: string): Promise<Room> {
  // 重複を避けるため、存在チェックを繰り返す簡易実装
  let roomCode = generateRandomCode();
  let docRef = adminDB.collection("rooms").doc(roomCode);
  let docSnap = await docRef.get();

  while (docSnap.exists) {
    roomCode = generateRandomCode();
    docRef = adminDB.collection("rooms").doc(roomCode);
    docSnap = await docRef.get();
  }

  const newRoom: Room = {
    roomCode: roomCode,
    currentOrder: 0,
    status: RoomStatus.WAITING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Roomドキュメントを作成
  await docRef.set(newRoom);

  // 作成したRoomのparticipantsサブコレクションに、
  // 「オーナー」を示すParticipantドキュメントを追加
  const participantRef = docRef.collection("participants").doc();
  const newOwner: Participant = {
    id: participantRef.id,
    roomCode: roomCode,
    score: 0,
    username,
    isOwner: true, // オーナーであることを示すフラグなどを追加
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await participantRef.set(newOwner);

  return newRoom;
}

export async function createQuiz({
  roomCode,
  question,
  choices,
  timeLimit,
  order
}: {
  roomCode: string;
  question: string;
  choices: { text: string; isCorrect: boolean }[];
  timeLimit?: number;
  order: number;
}) {
  try {
    // 1. Firestore の書き込み用のタイムスタンプを取得
    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

    // 2. quiz ドキュメントを作成
    const quizRef = await adminDB
      .collection("rooms")
      .doc(roomCode)
      .collection("quizzes")
      .add({
        roomCode,
        question,
        timeLimit: timeLimit ?? 0,
        order,
        status: QuizStatus.DRAFT,
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
      });

    // 3. quizChoices をクイズのサブコレクションに一括作成
    const quizChoicesPromises = choices.map((choice, index) => {
      return adminDB
        .collection("rooms")
        .doc(roomCode)
        .collection("quizzes")
        .doc(quizRef.id)
        .collection("quizChoices")
        .add({
          text: choice.text,
          isCorrect: choice.isCorrect,
          order: index,
          createdAt: serverTimestamp,
          updatedAt: serverTimestamp,
        });
    });

    await Promise.all(quizChoicesPromises);

    const quiz = {
      id: quizRef.id,
    };

    return { success: true, quiz };
  } catch (error) {
    console.error("クイズ作成エラー:", error);
    return { success: false, error: "クイズの作成に失敗しました" };
  }
}


export async function joinRoom(
  roomCode: string,
  username: Participant["username"],
  isOwner = false,
): Promise<Participant> {
  const roomRef = adminDB.collection("rooms").doc(roomCode);
  const roomSnap = await roomRef.get();

  if (!roomSnap.exists) {
    throw new Error("指定されたRoomは存在しません。");
  }

  const room = roomSnap.data() as Room;
  if (room.status !== RoomStatus.WAITING) {
    throw new Error("このRoomは現在参加できる状態ではありません。");
  }

  // 新しい participant のドキュメントリファレンスを生成
  const participantRef = roomRef.collection("participants").doc();
  const newParticipant: Participant = {
    id: participantRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    username,
    roomCode,
    isOwner,
    score: 0,
  };

  await participantRef.set(newParticipant);

  await setCookie("participantId", newParticipant.id);
  await setCookie("roomCode", roomCode);
  await setCookie("username", username);

  return newParticipant;
}

export async function leaveRoom() {
  const roomCode = await getCookie("roomCode");
  const participantId = await getCookie("participantId");

  if (!roomCode || !participantId) {
    throw new Error("ルーム情報が取得できませんでした");
  }
  try {
    // 1. 対象の participant ドキュメントを削除
    await adminDB
      .collection("rooms")
      .doc(roomCode)
      .collection("participants")
      .doc(participantId)
      .delete();

    await setCookie("participantId", "");
    await setCookie("roomCode", "");

    // 2. まだ参加者が残っているか確認
    const participantsSnap = await adminDB
      .collection("rooms")
      .doc(roomCode)
      .collection("participants")
      .get();

    // 3. 参加者が 0 人の場合、部屋を削除
    if (participantsSnap.empty) {
      await adminDB.collection("rooms").doc(roomCode).delete();
    }

    return { success: true };
  } catch (error) {
    console.error("部屋の退出エラー:", error);
    return { success: false, error: "部屋の退出に失敗しました。" };
  }
}


export async function getParticipant(): Promise<{
  participant: ParticipantResponse | null;
  error: string | null;
}> {
  const roomCode = await getCookie("roomCode");
  const participantId = await getCookie("participantId");

  if (!roomCode || !participantId) {
    return {
      participant: null,
      error: "Room code or participant ID not found."
    };
  }

  try {
    // 1. Firestore のドキュメント参照を取得
    const participantRef = adminDB
      .collection("rooms")
      .doc(roomCode)
      .collection("participants")
      .doc(participantId);

    // 2. ドキュメントの取得
    const participantDoc = await participantRef.get();

    // 3. ドキュメントが存在しない場合
    if (!participantDoc.exists) {
      return {
        participant: null,
        error: "Participant does not exist."
      };
    }

    // 4. Firestore から取得した DocumentData を任意の型に変換
    const data = participantDoc.data();
    if (!data) {
      return {
        participant: null,
        error: "No data found for the participant."
      };
    }

    // 5. 返却用の Participant 型に整形
    const participant: ParticipantResponse = {
      id: participantDoc.id,
      roomCode: data.roomCode ?? "",
      username: data.username ?? "",
      isOwner: data.isOwner ?? false,
      score: data.score ?? 0,
    };

    return { participant, error: null };
  } catch (error) {
    console.error("getParticipant error:", error);
    return {
      participant: null,
      error: "Could not get participant."
    };
  }
}
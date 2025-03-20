"use server";

import { adminDB } from "@/lib/firebase-admin";
import { Room, Quiz, Participant, RoomStatus, QuizStatus } from "@/types/models";

/**
 * ランダムな6桁の英数字の文字列を生成する関数
 */
function generateRandomCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * 1. createRoom関数
 *    - ランダムな6桁の英数字のroomCodeを生成して、それをIDとしてRoomを作成する
 *    - usernameをオーナーとしてparticipantsサブコレクションに追加
 */
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

/**
 * 2. createQuiz関数
 *    roomドキュメントの中にサブドキュメントとして存在するquizzesに、quizを追加する
 *
 * @param roomCode 参加するルームのコード
 * @param quizData Quiz データ（id, createdAt, updatedAt はここで付与するため省略）
 */
export async function createQuiz(
  roomCode: string,
  quizData: Omit<Quiz, "id" | "roomCode" | "createdAt" | "updatedAt">
): Promise<Quiz> {
  const roomRef = adminDB.collection("rooms").doc(roomCode);
  const roomSnap = await roomRef.get();

  if (!roomSnap.exists) {
    throw new Error("指定されたRoomが存在しません。");
  }

  // 新しい quiz 用のドキュメントリファレンス
  const quizRef = roomRef.collection("quizzes").doc();
  const newQuiz: Quiz = {
    ...quizData,
    id: quizRef.id,
    roomCode: roomCode,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: QuizStatus.WAITING
  };

  await quizRef.set(newQuiz);
  return newQuiz;
}

/**
 * 3. joinRoom関数
 *    roomCode を指定して、ドキュメントが存在し、かつ status が WAITING であれば参加する。
 *    room ドキュメント内のサブドキュメント participants に追加する。
 *
 * @param roomCode 入室したいルームのコード
 * @param username 参加者データ（id, createdAt, updatedAt は付与するため省略）
 */
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
  return newParticipant;
}

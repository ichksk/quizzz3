"use server";

import { adminDB } from "@/lib/firebase-admin";
import { getCookie, setCookie } from "./cookies";
import { Participant, QuizForOwner, QuizForParticipant, QuizStatus, RoomDocument, RoomForOwner, RoomForParticipant, RoomStatus } from "@/types/schemas";
import { get } from "http";

function generateRandomCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createRoom(username: string): Promise<RoomDocument> {
  // 重複を避けるため、存在チェックを繰り返す簡易実装
  let roomCode = generateRandomCode();
  let docRef = adminDB.collection("rooms").doc(roomCode);
  let docSnap = await docRef.get();

  while (docSnap.exists) {
    roomCode = generateRandomCode();
    docRef = adminDB.collection("rooms").doc(roomCode);
    docSnap = await docRef.get();
  }

  const newRoom: RoomDocument = {
    roomCode: roomCode,
    currentOrder: 0,
    status: RoomStatus.WAITING,
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
  };

  await participantRef.set(newOwner);
  await setCookie("participantId", newOwner.id);
  await setCookie("roomCode", roomCode);
  await setCookie("username", username);
  return newRoom;
}

export async function createQuiz({
  roomCode,
  image,
  question,
  choices,
  correctChoiceIndex,
  timeLimit,
  order,
}: {
  roomCode: string;
  image: string | null;
  question: string;
  choices: string[];
  correctChoiceIndex: number;
  timeLimit?: number;
  order: number;
}) {
  try {

    // 1. quiz ドキュメントを作成
    const quizRef = await adminDB
      .collection("rooms")
      .doc(roomCode)
      .collection("quizzes")
      .add({
        roomCode,
        question,
        timeLimit: timeLimit ?? 0,
        order,
        image,
        status: QuizStatus.DRAFT,
        choices,
        correctChoiceIndex,
      });

    const quiz = {
      id: quizRef.id,
    };

    return { success: true, quiz };
  } catch (error) {
    console.error("クイズ作成エラー:", error);
    return { success: false, error: "クイズの作成に失敗しました" };
  }
}

export const updateQuiz = async (
  quizId: string,
  {
    question,
    image,
    choices,
    correctChoiceIndex,
    timeLimit,
  }: {
    question: string;
    image: string | null;
    choices: string[];
    correctChoiceIndex: number;
    timeLimit: number;
  }
): Promise<{ success: boolean; quiz?: QuizForOwner; error?: string }> => {
  try {
    const roomCode = await getCookie("roomCode");
    if (!roomCode) {
      return { success: false, error: "Room code not found in cookies." };
    }
    const quizRef = adminDB
      .collection('rooms')
      .doc(roomCode)
      .collection("quizzes")
      .doc(quizId);

    // ドキュメントの更新を実行
    await quizRef.update({
      question,
      image,
      choices,
      correctChoiceIndex,
      timeLimit,
    });

    // 更新後のドキュメントを取得
    const updatedDoc = await quizRef.get();
    if (!updatedDoc.exists) {
      return { success: false, error: `Quiz with id ${quizId} not found.` };
    }

    // Firestore のドキュメントデータと id を組み合わせて返す
    const quiz = { id: updatedDoc.id, ...updatedDoc.data() } as QuizForOwner;
    return { success: true, quiz };
  } catch (error) {
    console.error("Quiz update error:", error);
    return { success: false, error: "Failed to update quiz." };
  }
};

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

  const room = roomSnap.data() as RoomDocument;
  if (room.status !== RoomStatus.WAITING) {
    throw new Error("このRoomは現在参加できる状態ではありません。");
  }

  // 新しい participant のドキュメントリファレンスを生成
  const participantRef = roomRef.collection("participants").doc();
  const newParticipant: Participant = {
    id: participantRef.id,
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
  participant: Participant | null;
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
    const participant: Participant = {
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


export async function getRoomData(): Promise<{
  room?: RoomForOwner | RoomForParticipant | null;
  error: string | null;
}> {
  try {
    // 1. Cookie から roomCode, participantId を取得
    const roomCode = await getCookie("roomCode")
    const participantId = await getCookie("participantId")

    if (!roomCode || !participantId) {
      return { error: "Room code or participant ID is missing in cookies." };
    }

    // 2. 対象の参加者ドキュメントを取得
    const participantRef = adminDB
      .collection("rooms")
      .doc(roomCode)
      .collection("participants")
      .doc(participantId);

    const participantSnap = await participantRef.get();
    if (!participantSnap.exists) {
      return { error: "Participant not found." };
    }

    const participantData = participantSnap.data() as Participant;

    // 3. 対象の部屋ドキュメントを取得
    const roomRef = adminDB.collection("rooms").doc(roomCode);
    const roomSnap = await roomRef.get();
    if (!roomSnap.exists) {
      return { error: "Room not found." };
    }

    const roomData = roomSnap.data();

    const status = (roomData?.status as RoomStatus) ?? RoomStatus.WAITING;
    const currentOrder = roomData?.currentOrder ?? 0;

    // 4. クイズ一覧を取得し、オーナー向け / 参加者向けに整形
    const quizzesSnap = await roomRef.collection("quizzes").get();

    const quizzesForOwner: QuizForOwner[] = [];
    const quizzesForParticipant: QuizForParticipant[] = [];

    for (const quizDoc of quizzesSnap.docs) {
      const quizData = quizDoc.data();
      const quizId = quizDoc.id;
      const question = quizData.question ?? "";
      const image = quizData.image ?? null;
      const order = quizData.order ?? 0;
      const quizStatus = quizData.status ?? "";
      const timeLimit = quizData.timeLimit ?? 0;
      const choices = quizData.choices ?? [];
      const correctChoiceIndex = quizData.correctChoiceIndex ?? 0;

      quizzesForOwner.push({
        id: quizId,
        roomCode,
        question,
        image,
        order,
        status: quizStatus,
        timeLimit,
        choices: choices,
        correctChoiceIndex
      });

      quizzesForParticipant.push({
        id: quizId,
        roomCode,
        question,
        image,
        order,
        status: quizStatus,
        timeLimit,
        choices: choices,
      });
    }

    // 5. オーナーの場合は RoomForOwner を返す
    if (participantData.isOwner) {
      // 参加者一覧を取得
      const participantsSnap = await roomRef.collection("participants").get();
      const participants: Participant[] = participantsSnap.docs.map((doc) => {
        const pData = doc.data();
        return {
          id: doc.id,
          roomCode: pData.roomCode ?? "",
          username: pData.username ?? "",
          isOwner: pData.isOwner ?? false,
          score: pData.score ?? 0,
        };
      });

      const roomForOwner: RoomForOwner = {
        roomCode,
        status,
        currentOrder,
        quizzes: quizzesForOwner,
        participants,
      };

      return {
        room: roomForOwner,
        error: null,
      };
    }

    // 6. オーナーではない場合は RoomForParticipant を返す
    const roomForParticipant: RoomForParticipant = {
      roomCode,
      status,
      currentOrder,
      quizzes: quizzesForParticipant,
    };

    return {
      room: roomForParticipant,
      error: null,
    };
  } catch (error) {
    console.error("getRoomData error:", error);
    return { error: "Failed to get room data." };
  }
}


export async function updateRoom({ newStatus }: { newStatus: RoomStatus }): Promise<{ success: boolean; error?: string }> {
  const { room } = await getRoomData()
  if (!room) {
    return { success: false, error: "Roomが見つかりません" };
  }

  try {
    const roomRef = adminDB.collection("rooms").doc(room.roomCode);
    const roomSnap = await roomRef.get();


    if (!roomSnap.exists) {
      return { success: false, error: "指定されたRoomが存在しません" };
    }

    await roomRef.update({
      status: newStatus,
    });

    return { success: true };
  } catch (error) {
    console.error("RoomStatus更新エラー:", error);
    return { success: false, error: "RoomStatusの更新に失敗しました" };
  }
}
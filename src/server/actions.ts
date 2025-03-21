"use server";

import { adminDB } from "@/lib/firebase-admin";
import admin from "firebase-admin";
import { getCookie, setCookie } from "./cookies";
import { ChatMessage, Participant, QuizAnswer, QuizAnswerSubmit, QuizForOwner, QuizForParticipant, QuizStatus, QuizSubmit, Room, RoomStatus, Sender } from "@/types/schemas";

function generateRandomCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createRoom(): Promise<Room> {
  const username = await getCookie("username");
  if (!username) {
    throw new Error("ユーザー名が設定されていません");
  }

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
  image,
  question,
  choices,
  correctChoiceIndex,
  timeLimit,
}: QuizSubmit) {
  try {
    const roomCode = await getCookie("roomCode");
    if (!roomCode) {
      return { success: false, error: "Room code not found in cookies." };
    }

    // Get the current number of quizzes to determine order
    const quizzesSnapshot = await adminDB
      .collection("rooms")
      .doc(roomCode)
      .collection("quizzes")
      .get();

    // 1. quiz ドキュメントを作成
    const quizRef = await adminDB
      .collection("rooms")
      .doc(roomCode)
      .collection("quizzes")
      .add({
        roomCode,
        question,
        timeLimit: timeLimit ?? 0,
        order: quizzesSnapshot.size,
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

    // Get all quizzes for the room
    const quizzesSnapshot = await adminDB
      .collection("rooms")
      .doc(roomCode)
      .collection("quizzes")
      .get();

    // Delete all answers from this participant for each quiz
    const deletePromises = quizzesSnapshot.docs.map(quizDoc =>
      adminDB
        .collection("rooms")
        .doc(roomCode)
        .collection("quizzes")
        .doc(quizDoc.id)
        .collection("answers")
        .doc(participantId)
        .delete()
    );

    await Promise.all(deletePromises);

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


export async function fetchParticipant(): Promise<{
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
    console.error("fetchParticipant error:", error);
    return {
      participant: null,
      error: "Could not get participant."
    };
  }
}



//ルーム
export async function fetchRoomData(): Promise<{
  room?: Room | null;
  error: string | null;
}> {
  try {
    const roomCode = await getCookie("roomCode")

    if (!roomCode) {
      return { error: "Room code or participant ID is missing in cookies." };
    }

    const roomRef = adminDB.collection("rooms").doc(roomCode);
    const roomSnap = await roomRef.get();
    if (!roomSnap.exists) {
      return { error: "Room not found." };
    }

    const roomData = roomSnap.data();
    const status = (roomData?.status as RoomStatus) ?? RoomStatus.WAITING;
    const currentOrder = roomData?.currentOrder ?? 0;

    const room: Room = {
      roomCode,
      status,
      currentOrder,
    }

    return {
      room,
      error: null,
    };
  } catch (error) {
    return { error: "Failed to get room data." };
  }
}


export async function updateRoom({ newStatus }: { newStatus: RoomStatus }): Promise<{ success: boolean; error?: string }> {
  const { room } = await fetchRoomData()
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

export async function fetchQuizzes(): Promise<{ success: boolean; error?: string, quizzes?: QuizForOwner[] | QuizForParticipant[] }> {
  const roomCode = await getCookie("roomCode");
  const { participant } = await fetchParticipant();
  if (!roomCode) {
    return { success: false, error: "Room code not found in cookies." };
  }
  if (!participant) {
    return { success: false, error: "Participant not found." };
  }

  const quizzesSnapshot = await adminDB.collection("rooms").doc(roomCode).collection("quizzes").get();
  const quizzes: QuizForOwner[] = quizzesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as QuizForOwner[];

  if (participant.isOwner) {
    return { success: true, quizzes };
  }
  else {
    const quizzesForParticipant: QuizForParticipant[] = quizzes.map(quiz => ({
      id: quiz.id,
      roomCode: quiz.roomCode,
      order: quiz.order,
      status: quiz.status,
      question: quiz.question,
      image: quiz.image,
      choices: quiz.choices,
      timeLimit: quiz.timeLimit,
    }))

    return {
      success: true, quizzes: quizzesForParticipant
    };
  }

}

export async function startQuiz(): Promise<{ success: boolean; error?: string }> {
  try {
    const { room } = await fetchRoomData();
    const { quizzes } = await fetchQuizzes();
    if (!room) {
      return { success: false, error: "Room not found" };
    }
    if (!quizzes) {
      return { success: false, error: "Quizzes not found" };
    }

    // Update room status to IN_PROGRESS
    const roomUpdateResult = await updateRoom({ newStatus: RoomStatus.IN_PROGRESS });
    if (!roomUpdateResult.success) {
      return roomUpdateResult;
    }

    const firstQuiz = quizzes.find(quiz => quiz.order === 0);
    if (firstQuiz) {
      await adminDB
        .collection('rooms')
        .doc(room.roomCode)
        .collection('quizzes')
        .doc(firstQuiz.id)
        .update({
          status: QuizStatus.DISPLAYING
        });
    }
    return { success: true };
  } catch (error) {
    console.error("Start quiz error:", error);
    return { success: false, error: "Failed to start quiz" };
  }
}



export const getQuizById = async (quizId: string): Promise<{ quiz: QuizForOwner | null; error: string | null }> => {
  try {
    const { room } = await fetchRoomData();
    if (!room) {
      return { quiz: null, error: "Room not found" };
    }

    const quizData = await adminDB.collection("rooms").doc(room.roomCode).collection("quizzes").doc(quizId).get()

    if (!quizData.exists) {
      return { quiz: null, error: "Quiz not found" };
    }

    const quiz = {
      id: quizData.id,
      ...quizData.data(),
    } as QuizForOwner;

    return {
      quiz, error: null
    };
  } catch (error) {
    console.error("Get quiz data error:", error);
    return { quiz: null, error: "Failed to get quiz data" };
  }
}











//クイズアンサー
export async function submitQuizAnswer({ quizId, choiceIndex }: QuizAnswerSubmit): Promise<{ success: boolean; error?: string }> {
  // Get participant and room info from cookies
  const participantId = await getCookie("participantId")
  const username = await getCookie("username")
  const roomCode = await getCookie("roomCode");

  if (!participantId || !username || !roomCode) {
    return { success: false, error: "Participant ID, username, or room code not found in cookies." };
  }

  // Check if participant has already answered this quiz
  const answersRef = adminDB.collection('rooms').doc(roomCode).collection('quizzes').doc(quizId).collection('answers');
  const existingAnswer = await answersRef.doc(participantId).get();

  if (existingAnswer.exists) {
    return { success: false, error: "You have already submitted an answer for this quiz." };
  }

  try {
    const { quiz } = await getQuizById(quizId)
    if (!quiz) {
      return { success: false, error: "Quiz not found." };
    }

    const isCorrect = quiz.correctChoiceIndex === choiceIndex;
    const score = isCorrect ? 100 : 0;

    const answer: QuizAnswer = {
      choiceText: quiz.choices[choiceIndex],
      correctChoiceText: quiz.choices[quiz.correctChoiceIndex],
      participantId,
      username,
      quizId: quizId,
      choiceIndex,
      isCorrect,
      score,
    };

    // Save answer using participant ID as the document ID instead of auto-generated ID
    await answersRef.doc(participantId).set({
      ...answer,
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting quiz answer: ", error);
    return { success: false, error: "Failed to submit quiz answer." };
  }
}



export async function getQuizAnswer(quizId: string) {
  try {
    const participantId = await getCookie("participantId");
    const roomCode = await getCookie("roomCode");

    if (!participantId || !roomCode) {
      return {
        success: false,
        data: null
      };
    }


    const answersRef = adminDB.collection('rooms').doc(roomCode).collection('quizzes').doc(quizId).collection('answers');
    const existingAnswer = await answersRef.doc(participantId).get();

    if (existingAnswer.exists) {
      return {
        success: true,
        data: existingAnswer.data() as QuizAnswer
      }
    } else {
      return {
        success: true,
        data: null
      }
    }
  } catch (error) {
    console.error("Error getting quiz answer: ", error);
    return {
      success: false,
      data: null
    }
  }
}

export async function proceedQuiz(): Promise<{ success: boolean; error?: string }> {
  try {
    const { room } = await fetchRoomData();
    const { quizzes } = await fetchQuizzes();

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    if (!quizzes || quizzes.length === 0) {
      return { success: false, error: "No quizzes found" };
    }

    // Get current quiz
    const currentQuiz = quizzes.find(quiz => quiz.order === room.currentOrder);
    if (!currentQuiz) {
      return { success: false, error: "Current quiz not found" };
    }

    // Handle different quiz states
    if (currentQuiz.status === QuizStatus.DISPLAYING) {
      // Change from DISPLAYING to ANSWER_CLOSED
      await adminDB
        .collection('rooms')
        .doc(room.roomCode)
        .collection('quizzes')
        .doc(currentQuiz.id)
        .update({ status: QuizStatus.ANSWER_CLOSED });

      return { success: true };
    }
    else if (currentQuiz.status === QuizStatus.ANSWER_CLOSED) {
      // Change from ANSWER_CLOSED to SHOWING_ANSWER
      await adminDB
        .collection('rooms')
        .doc(room.roomCode)
        .collection('quizzes')
        .doc(currentQuiz.id)
        .update({ status: QuizStatus.SHOWING_ANSWER });

      return { success: true };
    }
    else if (currentQuiz.status === QuizStatus.SHOWING_ANSWER) {
      await adminDB
        .collection('rooms')
        .doc(room.roomCode)
        .collection('quizzes')
        .doc(currentQuiz.id)
        .update({ status: QuizStatus.COMPLETED });

      // Calculate next order
      const nextOrder = room.currentOrder + 1;

      // Check if there's a next quiz
      const nextQuiz = quizzes.find(quiz => quiz.order === nextOrder);

      if (nextQuiz) {
        // Update room's currentOrder
        await adminDB
          .collection('rooms')
          .doc(room.roomCode)
          .update({ currentOrder: nextOrder });

        // Update next quiz status to DISPLAYING
        await adminDB
          .collection('rooms')
          .doc(room.roomCode)
          .collection('quizzes')
          .doc(nextQuiz.id)
          .update({ status: QuizStatus.DISPLAYING });

        return { success: true };
      } else {
        // No more quizzes, update room status to FINISHED
        await adminDB
          .collection('rooms')
          .doc(room.roomCode)
          .update({ status: RoomStatus.FINISHED });

        return { success: true };
      }
    }

    return { success: false, error: "Unknown quiz status" };
  } catch (error) {
    console.error("Proceed quiz error:", error);
    return { success: false, error: "Failed to proceed quiz" };
  }
}

export async function fetchQuizAnswerForParticipant(quizId: string): Promise<{ success: boolean; data: QuizAnswer | null }> {
  try {
    const participantId = await getCookie("participantId");
    const roomCode = await getCookie("roomCode");

    if (!participantId || !roomCode) {
      return {
        success: false,
        data: null
      };
    }

    const { quiz } = await getQuizById(quizId)
    if (!quiz || quiz.status !== QuizStatus.SHOWING_ANSWER) {
      return {
        success: false,
        data: null
      };
    }
    const answersRef = adminDB.collection('rooms').doc(roomCode).collection('quizzes').doc(quizId).collection('answers');
    const existingAnswer = await answersRef.doc(participantId).get();

    if (existingAnswer.exists) {
      return {
        success: true,
        data: existingAnswer.data() as QuizAnswer
      }
    } else {
      return {
        success: true,
        data: null
      }
    }
  } catch (error) {
    console.error("Error getting quiz answer: ", error);
    return {
      success: false,
      data: null
    }
  }
}


export async function sendChatMessage(message: string, sender: Sender) {
  // クッキーから roomCode を取得
  const roomCode = await getCookie("roomCode");
  if (!roomCode) {
    throw new Error("roomCode が見つかりません");
  }

  // rooms/${roomCode}/chat コレクションの参照
  const chatRef = adminDB.collection(`rooms/${roomCode}/chats`);

  // チャットメッセージのデータ作成
  const chatData: ChatMessage = {
    message,
    sender,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Firestore にドキュメント追加
  await chatRef.add(chatData);
}
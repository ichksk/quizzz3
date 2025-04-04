import admin from "firebase-admin";

export enum QuizStatus {
  DRAFT = 'DRAFT',
  DISPLAYING = 'DISPLAYING',
  ANSWER_CLOSED = 'ANSWER_CLOSED',
  SHOWING_ANSWER = 'SHOWING_ANSWER',
  COMPLETED = 'COMPLETED',
}

export enum RoomStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  DEACTIVATED = 'DEACTIVATED'
}


export interface JoinQuizForm {
  roomCode: string;
}


export interface Participant {
  id: string;
  roomCode: string;
  username: string;
  isOwner: boolean;
  score: number;
}

export interface Room {
  roomCode: string;
  status: RoomStatus;
  currentOrder: number;
  roomName?: string;
}

export type SavedRooms = Room["roomCode"][]

export interface QuizSubmitForm {
  question: string,
  image: File | null,
  imagePreview: string | null,
  choices: string[],
  correctChoiceIndex: number,
  timeLimit: number
}

export interface QuizSubmit {
  question: string,
  image: string | null,
  choices: string[],
  correctChoiceIndex: number,
  timeLimit: number
}

export interface QuizForParticipant {
  id: string;
  roomCode: string;
  question: string;
  image: string | null;
  order: number;
  status: QuizStatus;
  timeLimit: number;
  choices: string[];
}

export interface QuizForOwner extends QuizForParticipant {
  correctChoiceIndex: number;
}

// クライアントからの入力用インターフェース
export interface QuizAnswerSubmit {
  quizId: string;
  choiceIndex: number;
}

// firebaseに保存するデータの型
export interface QuizAnswer {
  participantId: string;
  username: string;
  quizId: string;
  choiceText: string;
  choiceIndex: number;
  isCorrect: boolean;
  correctChoiceText: string;
  score: number;
}




export type Sender = {
  id: string;
  name: string;
};

export type ChatMessage = {
  message: string;
  sender: Sender;
  createdAt: admin.firestore.FieldValue;
};


export interface ChatMessageWithId extends ChatMessage {
  id: string;
}
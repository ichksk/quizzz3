import { QuizStatus, RoomStatus } from "./models";

export interface Participant {
  id: string;
  roomCode: string;
  username: string;
  isOwner?: boolean;
  score?: number;
}

export interface RoomForOwner {
  roomCode: string;
  status: RoomStatus;
  currentOrder: number;
  quizzes: QuizForOwner[];
  participants: Participant[];
}

export interface RoomForParticipant {
  roomCode: string;
  status: RoomStatus;
  currentOrder: number;
  quizzes: QuizForParticipant[];
}

export interface QuizForOwner {
  id: string;
  roomCode: string;
  question: string;
  image: string | null;
  order: number;
  status: QuizStatus;
  timeLimit: number;
  choices: QuizChoiceForOwner[];
}

export interface QuizChoiceForOwner {
  id: string;
  text: string;
  order: number;
  isCorrect: boolean;
}

export interface QuizForParticipant {
  id: string;
  roomCode: string;
  question: string;
  image: string | null;
  order: number;
  status: QuizStatus;
  timeLimit: number;
  choices: QuizChoiceForParticipant[];
}

export interface QuizChoiceForParticipant {
  id: string;
  text: string;
  order: number;
}
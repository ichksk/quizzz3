export enum QuizStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
  WAITING = 'WAITING',
  DISPLAYING = 'DISPLAYING',
  ANSWERING = 'ANSWERING',
  ANSWER_CLOSED = 'ANSWER_CLOSED',
  SHOWING_ANSWER = 'SHOWING_ANSWER',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELETED = 'DELETED'
}

export enum RoomStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  DEACTIVATED = 'DEACTIVATED'
}


export interface Participant {
  id: string;
  roomCode: string;
  username: string;
  isOwner: boolean;
  score: number;
}

export interface RoomDocument {
  roomCode: string;
  status: RoomStatus;
  currentOrder: number;
}

export interface RoomForParticipant {
  roomCode: string;
  status: RoomStatus;
  currentOrder: number;
  quizzes: QuizForParticipant[];
}

export interface RoomForOwner extends RoomForParticipant {
  quizzes: QuizForOwner[];
  participants: Participant[];
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
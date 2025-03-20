// Enums
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

// Base model with common fields
export interface BaseModel {
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaces extending BaseModel
export interface Participant extends BaseModel {
  id: string;
  username: string;
  roomCode: string;
  isOwner: boolean;
  score: number;
  room?: Room;
  quizAnswers?: QuizAnswer[];
}

export interface QuizAnswer extends BaseModel {
  id: number;
  quizId: number;
  participantId: number;
  choiceId: number;
  answerTime?: number;
  points: number;
  quizChoices?: QuizChoice;
  participant?: Participant;
  quiz?: Quiz[];
}

export interface QuizChoice extends BaseModel {
  id: number;
  quizId: number;
  text: string;
  order: number;
  isCorrect: boolean;
  quizAnswers?: QuizAnswer[];
  quiz?: Quiz[];
}

export interface Quiz extends BaseModel {
  id: string;
  roomCode: string;
  question: string;
  image: string | null;
  order: number;
  status: QuizStatus;
  timeLimit: number;
  quizAnswers?: QuizAnswer[];
  quizChoices?: QuizChoice[];
  room?: Room;
}

export interface Room extends BaseModel {
  roomCode: string;
  status: RoomStatus;
  currentOrder: number;
  participants?: Participant[];
  quizzes?: Quiz[];
}
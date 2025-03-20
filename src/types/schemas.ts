
export interface ParticipantResponse {
  id: string;
  roomCode: string;
  username: string;
  isOwner?: boolean;
  score?: number;
}
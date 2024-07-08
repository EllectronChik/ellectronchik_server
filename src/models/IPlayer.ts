export interface IPlayer {
  id: string;
  name: string;
  avatarId: number;
  score: number;
  wins: number;
  isGuessed: boolean;
  isDrawing: boolean;
  isKing: boolean;
}

export interface InitialState {
  id: number;
  color: string;
  boards: Board[];
}

export interface LeaderboardPlayer {
  name: string;
  created_at: string;
  points: number;
  color: string;
}

export interface Board {
  board: string[];
  sol_index: number;
  sol_color: string;
}

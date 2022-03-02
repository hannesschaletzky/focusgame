export interface InitialState {
  id: number;
  color: string;
  boards: Board[];
}

export interface LeaderboardPlayer {
  name: string;
  created_at: string;
  rounds: number;
  color: string;
}

export interface Board {
  board: string[];
  sol_index: number;
}

export interface LeaderboardEntry {
  name: string;
  rounds: number;
  color: string;
  date: string; // ISO
}

export interface NewGame {
  id: string;
  boards: string[][]; // ohne Lösungsindex, der bleibt auf dem Server
}

export interface FinishedGame {
  rounds: number;
}

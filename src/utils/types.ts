export interface LeaderboardEntry {
  name: string;
  rounds: number;
  color: string;
  date: string; // ISO
  games: number; // alle beendeten Spiele dieses Namens
}

export interface Leaderboard {
  players: LeaderboardEntry[];
  totalGames: number; // alle beendeten Spiele insgesamt
}

export interface NewGame {
  id: string;
  boards: string[][]; // ohne Lösungsindex, der bleibt auf dem Server
}

export interface FinishedGame {
  rounds: number;
  games: number; // so viele Spiele hat dieser Name jetzt insgesamt beendet
}

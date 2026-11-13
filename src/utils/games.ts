import { randomUUID } from "node:crypto";
import { getDB } from "@/utils/db";
import { constructBoard } from "@/utils/board";
import {
  BOARDS_PER_GAME,
  CELLS_PER_BOARD,
  GAME_SECONDS,
  NAME_MAX_LENGTH,
  type Color,
} from "@/utils/constants";
import type { FinishedGame, Leaderboard, LeaderboardEntry, NewGame } from "@/utils/types";

// Spielraum für Netzwerk und Rendering nach Ablauf der 5 Sekunden
const GRACE_MS = 5_000;
// Die Startmeldung kommt etwas nach dem ersten Tipp an; so viel darf ein Spiel scheinbar zu kurz sein
const EARLY_TOLERANCE_MS = 1_000;
const STALE_MS = 60 * 60 * 1000;

export class GameError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const createGame = (color: Color): NewGame => {
  const db = getDB();
  const now = Date.now();
  // Nie beendete Spiele (Tab geschlossen o. ä.) aufräumen
  db.prepare("DELETE FROM games WHERE finished_at IS NULL AND started_at < ?").run(now - STALE_MS);

  const boards = Array.from({ length: BOARDS_PER_GAME }, () => constructBoard(color));
  const id = randomUUID();
  db.prepare("INSERT INTO games (id, color, solutions, started_at) VALUES (?, ?, ?, ?)").run(
    id,
    color,
    JSON.stringify(boards.map((b) => b.solution)),
    now
  );
  return { id, boards: boards.map((b) => b.cells) };
};

export const normalizeName = (raw: unknown): string => {
  if (typeof raw !== "string") throw new GameError(400, "Name fehlt");
  const name = raw.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, NAME_MAX_LENGTH);
  if (!name) throw new GameError(400, "Name fehlt");
  return name;
};

const parseClicks = (raw: unknown): number[] => {
  if (
    !Array.isArray(raw) ||
    raw.length > 10 * BOARDS_PER_GAME ||
    !raw.every((c) => Number.isInteger(c) && c >= 0 && c < CELLS_PER_BOARD)
  ) {
    throw new GameError(400, "Ungültige Klicks");
  }
  return raw;
};

// Erster Tipp: ab hier läuft das Zeitfenster. Wiederholte Meldungen ändern nichts.
export const beginGame = (id: string) => {
  const db = getDB();
  const game = db.prepare("SELECT finished_at FROM games WHERE id = ?").get(id) as
    | { finished_at: number | null }
    | undefined;
  if (!game) throw new GameError(404, "Spiel nicht gefunden");
  if (game.finished_at !== null) throw new GameError(409, "Spiel schon beendet");
  db.prepare("UPDATE games SET begun_at = ? WHERE id = ? AND begun_at IS NULL").run(Date.now(), id);
};

// Der Server zählt selbst: Klicks werden gegen die gespeicherten Lösungen nachgespielt
export const finishGame = (id: string, rawName: unknown, rawClicks: unknown): FinishedGame => {
  const name = normalizeName(rawName);
  const clicks = parseClicks(rawClicks);
  const db = getDB();
  const game = db
    .prepare("SELECT solutions, begun_at, finished_at FROM games WHERE id = ?")
    .get(id) as { solutions: string; begun_at: number | null; finished_at: number | null } | undefined;

  if (!game) throw new GameError(404, "Spiel nicht gefunden");
  if (game.finished_at !== null) throw new GameError(409, "Spiel schon beendet");

  if (game.begun_at === null) throw new GameError(400, "Spiel nie gestartet");

  const elapsed = Date.now() - game.begun_at;
  if (elapsed < GAME_SECONDS * 1000 - EARLY_TOLERANCE_MS) throw new GameError(400, "Zu früh beendet");
  if (elapsed > GAME_SECONDS * 1000 + GRACE_MS) throw new GameError(410, "Zeit abgelaufen");

  const solutions = JSON.parse(game.solutions) as number[];
  let rounds = 0;
  for (const click of clicks) {
    if (rounds < solutions.length && click === solutions[rounds]) rounds++;
  }

  // finished_at IS NULL schützt gegen doppeltes Absenden
  const result = db
    .prepare(
      "UPDATE games SET finished_at = ?, name = ?, rounds = ? WHERE id = ? AND finished_at IS NULL"
    )
    .run(Date.now(), name, rounds, id);
  if (result.changes !== 1) throw new GameError(409, "Spiel schon beendet");

  return { rounds, games: gamesPlayed(name) };
};

// Beendete Spiele eines Namens, ohne Groß/Klein zu unterscheiden (wie die Bestenliste)
export const gamesPlayed = (name: string): number =>
  (
    getDB()
      .prepare("SELECT COUNT(*) AS n FROM games WHERE finished_at IS NOT NULL AND lower(name) = lower(?)")
      .get(name) as { n: number }
  ).n;

// Alle beendeten Spiele, auch die mit 0 Punkten
export const totalGames = (): number =>
  (getDB().prepare("SELECT COUNT(*) AS n FROM games WHERE finished_at IS NOT NULL").get() as { n: number })
    .n;

// Top 10, pro Name (ohne Groß/Klein) nur der beste Lauf; bei Gleichstand gewinnt, wer zuerst da war
// Dazu pro Name die Zahl aller beendeten Spiele, auch der mit 0 Punkten
export const leaderboard = (): LeaderboardEntry[] => {
  const rows = getDB()
    .prepare(
      `SELECT best.name, best.rounds, best.color, best.finished_at, played.games FROM (
         SELECT name, rounds, color, finished_at,
                ROW_NUMBER() OVER (PARTITION BY lower(name) ORDER BY rounds DESC, finished_at ASC) AS rn
         FROM games
         WHERE finished_at IS NOT NULL AND rounds > 0
       ) AS best
       JOIN (
         SELECT lower(name) AS key, COUNT(*) AS games
         FROM games
         WHERE finished_at IS NOT NULL
         GROUP BY lower(name)
       ) AS played ON played.key = lower(best.name)
       WHERE best.rn = 1
       ORDER BY best.rounds DESC, best.finished_at ASC
       LIMIT 10`
    )
    .all() as { name: string; rounds: number; color: string; finished_at: number; games: number }[];
  return rows.map((r) => ({
    name: r.name,
    rounds: r.rounds,
    color: r.color,
    date: new Date(r.finished_at).toISOString(),
    games: r.games,
  }));
};

export const leaderboardWithTotals = (): Leaderboard => ({
  players: leaderboard(),
  totalGames: totalGames(),
});

import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { LEGACY_LEADERS } from "@/utils/seed";

const DB_PATH = process.env.DB_PATH ?? "./data/focus.db";

let db: DatabaseSync | undefined;

// Eine Zeile pro Spiel. "solutions" (JSON) kennt nur der Server,
// finished_at ist NULL, solange das Spiel läuft.
export const getDB = () => {
  if (db) return db;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS games (
      id          TEXT PRIMARY KEY,
      color       TEXT NOT NULL,
      solutions   TEXT NOT NULL,
      started_at  INTEGER NOT NULL,
      finished_at INTEGER,
      name        TEXT,
      rounds      INTEGER
    );
    CREATE INDEX IF NOT EXISTS games_finished ON games (finished_at, rounds);
  `);

  // Leere Datenbank: alte Bestenliste übernehmen
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM games").get() as { n: number };
  if (n === 0) {
    const insert = db.prepare(
      `INSERT INTO games (id, color, solutions, started_at, finished_at, name, rounds)
       VALUES (?, ?, '[]', ?, ?, ?, ?)`
    );
    for (const l of LEGACY_LEADERS) {
      const t = Date.parse(l.date);
      insert.run(randomUUID(), l.color, t, t, l.name, l.rounds);
    }
  }
  return db;
};

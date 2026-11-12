import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.DB_PATH ?? "./data/focus.db";

// Einmalige Änderungen an den Daten, der Reihe nach. Wie viele schon gelaufen sind,
// steht in PRAGMA user_version; jede läuft also genau einmal pro Datenbank.
const MIGRATIONS = [
  // 1: alte Highscores von 2021/22 entfernt (Reset der Bestenliste)
  "DELETE FROM games",
  // 2: Testeinträge entfernt, nur echte Spiele bleiben. Echte Spiele speichern
  //    die Lösungen ihrer Boards, Testeinträge hatten eine leere Liste.
  "DELETE FROM games WHERE solutions = '[]'",
];

let db: DatabaseSync | undefined;

// Eine Zeile pro Spiel. "solutions" (JSON) kennt nur der Server,
// begun_at ist der erste Tipp, finished_at ist NULL, solange das Spiel läuft.
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
      begun_at    INTEGER,
      finished_at INTEGER,
      name        TEXT,
      rounds      INTEGER
    );
    CREATE INDEX IF NOT EXISTS games_finished ON games (finished_at, rounds);
  `);

  // begun_at kam später dazu; ältere Datenbanken ergänzen
  const columns = db.prepare("PRAGMA table_info(games)").all() as { name: string }[];
  if (!columns.some((c) => c.name === "begun_at")) {
    db.exec("ALTER TABLE games ADD COLUMN begun_at INTEGER");
  }

  const { user_version } = db.prepare("PRAGMA user_version").get() as { user_version: number };
  if (user_version < MIGRATIONS.length) {
    db.exec("BEGIN");
    for (const sql of MIGRATIONS.slice(user_version)) db.exec(sql);
    db.exec(`PRAGMA user_version = ${MIGRATIONS.length}`);
    db.exec("COMMIT");
  }
  return db;
};

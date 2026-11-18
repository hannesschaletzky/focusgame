import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.DB_PATH ?? "./data/focus.db";

// Obergrenze für die Datei: 12800 Seiten à 4 KiB = 50 MiB. Ist sie erreicht, schlägt jeder
// Schreibversuch mit SQLITE_FULL fehl, statt die Platte des Servers zu füllen.
// Ein beendetes Spiel braucht rund 100 Byte, das reicht für mehrere Hunderttausend Spiele.
const MAX_PAGES = Number(process.env.DB_MAX_PAGES) || 12800;

export const isDiskFull = (err: unknown) =>
  err instanceof Error && /SQLITE_FULL|database or disk is full/i.test(err.message);

// Einmalige Änderungen an den Daten, der Reihe nach. Wie viele schon gelaufen sind,
// steht in PRAGMA user_version; jede läuft also genau einmal pro Datenbank.
const MIGRATIONS = [
  // 1: alte Highscores von 2021/22 entfernt (Reset der Bestenliste)
  "DELETE FROM games",
  // 2: Testeinträge entfernt, nur echte Spiele bleiben. Echte Spiele speichern
  //    die Lösungen ihrer Boards, Testeinträge hatten eine leere Liste.
  "DELETE FROM games WHERE solutions = '[]'",
  // 3: Lösungen beendeter Spiele leeren; sie werden nur bis zum Spielende gebraucht
  "UPDATE games SET solutions = '' WHERE finished_at IS NOT NULL",
];

let db: DatabaseSync | undefined;

// Eine Zeile pro Spiel. "solutions" (JSON) kennt nur der Server,
// begun_at ist der erste Tipp, finished_at ist NULL, solange das Spiel läuft.
export const getDB = () => {
  if (db) return db;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec(`
    PRAGMA page_size = 4096;
    PRAGMA journal_mode = WAL;
    PRAGMA journal_size_limit = 4194304;
    PRAGMA max_page_count = ${MAX_PAGES};
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

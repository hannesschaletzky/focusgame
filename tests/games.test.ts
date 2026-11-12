import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BOARDS_PER_GAME, CELLS_PER_BOARD, COLORS } from "@/utils/constants";

// Die Spiellogik auf dem Server: Boards erzeugen, Start und Ende prüfen, Punkte zählen, Bestenliste.
// Jeder Test bekommt eine frische Datenbank in einem eigenen Ordner.

type Games = typeof import("@/utils/games");

let dir: string;
let games: Games;

const T0 = new Date("2026-11-12T12:00:00Z").getTime();
const at = (ms: number) => vi.setSystemTime(T0 + ms);

beforeEach(async () => {
  dir = mkdtempSync(join(tmpdir(), "focus-test-"));
  process.env.DB_PATH = join(dir, "focus.db");
  vi.useFakeTimers({ toFake: ["Date"] });
  at(0);
  vi.resetModules(); // getDB hält die Verbindung im Modul, also pro Test neu laden
  games = await import("@/utils/games");
});

afterEach(() => {
  vi.useRealTimers();
  rmSync(dir, { recursive: true, force: true });
});

// Lösungen eines Spiels direkt aus der Datenbank, wie sie der Server kennt
const solutionsOf = (id: string) => {
  const db = new DatabaseSync(process.env.DB_PATH!);
  const row = db.prepare("SELECT solutions FROM games WHERE id = ?").get(id) as {
    solutions: string;
  };
  db.close();
  return JSON.parse(row.solutions) as number[];
};

// Ein komplettes Spiel: anlegen, nach `beginAfter` ms starten, nach `finishAfter` ms beenden
const play = (
  name: string,
  hits: number,
  { beginAfter = 0, finishAfter = 5_200, extraClicks = [] as number[] } = {}
) => {
  const { id } = games.createGame("red");
  const clicks = [...extraClicks, ...solutionsOf(id).slice(0, hits)];
  at(beginAfter);
  games.beginGame(id);
  at(beginAfter + finishAfter);
  return games.finishGame(id, name, clicks);
};

describe("createGame", () => {
  it("erzeugt 100 Boards mit genau einem Feld in der Zielfarbe", () => {
    const { id, boards } = games.createGame("red");
    expect(boards).toHaveLength(BOARDS_PER_GAME);
    const solutions = solutionsOf(id);
    boards.forEach((cells, i) => {
      expect(cells).toHaveLength(CELLS_PER_BOARD);
      expect(cells.filter((c) => c === "red")).toHaveLength(1);
      expect(cells.indexOf("red")).toBe(solutions[i]);
      cells.forEach((c) => expect(c === "transparent" || COLORS.includes(c as never)).toBe(true));
    });
  });

  it("schickt die Lösungen nicht mit", () => {
    const game = games.createGame("blue");
    expect(Object.keys(game).sort()).toEqual(["boards", "id"]);
  });
});

describe("Punkte zählen", () => {
  it("zählt nur Treffer der Reihe nach, Fehlklicks kosten nichts", () => {
    const { id } = games.createGame("red");
    const sol = solutionsOf(id);
    const miss = (i: number) => (sol[i] + 1) % CELLS_PER_BOARD;
    // Treffer, Fehlklick, Treffer, Treffer, zwei Fehlklicks, Treffer
    const clicks = [sol[0], miss(1), sol[1], sol[2], miss(3), miss(3), sol[3]];
    games.beginGame(id);
    at(5_100);
    expect(games.finishGame(id, "Anna", clicks)).toEqual({ rounds: 4 });
  });

  it("ein Klick auf eine spätere Lösung zählt nicht vor", () => {
    const { id } = games.createGame("red");
    const sol = solutionsOf(id);
    games.beginGame(id);
    at(5_100);
    // Lösung von Board 2 zuerst: zählt nur, wenn sie zufällig auch auf Board 1 liegt
    const expected = sol[1] === sol[0] ? 1 : 0;
    expect(games.finishGame(id, "Ben", [sol[1]]).rounds).toBe(expected);
  });
});

describe("Zeitfenster", () => {
  it("lehnt ein Ende ohne Start ab", () => {
    const { id } = games.createGame("red");
    at(6_000);
    expect(() => games.finishGame(id, "Cara", [])).toThrow("Spiel nie gestartet");
  });

  it("misst ab dem ersten Tipp, nicht ab dem Anlegen", () => {
    // 30 Sekunden umschauen, dann normal spielen
    expect(play("Dana", 3, { beginAfter: 30_000 })).toEqual({ rounds: 3 });
  });

  it("lässt eine Sekunde Spielraum nach unten (Startmeldung kommt später an)", () => {
    expect(play("Emil", 2, { finishAfter: 4_100 })).toEqual({ rounds: 2 });
  });

  it("lehnt ein deutlich zu frühes Ende ab", () => {
    expect(() => play("Finn", 2, { finishAfter: 3_900 })).toThrow("Zu früh beendet");
  });

  it("lehnt ein zu spätes Ende ab", () => {
    expect(() => play("Gina", 2, { finishAfter: 10_100 })).toThrow("Zeit abgelaufen");
  });

  it("ein zweiter Start verschiebt den Startzeitpunkt nicht", () => {
    const { id } = games.createGame("red");
    games.beginGame(id);
    at(4_000);
    games.beginGame(id); // wäre sonst ein Trick, um das Fenster zu verlängern
    at(10_500);
    expect(() => games.finishGame(id, "Hugo", [])).toThrow("Zeit abgelaufen");
  });
});

describe("Fehlerfälle", () => {
  it("unbekanntes Spiel", () => {
    expect(() => games.beginGame("nope")).toThrow("Spiel nicht gefunden");
    expect(() => games.finishGame("nope", "Ida", [])).toThrow("Spiel nicht gefunden");
  });

  it("doppeltes Beenden", () => {
    const { id } = games.createGame("red");
    games.beginGame(id);
    at(5_100);
    games.finishGame(id, "Jan", []);
    expect(() => games.finishGame(id, "Jan", [])).toThrow("Spiel schon beendet");
    expect(() => games.beginGame(id)).toThrow("Spiel schon beendet");
  });

  it.each([
    ["kein Array", "1,2"],
    ["Kommazahl", [1.5]],
    ["außerhalb des Boards", [CELLS_PER_BOARD]],
    ["negativ", [-1]],
    ["zu viele", Array(1001).fill(0)],
  ])("ungültige Klicks: %s", (_, clicks) => {
    const { id } = games.createGame("red");
    games.beginGame(id);
    at(5_100);
    expect(() => games.finishGame(id, "Kim", clicks)).toThrow("Ungültige Klicks");
  });
});

describe("Namen", () => {
  it("kürzt auf 12 Zeichen und entfernt Leerzeichen und Steuerzeichen", () => {
    expect(games.normalizeName("  Lea\u0007  ")).toBe("Lea");
    expect(games.normalizeName("abcdefghijklmnop")).toBe("abcdefghijkl");
  });

  it.each([[""], ["   "], [42], [undefined]])("lehnt %j ab", (name) => {
    expect(() => games.normalizeName(name)).toThrow("Name fehlt");
  });
});

describe("Bestenliste", () => {
  it("ist bei einer neuen Datenbank leer", () => {
    expect(games.leaderboard()).toEqual([]);
  });

  it("zeigt pro Name nur den besten Lauf, ohne Groß/Klein zu unterscheiden", () => {
    play("Max", 3);
    play("max", 5);
    play("MAX", 4);
    const board = games.leaderboard();
    expect(board).toHaveLength(1);
    expect(board[0]).toMatchObject({ name: "max", rounds: 5 });
  });

  it("bei gleichem Bestwert zählt der erste Lauf", () => {
    play("Nora", 4); // 12:00
    vi.setSystemTime(T0 + 86_400_000); // ein Tag später
    const { id } = games.createGame("blue");
    const sol = solutionsOf(id);
    games.beginGame(id);
    vi.setSystemTime(T0 + 86_400_000 + 5_100);
    games.finishGame(id, "Nora", sol.slice(0, 4));
    const [entry] = games.leaderboard();
    expect(entry.color).toBe("red");
    expect(entry.date).toBe(new Date(T0 + 5_200).toISOString());
  });

  it("bei Gleichstand zwischen Personen steht oben, wer zuerst da war", () => {
    play("Olga", 4);
    vi.setSystemTime(T0 + 60_000);
    const { id } = games.createGame("red");
    const sol = solutionsOf(id);
    games.beginGame(id);
    vi.setSystemTime(T0 + 65_100);
    games.finishGame(id, "Paul", sol.slice(0, 4));
    expect(games.leaderboard().map((e) => e.name)).toEqual(["Olga", "Paul"]);
  });

  it("zeigt höchstens 10 Einträge und keine Läufe mit 0 Punkten", () => {
    for (let i = 1; i <= 12; i++) play(`P${i}`, i % 6);
    const board = games.leaderboard();
    expect(board.length).toBeLessThanOrEqual(10);
    expect(board.every((e) => e.rounds > 0)).toBe(true);
    expect(board.map((e) => e.rounds)).toEqual([...board.map((e) => e.rounds)].sort((a, b) => b - a));
  });
});

describe("Datenbank-Migrationen", () => {
  it("entfernt alte Testeinträge, behält echte Spiele und ergänzt begun_at", async () => {
    // Stand wie live vor dem Update: Version 1, ohne begun_at, Testeinträge + ein echtes Spiel
    const old = new DatabaseSync(process.env.DB_PATH!);
    old.exec(`
      CREATE TABLE games (id TEXT PRIMARY KEY, color TEXT NOT NULL, solutions TEXT NOT NULL,
        started_at INTEGER NOT NULL, finished_at INTEGER, name TEXT, rounds INTEGER);
      INSERT INTO games VALUES ('t1', 'yellow', '[]', 1, 1, 'Homer', 5);
      INSERT INTO games VALUES ('t2', 'red', '[]', 1, 1, 'Lisa', 5);
      INSERT INTO games VALUES ('r1', 'blue', '[3,7]', 2, 2, 'Hannes', 7);
      PRAGMA user_version = 1;
    `);
    old.close();

    vi.resetModules();
    const fresh: Games = await import("@/utils/games");
    expect(fresh.leaderboard().map((e) => e.name)).toEqual(["Hannes"]);

    const db = new DatabaseSync(process.env.DB_PATH!);
    const version = db.prepare("PRAGMA user_version").get() as { user_version: number };
    const columns = (db.prepare("PRAGMA table_info(games)").all() as { name: string }[]).map(
      (c) => c.name
    );
    db.close();
    expect(version.user_version).toBe(2);
    expect(columns).toContain("begun_at");
  });
});

import { GAME_SECONDS } from "@/utils/constants";

// Unauffälliger Schummelschutz: Der Browser schickt zu jedem Klick mit, wann er nach dem ersten
// Tipp kam, ob er von einem echten Finger/einer echten Maus stammt (isTrusted) und ob er innerhalb
// des Feldes lag. Der Server zählt die Punkte wie bisher selbst, bewertet zusätzlich, ob das Spiel
// menschlich aussieht, und speichert das Protokoll. Spieler merken davon nichts; verdächtige Spiele
// werden nur markiert (Auswertung mit scripts/check-games.js).

// Unter dieser Zeit zwischen zwei Treffern sucht und tippt kein Mensch (Board ansehen, finden, tippen)
export const MIN_HUMAN_HIT_MS = 120;
// So viele zu schnelle Treffer verzeihen wir (z. B. zwei Finger gleichzeitig auf dem Handy)
export const MAX_FAST_HITS = 2;
// Ab hier ist eine Punktzahl in 5 Sekunden menschlich nicht erreichbar (Rekord bisher: 11)
export const MAX_HUMAN_SCORE = 25;
// Gespeichert werden höchstens so viele Klicks, damit ein Protokoll klein bleibt
export const MAX_LOGGED_CLICKS = 300;

// Pro Klick: [ms seit dem ersten Tipp, echt (1/0), im Feld (1/0)]
export type LogEntry = [number, 0 | 1, 0 | 1];

const isBit = (v: unknown): v is 0 | 1 => v === 0 || v === 1;

const parseLog = (raw: unknown, clicks: number): LogEntry[] | null => {
  if (!Array.isArray(raw) || raw.length !== clicks) return null;
  let previous = 0;
  for (const e of raw) {
    if (!Array.isArray(e) || e.length !== 3) return null;
    const [t, trusted, inside] = e;
    if (
      !Number.isInteger(t) ||
      t < previous ||
      t > 60_000 ||
      !isBit(trusted) ||
      !isBit(inside)
    )
      return null;
    previous = t;
  }
  return raw as LogEntry[];
};

export interface Assessment {
  rounds: number;
  flags: string[];
  // Kompaktes Protokoll zum Nachvollziehen: [ms, Feld, echt, im Feld] bzw. nur Felder ohne Log
  record: string;
}

export const assessGame = (
  solutions: number[],
  clicks: number[],
  rawLog: unknown,
): Assessment => {
  const log = parseLog(rawLog, clicks.length);
  const flags: string[] = [];
  if (!log) flags.push(rawLog === undefined ? "missing log" : "invalid log");

  // Punkte nachspielen und dabei die Zeitpunkte der Treffer merken
  let rounds = 0;
  const hitTimes: number[] = [];
  clicks.forEach((click, i) => {
    if (rounds < solutions.length && click === solutions[rounds]) {
      rounds++;
      if (log) hitTimes.push(log[i][0]);
    }
  });

  if (rounds > MAX_HUMAN_SCORE) flags.push("superhuman score");
  if (log) {
    if (log.some(([, trusted]) => trusted === 0))
      flags.push("untrusted clicks");
    if (log.some(([, , inside]) => inside === 0))
      flags.push("clicks outside squares");
    const fastHits = hitTimes.filter(
      (t, i) => i > 0 && t - hitTimes[i - 1] < MIN_HUMAN_HIT_MS,
    ).length;
    if (fastHits > MAX_FAST_HITS) flags.push("superhuman speed");
    if (log.some(([t]) => t > GAME_SECONDS * 1000 + 1000))
      flags.push("clicks after time up");
  }

  const kept = clicks.slice(0, MAX_LOGGED_CLICKS);
  const record = JSON.stringify(
    log ? kept.map((c, i) => [log[i][0], c, log[i][1], log[i][2]]) : kept,
  );
  return { rounds, flags, record };
};

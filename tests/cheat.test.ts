import { describe, expect, it } from "vitest";
import { assessGame, MAX_LOGGED_CLICKS, type LogEntry } from "@/utils/cheat";

// 100 Boards, die Lösung von Board n liegt auf Feld n % 100
const SOLUTIONS = Array.from({ length: 100 }, (_, n) => (n * 7) % 100);

// Ein Spiel aus Treffern im gegebenen Abstand, alle echt und im Feld
const hits = (count: number, gapMs: number) => {
  const clicks = SOLUTIONS.slice(0, count);
  const log: LogEntry[] = clicks.map((_, i) => [i * gapMs, 1, 1]);
  return { clicks, log };
};

describe("assessGame", () => {
  it("ein menschliches Spiel bleibt unmarkiert", () => {
    const { clicks, log } = hits(9, 480);
    const miss = (SOLUTIONS[3] + 1) % 100;
    clicks.splice(3, 0, miss); // ein Fehlklick dazwischen
    log.splice(3, 0, [log[2][0] + 200, 1, 1]);
    for (let i = 4; i < log.length; i++) log[i] = [log[i][0] + 250, 1, 1];
    expect(assessGame(SOLUTIONS, clicks, log)).toMatchObject({ rounds: 9, flags: [] });
  });

  it("zählt die Punkte genauso wie ohne Protokoll", () => {
    const { clicks } = hits(6, 400);
    expect(assessGame(SOLUTIONS, clicks, undefined).rounds).toBe(6);
  });

  it("fehlendes oder kaputtes Protokoll wird vermerkt", () => {
    const { clicks, log } = hits(4, 400);
    expect(assessGame(SOLUTIONS, clicks, undefined).flags).toEqual(["missing log"]);
    expect(assessGame(SOLUTIONS, clicks, log.slice(1)).flags).toEqual(["invalid log"]);
    const backwards = log.map((e, i): LogEntry => [1000 - i * 100, 1, 1]);
    expect(assessGame(SOLUTIONS, clicks, backwards).flags).toEqual(["invalid log"]);
    expect(assessGame(SOLUTIONS, clicks, "kaputt").flags).toEqual(["invalid log"]);
  });

  it("per Skript ausgelöste Klicks (isTrusted = false, Koordinaten 0/0)", () => {
    const { clicks, log } = hits(5, 400);
    const scripted = log.map(([t]): LogEntry => [t, 0, 0]);
    expect(assessGame(SOLUTIONS, clicks, scripted).flags).toEqual([
      "untrusted clicks",
      "clicks outside squares",
    ]);
  });

  it("übermenschlich schnelle Treffer, zwei Ausreißer werden verziehen", () => {
    const twoFast = hits(6, 400);
    twoFast.log[2] = [twoFast.log[1][0] + 80, 1, 1];
    twoFast.log[4] = [twoFast.log[3][0] + 90, 1, 1];
    for (let i = 3; i < twoFast.log.length; i++) {
      if (i !== 4) twoFast.log[i] = [Math.max(twoFast.log[i][0], twoFast.log[i - 1][0] + 300), 1, 1];
    }
    expect(assessGame(SOLUTIONS, twoFast.clicks, twoFast.log).flags).toEqual([]);

    const bot = hits(12, 60);
    expect(assessGame(SOLUTIONS, bot.clicks, bot.log).flags).toEqual(["superhuman speed"]);
  });

  it("übermenschliche Punktzahl", () => {
    const { clicks, log } = hits(30, 150);
    expect(assessGame(SOLUTIONS, clicks, log).flags).toContain("superhuman score");
  });

  it("Klicks lange nach Ablauf der Zeit", () => {
    const { clicks, log } = hits(3, 400);
    log[2] = [6_500, 1, 1];
    expect(assessGame(SOLUTIONS, clicks, log).flags).toEqual(["clicks after time up"]);
  });

  it("speichert ein kompaktes Protokoll, höchstens 300 Klicks", () => {
    const { clicks, log } = hits(2, 400);
    expect(JSON.parse(assessGame(SOLUTIONS, clicks, log).record)).toEqual([
      [0, SOLUTIONS[0], 1, 1],
      [400, SOLUTIONS[1], 1, 1],
    ]);
    const many = Array(500).fill(1);
    const manyLog: LogEntry[] = many.map((_, i) => [i, 1, 1]);
    expect(JSON.parse(assessGame(SOLUTIONS, many, manyLog).record)).toHaveLength(MAX_LOGGED_CLICKS);
  });
});

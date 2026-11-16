export const COLORS = [
  "black",
  "lightgray",
  "red",
  "purple",
  "green",
  "yellow",
  "blue",
  "hotpink",
  "aqua",
] as const;
export type Color = (typeof COLORS)[number];

export const TRANSPARENT = "transparent";

export const GAME_SECONDS = 5;
export const BOARDS_PER_GAME = 100;
export const CELLS_PER_BOARD = 100; // 5 Spalten × 20 Zeilen
export const NAME_MAX_LENGTH = 12;

export const randomColor = (): Color =>
  COLORS[Math.floor(Math.random() * COLORS.length)];

export const isColor = (value: unknown): value is Color =>
  typeof value === "string" && (COLORS as readonly string[]).includes(value);

// Auf hellen Spielfarben braucht Text Schwarz, sonst Weiß
const LIGHT_COLORS: readonly string[] = ["lightgray", "yellow", "aqua", "coral", "hotpink"];
export const textOn = (color: string) => (LIGHT_COLORS.includes(color) ? "black" : "white");

// Anzeigenamen; intern bleiben die CSS-Farbnamen
const COLOR_LABELS: Record<string, string> = { lightgray: "light gray", hotpink: "pink" };
export const colorLabel = (color: string) => COLOR_LABELS[color] ?? color;

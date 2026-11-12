import { randomInt } from "node:crypto";
import { COLORS, CELLS_PER_BOARD, TRANSPARENT, type Color } from "@/utils/constants";

export interface Board {
  cells: string[];
  solution: number;
}

// Ein Feld in der Zielfarbe, ca. 20 % Köder in anderen Farben, der Rest leer
export const constructBoard = (color: Color): Board => {
  const baits = COLORS.filter((c) => c !== color);
  const cells = Array.from({ length: CELLS_PER_BOARD }, () =>
    randomInt(5) === 0 ? baits[randomInt(baits.length)] : TRANSPARENT
  );
  const solution = randomInt(CELLS_PER_BOARD);
  cells[solution] = color;
  return { cells, solution };
};

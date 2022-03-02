import { col_transp, colors } from "@/utils/constants";
import { Board } from "@/utils/types";

// returns a number between 0 and (max - 1)
export const getRndNum = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const constructBoard = (color: string): Board => {
  // assign solution values
  const index = getRndNum(100);

  // extract solution color
  const options = colors.filter((col) => {
    return col != color;
  });
  // construct board
  let board = Array<string>(100);
  for (let i = 0; i < board.length; i++) {
    // 20% chance of field as color bait
    if (getRndNum(5) == 0) {
      board[i] = options[getRndNum(options.length)];
    } else {
      // transparent
      board[i] = col_transp;
    }
  }
  // insert solution
  board[index] = color;

  return {
    board: board,
    sol_index: index,
  };
};

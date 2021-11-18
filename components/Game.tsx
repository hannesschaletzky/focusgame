import { useState } from 'react';

import { Item } from '@/styles/UI_Elements';
import { States } from '@/types/Enums';

interface GameProps {
  continue: (newState: States) => void
}

interface GameState {
  points: number;
  board: JSX.Element[];
}
const initGameState: GameState = {
  points: 0,
  board: []
}

const Game = (props: GameProps) => {

  const [gameState, setGameState] = useState(initGameState);

  //setup first round
  if (gameState.board.length == 0) {
    let board: JSX.Element[] = [];
    Array.from(Array(100)).forEach((x, i) => {
      board.push(
        <Item color={"blue"} onClick={() => determine()} key={i}>{i + 1}</Item>
      )
    });
    let newGameState: GameState = {
      points: 0,
      board: board
    }
    console.log("LETS PLAY")
    setGameState(newGameState)
  }

  // check user selection 
  const determine = () => {

    let board: JSX.Element[] = [];
    Array.from(Array(100)).forEach((x, i) => {
      board.push(
        <Item color={"red"} onClick={() => determine()} key={i}>{i + 1}</Item>
      )
    });

    let newGameState: GameState = {
      points: gameState.points += 1,
      board: board
    }
    console.log(newGameState.points)
    setGameState(newGameState)
  }

  return (
    <>
      {gameState.board}
    </>
  )
}

export default Game






// const getItems = ():JSX.Element[] => {
//   let items: JSX.Element[] = []
//   Array.from(Array(100)).forEach((x, i) => {
//     items.push(
//       <Item color={"blue"} onClick={() => determine()} key={i}>{i + 1}</Item>
//     )
//   });
//   return items
// }
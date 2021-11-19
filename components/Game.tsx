import { Item } from '@/styles/UI_Elements';
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { decrement, increment } from '@/app/features/counterSlice'

interface GameState {
  points: number;
  board: JSX.Element[];
  solution: number;
}
const initGameState: GameState = {
  points: 0,
  board: [],
  solution: -1
}

const Game = () => {

  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <>
      <div onClick={() => dispatch(increment())}>Incr</div>
      <div onClick={() => dispatch(decrement())}>Decr</div>
      <br />
      <div>{count}</div>
    </>
  )
}

export default Game





 //new random board -> returns board and solution index
  // const newField = ():[JSX.Element[], number] => {
  //   let board = []
  //   Array.from(Array(100)).forEach((x, i) => {
  //     board.push(
  //       <Item color={"white"} onClick={() => determine(i)} key={i}>{i + 1}</Item>
  //     )
  //   });
  //   const solution = Math.floor(Math.random() * board.length);
  //   board[solution] = <Item color={"green"} onClick={() => determine(solution)} key={solution}>{solution + 1}</Item>
  //   return [board, solution]
  // }

  // //check user selection 
  // const determine = (i:number) => {
    
  //   console.log(i)
  //   console.log(gameState.solution)
  //   if (i != gameState.solution) {
  //     return
  //   } 

  //   console.log("CORRECT")
  //   //setup next round
  //   let board = newField()
  //   let newGameState: GameState = {
  //     points: gameState.points += 1,
  //     board: board[0],
  //     solution: board[1]
  //   }
  //   console.log(newGameState.points)
  //   setGameState(newGameState)
  // }




// const getItems = ():JSX.Element[] => {
//   let items: JSX.Element[] = []
//   Array.from(Array(100)).forEach((x, i) => {
//     items.push(
//       <Item color={"blue"} onClick={() => determine()} key={i}>{i + 1}</Item>
//     )
//   });
//   return items
// }
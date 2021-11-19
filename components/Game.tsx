import { Item } from '@/styles/UI_Elements';
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { addPoint, setBoard, SetBoardPayload, setSolution } from '@/app/features/gameStateSlice'

const Game = () => {

  let points = useAppSelector((state) => state.gameState.points)
  let solution = useAppSelector((state) => state.gameState.solution)
  const dispatch = useAppDispatch()

  console.log(solution)

  const determine = (index:number) => {
    dispatch(setBoard(newField()))
  }

  //new random board -> returns board and solution index
  const newField = (): SetBoardPayload => {
    let board = []
    Array.from(Array(100)).forEach((x, i) => {
      board.push(
        <Item color={"white"} onClick={() => determine(i)} key={i}>{i + 1}</Item>
      )
    });
    const solution = Math.floor(Math.random() * board.length);
    board[solution] = <Item color={"green"} onClick={() => determine(solution)} key={solution}>{solution + 1}</Item>
    return { board, solution }
  }

  //init first round
  let board = useAppSelector((state) => state.gameState.board)
  if (board.length == 0) {
    let newBoard = newField()
    console.log(newBoard)
    dispatch(setBoard(newBoard))
  }

  return (
    <>
    <div className="flex flex-row justify-center items-center flex-wrap w-screen h-screen">
      {board}
    </div>
    <div className="flex justify-center items-center bg-gray-300">
      {solution}
    </div>
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
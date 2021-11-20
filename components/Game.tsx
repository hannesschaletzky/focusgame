import { Item } from '@/styles/UI_Elements';
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { addPoint, setBoard } from '@/app/features/gameStateSlice'

//will be set in first round
let defaultBoard:JSX.Element[] = [] 
let defaultBoardLength: number = -1

const Game = () => {

  //let points = useAppSelector((state) => state.gameState.points)
  const dispatch = useAppDispatch()
  const board = useAppSelector((state) => state.gameState.board)

  //dispatch next round to store
  const nextRound = () => {
    dispatch(addPoint())
    dispatch(setBoard(getNewBoard()))
  }

  //returns a new board
  const getNewBoard = (): JSX.Element[] => {
    let board = defaultBoard.slice()
    const solution = Math.floor(Math.random() * defaultBoardLength);
    board[solution] = <Item color={"green"} onClick={() => nextRound()} key={solution}>{/*{solution + 1}*/}</Item>
    return board
  }

  //init first round
  if (board.length == 0) {
    //set default board
    Array.from(Array(100)).forEach((_, i) => {
      defaultBoard.push(<Item color={"transparent"} key={i}>{/*{i + 1}*/}</Item>)
    });
    defaultBoardLength = defaultBoard.length
    dispatch(setBoard(getNewBoard()))
  }

  return (
    <div className="flex flex-row justify-center items-center flex-wrap w-screen h-screen">
      {board}
    </div>
  )
}

export default Game
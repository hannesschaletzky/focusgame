import { useAppDispatch, useAppSelector } from "@/app/hooks"

const Score = () => {
  
  const dispatch = useAppDispatch()
  const points = useAppSelector((state) => state.gameState.points)

  return (
    <div className="flex flex-col justify-center items-center flex-wrap w-screen h-screen">
      <div>You scored: </div>
      <br />
      <div>{points}</div>
    </div>
  )
}

export default Score
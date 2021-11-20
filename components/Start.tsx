import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { next } from '@/app/features/pageSlice'
import { thunkTimer } from "@/app/features/gameStateThunks";
import { Item, StartButton } from '@/styles/UI_Elements';

const Start = () => {

  const dispatch = useAppDispatch()
  const seconds = useAppSelector((state) => state.gameState.seconds)
  const color = useAppSelector((state) => state.gameState.color)

  return (
    <div className="flex flex-col justify-center items-center flex-wrap w-screen h-screen">

      <div>How does the game work?</div>
      <br />
      <div>Click as many {color} squares as you can...</div>
      <div>They look like this:</div>
      <Item color={color}/>

      <br />
      <br />
      <StartButton onClick={() => {
        dispatch(next())
        dispatch(thunkTimer(seconds))
      }}>
        Start
      </StartButton>
    </div>
  )
}

export default Start
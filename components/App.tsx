import Start from '@/components/Start';
import Game from '@/components/Game';
import Score from '@/components/Score';

import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { Points, Seconds } from '@/styles/UI_Elements';
import { setColor } from '@/app/features/gameStateSlice';
import { getRandomColor } from '@/app/colors';

import { useEffect } from "react"

const App = () => {

  console.log("RENDER APP")

  //read data from store
  const index = useAppSelector((state) => state.page.index)
  const points = useAppSelector((state) => state.gameState.points)
  const seconds = useAppSelector((state) => state.gameState.seconds)
  const dispatch = useAppDispatch()

  //set inital values
  useEffect(() => {
    console.log("set initial color")
    dispatch(setColor(getRandomColor()))
  });

  //determine content based on state
  let content: JSX.Element = <div></div>
  switch (index) {
    case 0: content =
      <Start/>
      break
    case 1: content =
      <>
        <Points>{points}</Points>
        <Game />
        <Seconds>{seconds}</Seconds>
      </>
      break
    case 2: content =
      <Score />
      break
  }

  return (
    <>
      {content}
    </>
  )
}

export default App
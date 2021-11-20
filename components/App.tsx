import Start from '@/components/Start';
import Game from '@/components/Game';

import { useAppSelector } from "@/app/hooks"
import { Points, Seconds } from '@/styles/UI_Elements';

const App = () => {

  console.log("RENDER")

  //start timer
  // const id = setInterval(() => { 
  //   console.log("TEST")
  // }, 1000);
  // setTimeout(() => clearInterval(id), 3001)

  //determine content based on state
  const index = useAppSelector((state) => state.page.index)
  const points = useAppSelector((state) => state.gameState.points)
  const seconds = useAppSelector((state) => state.gameState.seconds)
  let content: JSX.Element = <div></div>
  switch(index) {
    case 0: content = 
      <Start />
      break
    case 1: content = <>
      <Points>{points}</Points>
      <Game />
      <Seconds>{seconds}</Seconds>
    </>
    
     break
  }
  
  return (
    <>
      {content}
    </>
  )
}

export default App
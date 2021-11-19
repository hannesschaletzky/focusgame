import Start from '@/components/Start';
import Game from '@/components/Game';

import { useAppSelector } from "@/app/hooks"

const App = () => {

  //determine content based on state
  const index = useAppSelector((state) => state.page.index)
  let content: JSX.Element = <div></div>
  switch(index) {
    case 0: content = <Start />; break
    case 1: content = <Game />; break
  }
  
  return (
    <div className="flex flex-col justify-center items-center flex-wrap w-screen h-screen">
      {content}
    </div>
  )
}

export default App
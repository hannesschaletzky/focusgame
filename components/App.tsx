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
    <>
      {content}
    </>
  )
}

export default App
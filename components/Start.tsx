import { useAppDispatch } from "@/app/hooks"
import { next } from '@/app/features/pageSlice'

import { StartButton } from '@/styles/UI_Elements';


const Start = () => {
  
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col justify-center items-center flex-wrap w-screen h-screen">
      <StartButton onClick={() => dispatch(next())}>Start</StartButton>
    </div>
  )
}

export default Start
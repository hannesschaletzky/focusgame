import { useAppDispatch } from "@/app/hooks"
import { next } from '@/app/features/pageSlice'

import { StartButton } from '@/styles/UI_Elements';


const Start = () => {
  
  const dispatch = useAppDispatch()

  return (
    <StartButton onClick={() => dispatch(next())}>Start</StartButton>
  )
}

export default Start
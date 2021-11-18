import { StartButton } from '@/styles/UI_Elements';
import { States } from '@/types/Enums';

interface StartProps {
  continue: (newState: States) => void
}

const Start = (props:StartProps) => {
  return (
    <StartButton onClick={() => props.continue(States.Game)}>Start</StartButton>
  )
}

export default Start
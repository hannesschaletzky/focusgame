import { States } from '@/types/Enums';
import Start from '@/components/Start';
import Game from '@/components/Game';


import { WrapperProps } from '@/types/Props';

const Wrapper = (props: WrapperProps) => {

  //determine content based on state
  let content: JSX.Element = <div></div>
  content = <Game store={props.store} counter={props.store.getState().value}/>

  // switch (props.store.getState().page) {
  //   case States.Init:
  //     content = <Start continue={continueToState} />
  //     break
  //   case States.Game:
  //     content = <Game continue={continueToState} store={store}/>
  //     break
  // }

  return (
    <div className="flex flex-col justify-center items-center flex-wrap w-screen h-screen">
      {content}
    </div>
  )
}

export default Wrapper
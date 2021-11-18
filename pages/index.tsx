import type { NextPage } from 'next'
import { useState } from 'react';
import Head from 'next/head'

import { States } from '@/types/Enums';
import Start from '@/components/Start';
import Game from '@/components/Game';



// import { useState } from 'react';
// const [name, setName] = useState("");
// import { Input, Button } from '@/styles/UI_Elements'
// <div className="flex flex-col justify-center items-center w-screen h-screen">
//         <div className="mb-2">Enter a name:</div>
//         <Input type="text" value={name} onChange={(e) => setName(e.target.value.trim())} />
//         {name.length > 0 &&
//           <Button href={"/game?name=" + name}>Let's play</Button>
//         }
//       </div>

const Home: NextPage = () => {

  //handle state
  const [state, setState] = useState(States.Init);
  const continueToState = (newState: States) => {
    setState(newState)
  }

  //determine content based on state
  let content: JSX.Element = <div></div>
  switch (state) {
    case States.Init:
      content = <Start continue={continueToState} />
      break
    case States.Game:
      content = <Game continue={continueToState} />
      break
  }

  return (
    <>
      <Head>
        <title>Focus</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex justify-center items-center flex-wrap w-screen h-screen">
        {content}
      </div>
    </>
  )
}

export default Home

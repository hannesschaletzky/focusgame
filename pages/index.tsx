import type { NextPage } from 'next'
import Head from 'next/head'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Wrapper from '@/components/Wrapper';
import { Action } from '@/types/Enums';


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

  // const [count, refresh] = useState(0)

  //init store
  let initState = { value: 0 }
  const counterReducer = (state:any = initState, action:any) => {
    switch (action.type) {
      case Action.incr:
        //console.log(state.value)
        return { value: state.value + 1 }
      case Action.decr:
        return { value: state.value - 1 }
      default:
        return state
    }
  }
  let store = createStore(counterReducer)
  console.log("created redux store")

  //subscribe to store
  function handleChange() {
    console.log("in subscribe listener: " + store.getState().value)
  }
  store.subscribe(handleChange)
  console.log("subscribed to the store")

  return (
    <>
      <Head>
        <title>Focus</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Provider store={store}>
        <Wrapper/>
      </Provider>
    </>
  )
}

export default Home

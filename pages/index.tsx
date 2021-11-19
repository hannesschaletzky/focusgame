import type { NextPage } from 'next'
import Head from 'next/head'
import { createStore } from 'redux'

import store from '@/store/store'
import { Provider } from 'react-redux'

import App from '@/components/App';


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

  return (
    <>
      <Head>
        <title>Focus</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Provider store={store}>
        <App/>
      </Provider>
    </>
  )
}

export default Home

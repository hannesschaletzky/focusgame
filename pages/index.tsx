import type { NextPage } from 'next'
import Head from 'next/head'

import { StartButton, Item } from '@/styles/UI_Elements';

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

  

  const getItems = ():JSX.Element[] => {
    let items:JSX.Element[] = []
    Array.from(Array(100)).forEach((x, i) => {
      items.push(
        <Item>{i + 1}</Item>
      )
    });
    return items
  }

  return (
    <>
      <Head>
        <title>Focus</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      <StartButton>Start</StartButton>

      <div className="flex justify-center items-center flex-wrap w-screen h-screen lg:border">
        {getItems()}
      </div>
    </>
  )
}

export default Home

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SwipeableCards from './components/SwipeableCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className='h-screen flex justify-center items-center'>
        <SwipeableCards />
      </main>
    </>
  )
}

export default App

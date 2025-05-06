import React from 'react'
import SwipeableCards from '../components/SwipeableCard'
import { products } from '../data/products';

const Home = () => {
  return (
    <div className='h-[calc(100vh-4rem)] flex justify-center items-center'>
        <SwipeableCards products={products} />
    </div>
  )
}

export default Home
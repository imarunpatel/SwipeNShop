import React from 'react'
import { Outlet } from 'react-router-dom'
import Logo from '../assets/logo.webp';

const MainLayout = () => {
  return (
    <div>
        <header className='flex justify-center w-full bg-gray-50 h-14 py-3'>
            <img src={Logo} alt="" />
        </header>
        <Outlet />
    </div>
  )
}

export default MainLayout
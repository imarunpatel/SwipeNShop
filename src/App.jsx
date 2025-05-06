import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { CartProvider } from './context/CartContext'
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

function App() {

  useEffect(() => {
    if (Capacitor.getPlatform() === 'android') {
      StatusBar.setBackgroundColor({ color: '#ff444f' });
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setOverlaysWebView({ overlay: true });
    }
  }, []);

  return (
    <div className='app-container'>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </div>
  )
}

export default App

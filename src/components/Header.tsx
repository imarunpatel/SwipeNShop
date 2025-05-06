import Logo from '../assets/logo.webp';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { cartItems, totalItems, totalPrice } = useCart();

  return (
    <header className="bg-gray-50 max-w-sm mx-auto h-16">
      <div className="container relative mx-auto max-w-sm px-4  flex justify-center items-center">
        <img src={Logo} alt="" className='pt-5' />
        
        <div className="absolute right-4 top-4">
          {cartItems.length > 0 && <button 
            className="p-2 relative" 
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            {/* Cart Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            
            {/* Cart Items Count Badge */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ff444f] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>}
          
          {/* Cart Dropdown */}
          {isCartOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
              <div className="p-4">
                <h3 className="text-lg font-semibold border-b border-gray-200 pb-2 text-gray-700">Your Cart</h3>
                
                {cartItems.length === 0 ? (
                  <p className="py-4 text-center text-gray-500">Your cart is empty</p>
                ) : (
                  <>
                    <ul className="py-2 max-h-60 overflow-auto">
                      {cartItems.map(item => (
                        <li key={item.id} className="flex justify-between items-center py-2 border-b text-gray-600">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm">${item.price} × {item.quantity}</p>
                          </div>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 pt-2 border-t flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                    
                    <button className="mt-4 w-full bg-[#ff444f] text-white py-2 rounded-md hover:bg-[#ff4451d0] transition-colors">
                      Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
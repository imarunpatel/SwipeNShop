import React, { useEffect, useRef, useState } from "react";
import ProductCard from './ProductCard';
import { IProduct } from "../model/Product";
import { useCart } from "../context/CartContext";

interface SwipeableCardsProps {
  products: IProduct[]
}
type SwipeDirection = "left" | "right" | "up" | null;

const SwipeableCards:  React.FC<SwipeableCardsProps> = ({ products }) => {
  const { addToCart } = useCart();
  const [cards, setCards] = useState<IProduct[]>(products);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  

  const currentOffsetX = useRef<number>(0);
  const currentOffsetY = useRef<number>(0);

  const handleSwipe = (dir: SwipeDirection, id: number): void => {
    setIsAnimating(true);
    setSwipeDirection(dir);

    
    if (dir === "right") {
      console.log(`Liked Product ID: ${id}`);
    } else if (dir === "left") {
      console.log(`Passed Product ID: ${id}`);
    } else if (dir === "up") {
      console.log(`Add to cart Product ID: ${id}`);
      const swipedProduct = cards.find(card => card.id === id);
      if(swipedProduct)
        addToCart(swipedProduct);
    }

    setTimeout(() => {
      setCards((prev) => prev.filter((card) => card.id !== id));
      setOffsetX(0);
      setOffsetY(0);
      currentOffsetX.current = 0;
      currentOffsetY.current = 0;
      setActiveCard(null);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };
  
  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setStartX(e.clientX);
    setStartY(e.clientY);
    setActiveCard(id);
    setIsDragging(true);

    currentOffsetX.current = 0;
    currentOffsetY.current = 0;
  };
  
  const handleTouchStart = (e, id) => {
    // e.preventDefault();
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setActiveCard(id);
    setIsDragging(true);

    currentOffsetX.current = 0;
    currentOffsetY.current = 0;
  };
  
  const handleMouseMove = (e) => {
    if (activeCard === null || !isDragging) return;
    e.preventDefault(); 
    
    const newOffsetX = e.clientX - startX;
    const newOffsetY = e.clientY - startY;
    
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
    currentOffsetX.current = newOffsetX;
    currentOffsetY.current = newOffsetY;
  };
  
  const handleTouchMove = (e) => {
    if (activeCard === null || !isDragging) return;
    e.preventDefault();
    const newOffsetX = e.touches[0].clientX - startX;
    const newOffsetY = e.touches[0].clientY - startY;
    
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
    currentOffsetX.current = newOffsetX;
    currentOffsetY.current = newOffsetY;
  };
  
  const handleEnd = (e) => {
    if (activeCard === null || isAnimating) return;
    
    const currentX = currentOffsetX.current;
    const currentY = currentOffsetY.current;

    if (currentY < -100) {
      handleSwipe("up", activeCard);
    } else if (currentX > 100) {
      handleSwipe("right", activeCard);
    } else if (currentX < -100) {
      handleSwipe("left", activeCard);
    } else {
      setOffsetX(0);
      setOffsetY(0);
      currentOffsetX.current = 0;
      currentOffsetY.current = 0;
    }
    setIsDragging(false);
  };
  
  useEffect(() => {
    const touchMoveHandler = (e) => handleTouchMove(e);
    const touchEndHandler = (e) => handleEnd(e);
    const mouseMoveHandler = (e) => handleMouseMove(e);
    const mouseUpHandler = (e) => handleEnd(e);
    
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("touchmove", touchMoveHandler, { passive: false });
    window.addEventListener("touchend", touchEndHandler);
    
    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
    };
  }, [activeCard, startX, startY, isDragging]);
  
  const getIndicatorType = () => {
    // Use absolute values for better threshold comparison
    const absX = Math.abs(offsetX);
    const absY = Math.abs(offsetY);
    // Only show indicator if we exceed the threshold
    if (absX < 50 && absY < 50) return null;
    
    // Determine primary direction
    if (absY > absX && offsetY < 0) return "up";
    else if (offsetX > 0) return "right";
    else if (offsetX < 0) return "left";
    
    return null;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-50 px-4 py-1 swipeable-card-container">
      {/* Card Stack */}
      <div className="relative w-full max-w-sm flex flex-1 items-center justify-center">
        {cards.map((product, index) => {
          const isTop = index === cards.length - 1;
          
          let transformStyle = '';
          if (isTop && activeCard === product.id && isDragging) {
            transformStyle = `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${offsetX * 0.05}deg)`;
          } else if (isTop && swipeDirection && activeCard === product.id) {
            switch(swipeDirection) {
              case 'right':
                transformStyle = 'translateX(150%) rotate(20deg)';
                break;
              case 'left':
                transformStyle = 'translateX(-150%) rotate(-20deg)';
                break;
              case 'up':
                transformStyle = 'translateY(-150%)';
                break;
              default:
                transformStyle = '';
            }
          }
          
          const stackingStyle = {
            transform: transformStyle || `translateY(${(cards.length - 1 - index) * 2}px) scale(${0.98 + (index / 100)})`,
            zIndex: index,
            opacity: isTop || index === cards.length - 2 ? 1 : 0.7,
            transition: isDragging ? 'none' : 'all 0.3s ease',
            position: 'absolute' as 'absolute',
          };
          
          return (
            <div
              key={product.id}
              style={stackingStyle}
              onMouseDown={(e) => isTop && !isAnimating && handleMouseDown(e, product.id)}
              onTouchStart={(e) => isTop && !isAnimating && handleTouchStart(e, product.id)}
              className="w-full cursor-grab active:cursor-grabbing touch-none select-none"
            >
              <div className="w-full flex justify-center">
                <ProductCard product={product} />
              </div>
              
              {isTop && (
                <>
                  {/* Like indicator */}
                  <div 
                    className={`absolute top-1/2 left-0 sm:left-6 p-3 rounded-full bg-green-500 text-white font-bold transform -translate-y-1/2 transition-opacity
                      ${(getIndicatorType() === 'right' || swipeDirection === 'right') ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  
                  {/* Pass indicator */}
                  <div 
                    className={`absolute top-1/2 right-0 sm:right-6 p-3 rounded-full bg-red-500 text-white font-bold transform -translate-y-1/2 transition-opacity
                      ${(getIndicatorType() === 'left' || swipeDirection === 'left') ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  
                  {/* Add to cart indicator */}
                  <div 
                    className={`absolute bottom-1/2 left-1/2 p-3 rounded-full bg-blue-500 text-white font-bold transform -translate-x-1/2 transition-opacity
                      ${(getIndicatorType() === 'up' || swipeDirection === 'up') ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </>
              )}
            </div>
          );
        })}
        
        {cards.length === 0 && (
          <div className="text-center p-8">
            <div className="text-gray-400 text-6xl mb-4">🛍️</div>
            <h3 className="font-bold text-xl mb-2">No More Products</h3>
            <p className="text-gray-500">You've viewed all available products</p>
            <button 
              onClick={() => setCards(products)}
              className="mt-6 px-6 py-2 bg-[#ff444f] text-white font-medium rounded-full hover:bg-blue-600 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      {cards.length > 0 && (
          <div className="w-full  max-w-sm pb-5  flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Pass</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>Cart</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>Like</span>
            </div>
          </div>
      )}
    </div>
  );
}

export default SwipeableCards;
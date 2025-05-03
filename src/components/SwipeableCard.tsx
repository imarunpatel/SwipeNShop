import React, { useState } from "react";
import {products } from '../data/products';
import ProductCard from "./ProductCard";


export default function SwipeableCards() {
  const [cards, setCards] = useState(products);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleSwipe = (dir, id) => {
    console.log(
      dir === "right"
        ? `Liked Product ID: ${id}`
        : dir === "left"
        ? `Passed Product ID: ${id}`
        : `Add to cart Product ID: ${id}`
    );
    
    setCards((prev) => prev.filter((card) => card.id !== id));
    setOffsetX(0);
    setActiveCard(null);
  };
  
  const handleMouseDown = (e, id) => {
    setStartX(e.clientX);
    setActiveCard(id);
    setIsDragging(true);
  };
  
  const handleTouchStart = (e, id) => {
    setStartX(e.touches[0].clientX);
    setActiveCard(id);
    setIsDragging(true);
  };
  
  const handleMouseMove = (e) => {
    if (activeCard === null || !isDragging) return;
    setOffsetX(e.clientX - startX);
  };
  
  const handleTouchMove = (e) => {
    if (activeCard === null || !isDragging) return;
    setOffsetX(e.touches[0].clientX - startX);
  };
  
  const handleEnd = () => {
    if (activeCard === null) return;
    
    if (offsetX > 100) {
      handleSwipe("right", activeCard);
    } else if (offsetX < -100) {
      handleSwipe("left", activeCard);
    } else {
      setOffsetX(0);
    }
    
    setIsDragging(false);
  };
  
  // Add event listeners for mouse and touch events
  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleEnd);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [activeCard, startX, isDragging]);
  
  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {cards.map((product, index) => {
        const isTop = index === cards.length - 1;
        const cardStyle = {
          transform: isTop && activeCard === product.id ? `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)` : '',
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          zIndex: index,
          position: 'absolute' as 'absolute',
        };
        
        return (
          <div key={product.id} style={cardStyle}
            onMouseDown={(e) => isTop && handleMouseDown(e, product.id)}
            onTouchStart={(e) => isTop && handleTouchStart(e, product.id)}
            className="cursor-grab active:cursor-grabbing"
          >
            <ProductCard product={product} />
            
            {/* Swipe indicators */}
            {isTop && offsetX !== 0 && (
              <div className={`absolute top-4 ${offsetX > 0 ? 'right-4' : 'left-4'} p-2 rounded-full 
                ${offsetX > 0 ? 'bg-green-500' : 'bg-red-500'} text-white font-bold`}>
                {offsetX > 0 ? 'LIKE' : 'PASS'}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Display message when no cards left */}
      {cards.length === 0 && (
        <div className="text-center text-gray-500">No more products 🥲</div>
      )}
      
      {/* Swipe instructions */}
      <div className="absolute bottom-4 text-sm text-gray-500">
        Swipe right to like, left to pass
      </div>
    </div>
  );
}
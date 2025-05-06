import React from "react";
import { IProduct } from "../model/Product";

 interface ProductCardProps {
   product: IProduct;
 }
 const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercentage = product.discountPercentage || 
    (product.originalPrice && product.price 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-72 max-w-full">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-92 object-cover object-top"
        />
        
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        
        <h3 className="font-bold text-lg mb-1 line-h leading-5.5 capitalize">{product.name}</h3>

        <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
        
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-900">
            ${product.price?.toFixed(2) || product.originalPrice?.toFixed(2)}
          </span>
          
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
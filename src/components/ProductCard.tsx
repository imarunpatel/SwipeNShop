import React from "react";

type Props = {
  product: {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    imageUrl: string;
  };
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl w-72 h-[480px] p-4 flex flex-col justify-between">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-64 w-full object-cover rounded-xl"
      />
      <div className="mt-4 space-y-1">
        <h2 className="text-lg font-semibold capitalize">{product.name}</h2>
        <p className="text-sm text-gray-500">{product.brand}</p>
        <div className="flex items-center space-x-2 mt-2">
          <p className="text-xl font-bold text-black">₹{product.price}</p>
          {product.discountPercentage > 0 && (
            <>
              <p className="line-through text-gray-400">
                ₹{product.originalPrice}
              </p>
              <p className="text-green-500 font-semibold">
                {product.discountPercentage}% off
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { createContext, ReactNode, useContext, useState } from "react";
import { IProduct } from "../model/Product";



interface CartItem extends IProduct {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: IProduct) => void;
    totalItems: number;
    totalPrice: string;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: IProduct) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
            if(existingItemIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1
                }
                return updatedItems;
            }  else {
                return [...prevItems, { ...product, quantity: 1 }]
            }
        })
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const value: CartContextType = {
        cartItems,
        addToCart,
        totalItems,
        totalPrice
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}


export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if(context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
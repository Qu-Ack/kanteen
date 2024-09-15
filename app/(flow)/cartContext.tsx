import React, { createContext, useContext, useState, ReactNode } from "react";
import { Animated } from "react-native";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number; // Total quantity for this item
  eatInQuantity: number; // Quantity for "Eat In"
  takeAwayQuantity: number; // Quantity for "Takeaway"
}

interface CartContextType {
  cart: Record<number, CartItem>;
  addToCart: (item: CartItem) => void;
  updateItemQuantity: (
    id: number,
    eatInQuantity: number,
    takeAwayQuantity: number,
  ) => void;
  removeItem: (id: number) => void;
  getTotalPrice: () => number;
  animation: Animated.Value; // Animation value
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [animation] = useState(new Animated.Value(1)); // Animation setup

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart[item.id];
      if (existingItem) {
        return {
          ...prevCart,
          [item.id]: {
            ...existingItem,
            quantity: existingItem.quantity + item.quantity,
            eatInQuantity: existingItem.eatInQuantity + item.eatInQuantity,
            takeAwayQuantity:
              existingItem.takeAwayQuantity + item.takeAwayQuantity,
          },
        };
      }
      return {
        ...prevCart,
        [item.id]: item,
      };
    });

    // Add animation
    Animated.sequence([
      Animated.spring(animation, {
        toValue: 1.2,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.spring(animation, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const updateItemQuantity = (
    id: number,
    eatInQuantity: number,
    takeAwayQuantity: number,
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart[id];
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          eatInQuantity,
          takeAwayQuantity,
          quantity: eatInQuantity + takeAwayQuantity,
        };
        return {
          ...prevCart,
          [id]: updatedItem,
        };
      }
      return prevCart;
    });

    // If both quantities are 0, remove the item automatically
    if (eatInQuantity === 0 && takeAwayQuantity === 0) {
      removeItem(id);
    }
  };

  const removeItem = (id: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[id];
      return updatedCart;
    });
  };

  const getTotalPrice = () => {
    return Object.values(cart).reduce((total, item) => {
      const eatIn = item.eatInQuantity || 0;
      const takeAway = item.takeAwayQuantity || 0;
      const itemTotal = item.price * (eatIn + takeAway);
      return total + itemTotal;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateItemQuantity,
        removeItem,
        getTotalPrice,
        animation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

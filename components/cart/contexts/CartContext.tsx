import { createContext, use, useState } from "react";

import { ICartContext, ICartItem } from "../types";
import { IProduct } from "@/components/products/types";
import { getUnitPrice } from "../utils";

const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartContextProvider = ({ children }: any) => {
  const [cart, setCart] = useState<ICartItem[]>([]);

  const handleAddCartItem = (newItem: IProduct) => {
    setCart((prevCart) => {
      const currentItem = prevCart.find((item) => item.item.id === newItem.id);

      if (currentItem) {
        if (currentItem.item.availableQuantity > 0) {
          return prevCart.map((item) => {
            if (item.item.id === newItem.id) {
              return {
                item: {
                  ...item.item,
                  availableQuantity: item.item.availableQuantity - 1,
                },
                quantity: item.quantity + 1,
              };
            }
            return item;
          });
        }
        return prevCart;
      }

      if (newItem.availableQuantity > 0) {
        return [
          ...prevCart,
          {
            item: {
              ...newItem,
              availableQuantity: newItem.availableQuantity - 1,
            },
            quantity: 1,
          },
        ];
      }
      return prevCart;
    });
  };
  const handleDecreaseItemQuantity = (id: number) => {
    setCart((prevCart) => {
      const currentItem = prevCart.find((item) => item.item.id === id);

      if (currentItem) {
        if (currentItem.quantity === 1) {
          return prevCart.filter((item) => item.item.id !== id);
        }

        return prevCart.map((item) => {
          if (item.item.id === id) {
            return {
              item: {
                ...item.item,
                availableQuantity: item.item.availableQuantity + 1,
              },
              quantity: item.quantity - 1,
            };
          }
          return item;
        });
      }

      return prevCart;
    });
  };
  const handleRemoveAllItems = () => setCart([]);
  const getTotalPrice = () => {
    if (cart.length === 0) return 0;

    return cart.reduce((acc: number, item: ICartItem) => {
      const unitPrice = getUnitPrice(item.item);
      return acc + item.quantity * unitPrice;
    }, 0);
  };
  const getTotalItems = () => cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        handleAddCartItem,
        handleDecreaseItemQuantity,
        handleRemoveAllItems,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCartContext() {
  const context = use(CartContext);
  if (!context) {
    throw new Error(
      "Error! CartContext called from outside the CartContextProvider",
    );
  }
  return context;
}

import type { IProduct } from "@/components/products/types";

export interface ICartContext {
  cart: ICartItem[];
  handleAddCartItem: (item: IProduct) => void;
  handleDecreaseItemQuantity: (id: number) => void;
  handleRemoveAllItems: () => void;
  getTotalPrice: () => void;
}

export interface ICartItem {
  item: IProduct;
  quantity: number;
}

interface IOrderItem {
  productId: number;
  name: string;
  quantity: number;
  unit: "liter" | "kg" | "dozen";
}
export interface IOrderRequest {
  items: IOrderItem[];
  totalAmount: number;
}
export interface IOrderResponse {
  message: "Order created successfully";
  order: IOrder;
}
export interface IOrder {
  id: number;
  userId: number;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  orderDate: string;
}

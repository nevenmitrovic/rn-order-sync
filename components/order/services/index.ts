import axiosInstance from "@/axios/axiosInstance";
import { IOrderRequest, IOrderResponse } from "../types";
import { Toast } from "toastify-react-native";

export async function createOrder({
  items,
  totalAmount,
}: IOrderRequest): Promise<IOrderResponse | void> {
  if (items.length === 0) {
    Toast.error("You must order at least one item!");
    return;
  }
  const { data } = await axiosInstance.post("/order", { items, totalAmount });
  return data;
}

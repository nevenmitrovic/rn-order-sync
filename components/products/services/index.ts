import axiosInstance from "@/axios/axiosInstance";
import { IProduct } from "../types";

export async function getProducts(): Promise<IProduct[]> {
  const { data } = await axiosInstance.get("/products");
  return data;
}

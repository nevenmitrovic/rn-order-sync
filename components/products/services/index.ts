import axiosInstance from "@/axios/axiosInstance";
import { IProduct } from "../types";

export async function getProducts(): Promise<IProduct[]> {
  const { data } = await axiosInstance.get("/products");
  return data;
}

export async function getProductById(id: string): Promise<IProduct> {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
}

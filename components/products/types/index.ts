export interface IProduct {
  id: number;
  name: string;
  category: string;
  pricePerKg?: number;
  pricePerLiter?: number;
  pricePerDozen?: number;
  unit: "liter" | "kg" | "dozen";
  availableQuantity: number;
  harvestDate: string;
}
export interface ProductImageProps {
  imageUri?: string;
}

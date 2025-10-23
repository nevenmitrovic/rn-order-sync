import { IProduct } from "@/components/products/types";

export const getUnitPrice = (product: IProduct): number => {
  switch (product.unit) {
    case "liter":
      return product.pricePerLiter ?? 0;
    case "kg":
      return product.pricePerKg ?? 0;
    case "dozen":
      return product.pricePerDozen ?? 0;
    default:
      console.warn(`Unknown unit: ${product.unit}`);
      return 0;
  }
};

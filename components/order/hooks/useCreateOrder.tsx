import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "toastify-react-native";

import { createOrder } from "../services";
import { IOrderRequest } from "../types";
import { queryKeys } from "@/react-query/queryKeys";
import { useCartContext } from "@/components/cart/contexts/CartContext";

export function useCreateOrder() {
  const { handleRemoveAllItems } = useCartContext();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (order: IOrderRequest) => createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.orders] });
      Toast.success(
        "You’ve successfully sent your order request! Please come back later and check your order in the Orders tab!",
      );
      handleRemoveAllItems();
    },
  });

  return { mutate };
}

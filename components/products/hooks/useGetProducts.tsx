import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../services/index";
import { queryKeys } from "@/react-query/queryKeys";

export function useGetProducts() {
  const { data: products, isFetching: isFetchingProducts } = useQuery({
    queryKey: [queryKeys.products],
    queryFn: getProducts,
  });

  return { products, isFetchingProducts };
}

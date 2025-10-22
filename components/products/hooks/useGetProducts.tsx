import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../services/index";
import { queryKeys } from "@/react-query/queryKeys";

export function useGetProducts() {
  const { data: products, isFetching: isFetchingProducts } = useQuery({
    queryKey: [queryKeys.products],
    queryFn: getProducts,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 60, // 1h
    gcTime: 1000 * 60 * 60 * 2, // 2h
  });

  return { products, isFetchingProducts };
}

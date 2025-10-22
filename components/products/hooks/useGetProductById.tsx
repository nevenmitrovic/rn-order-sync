import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/react-query/queryKeys";
import { getProductById } from "../services";

export function useGetProductById(id: string) {
  const { data: product, isFetching: isFetchingProduct } = useQuery({
    queryKey: [queryKeys.product, id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  return { product, isFetchingProduct };
}

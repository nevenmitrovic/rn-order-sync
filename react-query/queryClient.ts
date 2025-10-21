import {
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryClientConfig,
} from "@tanstack/react-query";

import { createTitle, errorHandler } from "./utils";

export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10min
      gcTime: 900000, // 15min
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const title = createTitle(error.message, "query");
      errorHandler(title);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const title = createTitle(error.message, "mutation");
      errorHandler(title);
    },
  }),
};

export const queryClient = new QueryClient(queryClientOptions);

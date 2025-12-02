import { NavigatorProvider } from "@idealyst/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { createGraphQLClient } from "../graphql/client";
import AppRouter from "../navigation/AppRouter";
import { createTRPCClient, trpc } from "../trpc/client";

interface AppProps {
  apiUrl?: string;
  graphqlUrl?: string;
  queryClient?: QueryClient;
  headers?: () => Record<string, string>;
}

// Default query client instance
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

/**
 * Unified App component that sets up tRPC, GraphQL, React Query providers, and Navigation
 * This component can be used by both web and mobile platforms
 */
export const App: React.FC<AppProps> = ({
  apiUrl = "http://localhost:3000/trpc",
  graphqlUrl = "http://localhost:3000/graphql",
  queryClient = defaultQueryClient,
  headers,
}) => {
  // Create tRPC client with the provided configuration
  const trpcClient = createTRPCClient({
    apiUrl,
    headers,
  });

  // Initialize GraphQL client
  useEffect(() => {
    createGraphQLClient({
      apiUrl: graphqlUrl,
      headers,
    });
  }, [graphqlUrl, headers]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NavigatorProvider route={AppRouter} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;

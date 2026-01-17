import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigatorProvider } from '@idealyst/navigation';
import { ExampleNavigationRouter } from '@idealyst/navigation/examples';
import { trpc, createTRPCClient } from '../trpc/client';
import { createApolloClient, ApolloProvider } from '../graphql/client';

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
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

/**
 * Unified App component that sets up tRPC, Apollo/GraphQL, React Query providers, and Navigation
 * This component can be used by both web and mobile platforms
 */
export const App: React.FC<AppProps> = ({
  apiUrl = 'http://localhost:3000/trpc',
  graphqlUrl = 'http://localhost:3000/graphql',
  queryClient = defaultQueryClient,
  headers
}) => {
  // Create tRPC client with the provided configuration
  const trpcClient = createTRPCClient({
    apiUrl,
    headers,
  });

  // Create Apollo Client (memoized to prevent recreation on re-renders)
  const apolloClient = useMemo(
    () => createApolloClient({ graphqlUrl, headers }),
    [graphqlUrl]
  );

  return (
    <ApolloProvider client={apolloClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <NavigatorProvider route={ExampleNavigationRouter} />
        </QueryClientProvider>
      </trpc.Provider>
    </ApolloProvider>
  );
};

export default App;

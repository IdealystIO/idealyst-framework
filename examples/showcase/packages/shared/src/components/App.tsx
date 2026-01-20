import React, { useState } from 'react';
import { NavigatorProvider } from '@idealyst/navigation';
import { config } from '@idealyst/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShowcaseRouter } from '../navigation/ShowcaseRouter';
import { trpc, createTRPCClient } from '../trpc/client';
import { ApolloProvider, createApolloClient } from '../graphql/client';

// API URL from environment configuration
const API_URL = config.get('API_URL', 'http://localhost:3002');

/**
 * Main App component for the Idealyst Showcase
 * Sets up navigation with tRPC and Apollo providers
 */
export const App: React.FC = () => {
  // Create React Query client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5000,
      },
    },
  }));

  // Create tRPC client
  const [trpcClient] = useState(() =>
    createTRPCClient({
      apiUrl: `${API_URL}/trpc`,
    })
  );

  // Create Apollo client
  const [apolloClient] = useState(() =>
    createApolloClient({
      graphqlUrl: `${API_URL}/graphql`,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <NavigatorProvider route={ShowcaseRouter} />
        </ApolloProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigatorProvider } from '@idealyst/navigation';
import { trpc, createTRPCClient } from '../trpc/client';
import AppRouter from '../navigation/AppRouter';
import { ExampleStackRouter } from '@idealyst/navigation/examples';

interface AppProps {
  apiUrl?: string;
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
 * Unified App component that sets up tRPC, React Query providers, and Navigation
 * This component can be used by both web and mobile platforms
 */
export const App: React.FC<AppProps> = ({ 
  apiUrl = 'http://localhost:3000/trpc',
  queryClient = defaultQueryClient,
  headers
}) => {
  // Create tRPC client with the provided configuration
  const trpcClient = createTRPCClient({
    apiUrl,
    headers,
  });

  return (
      <NavigatorProvider route={ExampleStackRouter} />
  );
};

export default App;

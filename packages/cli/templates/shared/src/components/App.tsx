import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, createTRPCClient } from '../trpc/client';
import { HelloWorld } from './HelloWorld';

interface AppProps {
  apiUrl?: string;
  queryClient?: QueryClient;
  headers?: () => Record<string, string>;
  // HelloWorld component props
  name?: string;
  platform?: "web" | "mobile";
  projectName?: string;
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
 * Unified App component that sets up tRPC and React Query providers
 * and includes the HelloWorld component directly
 */
export const App: React.FC<AppProps> = ({ 
  apiUrl = 'http://localhost:3000/trpc',
  queryClient = defaultQueryClient,
  headers,
  name,
  platform = "web",
  projectName
}) => {
  // Create tRPC client with the provided configuration
  const trpcClient = createTRPCClient({
    apiUrl,
    headers,
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HelloWorld 
          name={name}
          platform={platform}
          projectName={projectName}
        />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;

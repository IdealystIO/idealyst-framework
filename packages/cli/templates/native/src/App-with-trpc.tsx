import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { NavigatorProvider } from '@idealyst/navigation';
import { trpc } from './utils/trpc';
import AppRouter from './navigation/AppRouter';

// Create tRPC client
const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc', // Update this to your API URL
      // For device testing, you might need: 'http://192.168.1.xxx:3000/trpc'
      // Optional: Add headers for authentication
      // headers() {
      //   return {
      //     authorization: getAuthToken(),
      //   };
      // },
    }),
  ],
});

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NavigatorProvider route={AppRouter} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App; 
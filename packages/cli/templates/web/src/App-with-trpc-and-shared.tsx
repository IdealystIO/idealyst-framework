import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { BrowserRouter } from 'react-router-dom';
import { NavigatorProvider } from '@idealyst/navigation';
import { trpc } from './utils/trpc';
import { AppRouter } from '@{{workspaceScope}}/shared';

// Create tRPC client
const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc', // Update this to match your API URL
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
        <BrowserRouter>
          <NavigatorProvider route={AppRouter} />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;

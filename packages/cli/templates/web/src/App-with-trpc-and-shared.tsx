import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';

// Import shared components
import { HelloWorld } from '@{{workspaceScope}}/shared';

// Create tRPC client
const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc', // API server port
    }),
  ],
});

// App wrapper with providers
function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HelloWorld 
          name="{{projectName}} Developer" 
          platform="web" 
          projectName="{{projectName}}"
          trpcClient={trpc}
        />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { trpc } from './utils/trpc';
import { Screen, Text, View } from '@idealyst/components';

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

function HomePage() {
  // Example tRPC usage
  const { data, isLoading, error } = trpc.hello.useQuery({ name: 'World' });

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="h1">Welcome to {{projectName}}!</Text>
        <Text variant="body">
          This is a React Web app built with the Idealyst Framework
        </Text>
        
        {/* tRPC Example */}
        <View style={{ marginTop: 20 }}>
          <Text variant="h3">tRPC Example:</Text>
          {isLoading && <Text>Loading...</Text>}
          {error && <Text>Error: {error.message}</Text>}
          {data && <Text>{data.greeting}</Text>}
        </View>
        
        <Text variant="caption" style={{ marginTop: 20 }}>
          Edit src/App.tsx to get started
        </Text>
      </View>
    </Screen>
  );
}

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App; 
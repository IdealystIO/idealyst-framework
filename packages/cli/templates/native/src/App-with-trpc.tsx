import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { Screen, Text, View } from '@idealyst/components';
import { trpc } from './utils/trpc';

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
  // Example tRPC usage
  const { data, isLoading, error } = trpc.hello.useQuery({ name: 'React Native' });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Screen>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text variant="h1" style={{ textAlign: 'center', marginBottom: 20 }}>
              Welcome to {{appName}}!
            </Text>
            <Text variant="body" style={{ textAlign: 'center', marginBottom: 20 }}>
              This is a React Native app built with the Idealyst Framework
            </Text>
            
            {/* tRPC Example */}
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <Text variant="h3" style={{ marginBottom: 10 }}>tRPC Example:</Text>
              {isLoading && <Text>Loading...</Text>}
              {error && <Text>Error: {error.message}</Text>}
              {data && <Text style={{ textAlign: 'center' }}>{data.greeting}</Text>}
            </View>
            
            <Text variant="caption" style={{ textAlign: 'center', marginTop: 30 }}>
              Edit src/App.tsx to get started
            </Text>
          </View>
        </Screen>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App; 
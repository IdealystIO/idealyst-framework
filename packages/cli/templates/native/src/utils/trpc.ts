import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

// Import the API router type for full type safety
import type { AppRouter } from '@{{workspaceScope}}/api';

// Create the tRPC React hooks with full type safety
export const trpc = createTRPCReact<AppRouter>();

// Create a vanilla client (for use outside of React components)
export const trpcClient = createTRPCProxyClient<AppRouter>({
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

/*
Usage Examples for React Native:

1. First, install the required dependencies:
   yarn add @trpc/client @trpc/react-query @tanstack/react-query

2. Replace the AppRouter type import above with your actual API router:
   import type { AppRouter } from '@your-workspace/api';

3. Set up the tRPC provider in your App component:

```tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './src/utils/trpc';

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc', // Use your computer's IP for device testing
      // For device testing, you might need: 'http://192.168.1.xxx:3000/trpc'
    }),
  ],
});

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
       // Your app components
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
```

4. Use tRPC in your React Native components:

```tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { trpc } from '../utils/trpc';

function UsersList() {
  const { data: users, isLoading, refetch } = trpc.users.getAll.useQuery();
  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      refetch(); // Refresh the list after creating
    },
  });

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {users?.map(user => (
        <View key={user.id}>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
        </View>
      ))}
      <TouchableOpacity
        onPress={() => createUser.mutate({ 
          email: 'test@example.com', 
          name: 'Test User' 
        })}
      >
        <Text>Create User</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

5. For device testing, make sure to:
   - Use your computer's IP address instead of localhost
   - Ensure your API server is accessible from the device
   - Consider using ngrok for external testing

6. Error handling example:

```tsx
const { data, error, isLoading } = trpc.users.getAll.useQuery();

if (error) {
  return <Text>Error: {error.message}</Text>;
}
```
*/ 
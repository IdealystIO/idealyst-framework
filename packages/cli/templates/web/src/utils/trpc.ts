import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

// Import your API types here when you have an API project
// Example: import type { AppRouter } from '@your-workspace/api';

// For now, we'll use a generic type that you can replace
type AppRouter = any;

// Create the tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Create a vanilla client (for use outside of React components)
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc', // Update this to match your API URL
      // Optional: Add headers
      // headers() {
      //   return {
      //     authorization: getAuthToken(),
      //   };
      // },
    }),
  ],
});

/*
Usage Examples:

1. First, install the required dependencies:
   yarn add @trpc/client @trpc/react-query @tanstack/react-query

2. Replace the AppRouter type import above with your actual API router:
   import type { AppRouter } from '@your-workspace/api';

3. Set up the tRPC provider in your App component:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
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
```

4. Use tRPC in your components:

```tsx
import { trpc } from '../utils/trpc';

function UsersList() {
  const { data: users, isLoading } = trpc.users.getAll.useQuery();
  const createUser = trpc.users.create.useMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button
        onClick={() => createUser.mutate({ 
          email: 'test@example.com', 
          name: 'Test User' 
        })}
      >
        Create User
      </button>
    </div>
  );
}
```
*/ 
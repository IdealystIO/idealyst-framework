import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@{{workspaceScope}}/api';

// Create the tRPC React hooks with full type safety
export const trpc = createTRPCReact<AppRouter>();

// Configuration for tRPC client
export interface TRPCClientConfig {
  apiUrl: string;
  headers?: () => Record<string, string>;
}

// Create tRPC client factory
export function createTRPCClient(config: TRPCClientConfig) {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: config.apiUrl,
        headers: config.headers,
      }),
    ],
  });
}

// Create a vanilla client (for use outside of React components)
export function createVanillaTRPCClient(config: TRPCClientConfig) {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: config.apiUrl,
        headers: config.headers,
      }),
    ],
  });
}

// Export types
export type { AppRouter } from '@{{workspaceScope}}/api';

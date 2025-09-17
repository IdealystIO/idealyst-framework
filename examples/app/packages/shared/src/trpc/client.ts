import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@test-select-demo/api";

// Create the tRPC React hooks with full type safety
export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> =
  createTRPCReact<AppRouter>();

// Configuration for tRPC client
export interface TRPCClientConfig {
  apiUrl: string;
  headers?: () => Record<string, string>;
}

// Create tRPC client factory
export function createTRPCClient(
  config: TRPCClientConfig
): ReturnType<typeof trpc.createClient> {
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
export function createVanillaTRPCClient(
  config: TRPCClientConfig
): ReturnType<typeof createTRPCProxyClient<AppRouter>> {
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
export type { AppRouter } from "@test-select-demo/api";

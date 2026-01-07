// Export the unified App component
export { App } from './components';

// Export tRPC client utilities
export { trpc, createTRPCClient, createVanillaTRPCClient } from './trpc/client';
export type { TRPCClientConfig, AppRouter as TRPCAppRouter } from './trpc/client';

// Simple type for the HelloWorld component props
export interface HelloWorldProps {
  name?: string;
}
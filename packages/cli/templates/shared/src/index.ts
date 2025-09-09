// Export the unified App component
export { App } from './components';

// Export navigation router
export { default as AppRouter } from './navigation/AppRouter';

// Export tRPC client utilities
export { trpc, createTRPCClient, createVanillaTRPCClient } from './trpc/client';
export type { TRPCClientConfig, AppRouter } from './trpc/client';

// Simple type for the HelloWorld component props
export interface HelloWorldProps {
  name?: string;
}
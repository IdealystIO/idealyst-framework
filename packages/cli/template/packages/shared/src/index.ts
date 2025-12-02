// Export the unified App component
export { App } from './components';

// Export navigation router
export { default as AppRouter } from './navigation/AppRouter';

// Export tRPC client utilities
export { trpc, createTRPCClient, createVanillaTRPCClient } from './trpc/client';
export type { TRPCClientConfig, AppRouter } from './trpc/client';

// Export GraphQL client utilities
export {
  createGraphQLClient,
  getGraphQLClient,
  gql,
} from './graphql/client';
export type { GraphQLClientConfig, GraphQLClient } from './graphql/client';

// Simple type for the HelloWorld component props
export interface HelloWorldProps {
  name?: string;
}
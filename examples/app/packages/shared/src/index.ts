// Export the unified App component
export { App } from './components';

// Export tRPC client utilities
export { trpc, createTRPCClient, createVanillaTRPCClient } from './trpc/client';
export type { TRPCClientConfig, AppRouter as TRPCAppRouter } from './trpc/client';

// Export GraphQL/Apollo client utilities
export {
  createApolloClient,
  ApolloProvider,
  useQuery,
  useMutation,
  useLazyQuery,
  gql
} from './graphql/client';
export type { ApolloClientConfig, ApolloError, QueryResult, MutationResult } from './graphql/client';

// Export screens
export { GraphQLDemoScreen } from './screens';

// Simple type for the HelloWorld component props
export interface HelloWorldProps {
  name?: string;
}
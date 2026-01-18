/**
 * Apollo Client Configuration
 *
 * Provides a configured Apollo Client for GraphQL queries and mutations.
 */

import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

export interface ApolloClientConfig {
  graphqlUrl?: string;
  headers?: () => Record<string, string>;
}

// Error handling link
const createErrorLink = () =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

/**
 * Creates a configured Apollo Client
 */
export function createApolloClient(config: ApolloClientConfig = {}) {
  const { graphqlUrl = 'http://localhost:3000/graphql', headers } = config;

  // HTTP link to GraphQL endpoint
  const httpLink = new HttpLink({
    uri: graphqlUrl,
    credentials: 'include',
    headers: headers?.(),
  });

  // Create the Apollo Client
  return new ApolloClient({
    link: from([createErrorLink(), httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Item: {
          keyFields: ['id'],
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
}

// Re-export Apollo hooks and types for convenience
export {
  ApolloProvider,
  useQuery,
  useMutation,
  useLazyQuery,
  gql,
} from '@apollo/client';

export type { ApolloError, QueryResult, MutationResult } from '@apollo/client';

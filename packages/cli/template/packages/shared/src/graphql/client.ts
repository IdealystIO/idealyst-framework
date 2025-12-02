import { GraphQLClient } from "graphql-request";

// Configuration for GraphQL client
export interface GraphQLClientConfig {
  apiUrl: string;
  headers?: () => Record<string, string>;
}

// Singleton instance for the GraphQL client
let graphqlClient: GraphQLClient | null = null;

// Create GraphQL client factory
export function createGraphQLClient(config: GraphQLClientConfig): GraphQLClient {
  graphqlClient = new GraphQLClient(config.apiUrl, {
    headers: config.headers?.() ?? {},
  });
  return graphqlClient;
}

// Get the current GraphQL client instance
export function getGraphQLClient(): GraphQLClient {
  if (!graphqlClient) {
    throw new Error(
      "GraphQL client not initialized. Call createGraphQLClient first."
    );
  }
  return graphqlClient;
}

// Re-export gql for convenience
export { gql } from "graphql-request";

// Re-export GraphQLClient type
export type { GraphQLClient };

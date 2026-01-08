/**
 * GraphQL extension generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, PackageGeneratorResult } from '../../types';
import { addDependencies } from '../../templates/merger';
import { DEPENDENCIES } from '../../constants';
import { logger } from '../../utils/logger';

/**
 * Apply GraphQL extension to a workspace
 */
export async function applyGraphqlExtension(
  projectPath: string,
  data: TemplateData
): Promise<PackageGeneratorResult> {
  logger.info('Configuring GraphQL...');

  // Add GraphQL to API package
  await addGraphqlToApi(projectPath, data);

  // Add GraphQL client to web package
  await addGraphqlToWeb(projectPath, data);

  // Add GraphQL client to mobile package
  await addGraphqlToMobile(projectPath, data);

  return { success: true };
}

/**
 * Add GraphQL server setup to API package
 */
async function addGraphqlToApi(projectPath: string, data: TemplateData): Promise<void> {
  const apiDir = path.join(projectPath, 'packages', 'api');
  const graphqlDir = path.join(apiDir, 'src', 'graphql');

  await fs.ensureDir(graphqlDir);
  await fs.ensureDir(path.join(graphqlDir, 'resolvers'));

  // Create schema.ts
  await fs.writeFile(
    path.join(graphqlDir, 'schema.ts'),
    createGraphqlSchema(data)
  );

  // Create builder.ts (Pothos schema builder)
  await fs.writeFile(
    path.join(graphqlDir, 'builder.ts'),
    createPothosBuilder(data)
  );

  // Create resolvers/index.ts
  await fs.writeFile(
    path.join(graphqlDir, 'resolvers', 'index.ts'),
    createExampleResolvers(data)
  );

  // Add dependencies
  await addDependencies(
    path.join(apiDir, 'package.json'),
    DEPENDENCIES.graphqlServer
  );
}

/**
 * Add GraphQL client to web package
 */
async function addGraphqlToWeb(projectPath: string, data: TemplateData): Promise<void> {
  const webDir = path.join(projectPath, 'packages', 'web');
  const graphqlDir = path.join(webDir, 'src', 'graphql');

  await fs.ensureDir(graphqlDir);

  // Create client.ts
  await fs.writeFile(
    path.join(graphqlDir, 'client.ts'),
    createGraphqlClient('web')
  );

  // Add dependencies
  await addDependencies(
    path.join(webDir, 'package.json'),
    DEPENDENCIES.graphql
  );
}

/**
 * Add GraphQL client to mobile package
 */
async function addGraphqlToMobile(projectPath: string, data: TemplateData): Promise<void> {
  const mobileDir = path.join(projectPath, 'packages', 'mobile');
  const graphqlDir = path.join(mobileDir, 'src', 'graphql');

  await fs.ensureDir(graphqlDir);

  // Create client.ts
  await fs.writeFile(
    path.join(graphqlDir, 'client.ts'),
    createGraphqlClient('mobile')
  );

  // Add dependencies
  await addDependencies(
    path.join(mobileDir, 'package.json'),
    DEPENDENCIES.graphql
  );
}

/**
 * Create GraphQL schema with Pothos
 */
function createGraphqlSchema(data: TemplateData): string {
  return `/**
 * GraphQL schema
 */

import { builder } from './builder';
import './resolvers';

export const schema = builder.toSchema();
`;
}

/**
 * Create Pothos schema builder
 */
function createPothosBuilder(data: TemplateData): string {
  let imports = `import SchemaBuilder from '@pothos/core';`;
  let builderConfig = '';

  if (data.hasPrisma) {
    imports += `
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { prisma } from '@${data.workspaceScope}/database';`;

    builderConfig = `
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },`;
  }

  return `/**
 * Pothos schema builder
 */

${imports}

export const builder = new SchemaBuilder<{
  Context: {
${data.hasPrisma ? '    prisma: typeof prisma;' : ''}
  };${data.hasPrisma ? `
  PrismaTypes: PrismaTypes;` : ''}
}>({${builderConfig}
});

// Initialize Query and Mutation types
builder.queryType({});
builder.mutationType({});
`;
}

/**
 * Create example resolvers
 */
function createExampleResolvers(data: TemplateData): string {
  return `/**
 * Example GraphQL resolvers
 */

import { builder } from '../builder';

// Health check query
builder.queryField('health', (t) =>
  t.field({
    type: 'String',
    resolve: () => 'GraphQL API is healthy!',
  })
);

// Hello query with argument
builder.queryField('hello', (t) =>
  t.field({
    type: 'String',
    args: {
      name: t.arg.string(),
    },
    resolve: (_, { name }) => \`Hello, \${name || 'World'}!\`,
  })
);

// Example mutation
builder.mutationField('echo', (t) =>
  t.field({
    type: 'String',
    args: {
      message: t.arg.string({ required: true }),
    },
    resolve: (_, { message }) => message,
  })
);
${data.hasPrisma ? `
// Example User type (uncomment to use with Prisma)
// builder.prismaObject('User', {
//   fields: (t) => ({
//     id: t.exposeID('id'),
//     email: t.exposeString('email'),
//     name: t.exposeString('name', { nullable: true }),
//     posts: t.relation('posts'),
//   }),
// });
` : ''}
`;
}

/**
 * Create GraphQL client
 */
function createGraphqlClient(platform: 'web' | 'mobile'): string {
  const apiUrl = platform === 'mobile'
    ? 'http://10.0.2.2:3000/graphql'
    : 'http://localhost:3000/graphql';

  return `/**
 * Apollo GraphQL client for ${platform}
 */

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.${platform === 'web' ? 'VITE_' : ''}GRAPHQL_URL || '${apiUrl}',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

// Re-export common hooks
export { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
`;
}

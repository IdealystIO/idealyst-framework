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

  // Add Prisma plugin if Prisma is enabled
  if (data.hasPrisma) {
    await addDependencies(
      path.join(apiDir, 'package.json'),
      DEPENDENCIES.graphqlServerPrisma
    );
  }
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
  if (data.hasPrisma) {
    // With Prisma: use @pothos/plugin-prisma for type-safe GraphQL from models
    return `/**
 * Pothos schema builder with Prisma integration
 */

import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@${data.workspaceScope}/database/pothos';
import { prisma, Prisma } from '@${data.workspaceScope}/database';

// Export prisma for use in resolvers
export { prisma };

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    // Required for the Prisma plugin - provides Prisma's data model metadata
    dmmf: Prisma.dmmf,
  },
});

// Initialize Query and Mutation types
builder.queryType({});
builder.mutationType({});
`;
  }

  // Without Prisma: simple builder
  return `/**
 * Pothos schema builder
 */

import SchemaBuilder from '@pothos/core';

export const builder = new SchemaBuilder<{
  Context: {};
}>({});

// Initialize Query and Mutation types
builder.queryType({});
builder.mutationType({});
`;
}

/**
 * Create example resolvers
 */
function createExampleResolvers(data: TemplateData): string {
  const prismaResolvers = data.hasPrisma ? `
// Item type - using Prisma plugin for type-safe GraphQL from Prisma models
builder.prismaObject('Item', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    completed: t.exposeBoolean('completed'),
    createdAt: t.field({
      type: 'String',
      resolve: (item) => item.createdAt.toISOString(),
    }),
  }),
});

// Items query
builder.queryField('items', (t) =>
  t.prismaField({
    type: ['Item'],
    resolve: async (query) => {
      return await prisma.item.findMany({
        ...query,
        orderBy: { createdAt: 'desc' },
      });
    },
  })
);

// Create item mutation
builder.mutationField('createItem', (t) =>
  t.prismaField({
    type: 'Item',
    args: {
      title: t.arg.string({ required: true }),
      description: t.arg.string(),
    },
    resolve: async (query, _, { title, description }) => {
      return await prisma.item.create({
        ...query,
        data: { title, description },
      });
    },
  })
);

// Toggle item mutation
builder.mutationField('toggleItem', (t) =>
  t.prismaField({
    type: 'Item',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _, { id }) => {
      const item = await prisma.item.findUnique({ where: { id } });
      if (!item) throw new Error('Item not found');
      return await prisma.item.update({
        ...query,
        where: { id },
        data: { completed: !item.completed },
      });
    },
  })
);

// Delete item mutation
builder.mutationField('deleteItem', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, { id }) => {
      await prisma.item.delete({ where: { id } });
      return true;
    },
  })
);
` : '';

  return `/**
 * Example GraphQL resolvers
 */

import { builder${data.hasPrisma ? ', prisma' : ''} } from '../builder';

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
${prismaResolvers}
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

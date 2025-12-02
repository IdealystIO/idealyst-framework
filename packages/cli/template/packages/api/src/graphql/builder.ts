import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import ValidationPlugin from '@pothos/plugin-validation';
import type PrismaTypes from './generated.js';
import { prisma } from '../lib/database.js';
import type { Context } from '../context.js';

/**
 * Pothos Schema Builder
 *
 * This is the central schema builder for GraphQL. It integrates with:
 * - Prisma: Auto-generates types from your database models
 * - Relay: Provides connection/pagination patterns
 * - Validation: Integrates with Zod for input validation
 *
 * The builder is configured with your Prisma client and context type,
 * enabling full type safety between your database and GraphQL schema.
 */
export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
    JSON: {
      Input: unknown;
      Output: unknown;
    };
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin, ValidationPlugin],
  prisma: {
    client: prisma,
    // Use cursor-based pagination by default
    exposeDescriptions: true,
    // Filter out internal Prisma fields
    filterConnectionTotalCount: true,
  },
  relay: {
    // Configure Relay-style connections
    clientMutationId: 'omit',
    cursorType: 'String',
  },
});

// Add custom scalars
builder.scalarType('DateTime', {
  serialize: (value) => value.toISOString(),
  parseValue: (value) => {
    if (typeof value !== 'string') {
      throw new Error('DateTime must be a string');
    }
    return new Date(value);
  },
});

builder.scalarType('JSON', {
  serialize: (value) => value,
  parseValue: (value) => value,
});

// Initialize Query and Mutation types
// These will be extended by individual type definitions
builder.queryType({
  description: 'The root query type',
});

builder.mutationType({
  description: 'The root mutation type',
});

export default builder;

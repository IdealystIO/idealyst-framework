/**
 * Pothos GraphQL Schema Builder
 */

import SchemaBuilder from '@pothos/core';

// Create the schema builder
export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({});

// Add DateTime scalar for handling timestamps
builder.scalarType('DateTime', {
  serialize: (value) => value.toISOString(),
  parseValue: (value) => new Date(value as string),
});

// Initialize Query and Mutation types
builder.queryType({});
builder.mutationType({});

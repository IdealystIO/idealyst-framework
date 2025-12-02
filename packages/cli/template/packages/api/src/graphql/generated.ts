/**
 * Pothos Prisma Types
 *
 * This file provides type definitions for the Pothos Prisma plugin.
 * It maps your Prisma models to Pothos types.
 *
 * NOTE: For production use with many models, consider using the official
 * Pothos Prisma generator: https://pothos-graphql.dev/docs/plugins/prisma
 *
 * Add to your schema.prisma:
 * generator pothos {
 *   provider = "prisma-pothos-types"
 * }
 */

import type { Prisma } from '@{{workspaceScope}}/database/client';

/**
 * Prisma model type definitions for Pothos
 *
 * This maps each Prisma model to its Pothos type configuration.
 * The Shape type defines the fields available on the model.
 *
 * Add new models here as you create them in your Prisma schema.
 * Example for a model with relations:
 *
 * ```typescript
 * Product: {
 *   Name: 'Product';
 *   Shape: Prisma.ProductGetPayload<object>;
 *   Include: Prisma.ProductInclude;
 *   Select: Prisma.ProductSelect;
 *   OrderBy: Prisma.ProductOrderByWithRelationInput[];
 *   WhereUnique: Prisma.ProductWhereUniqueInput;
 *   Where: Prisma.ProductWhereInput;
 *   Create: Prisma.ProductCreateInput;
 *   Update: Prisma.ProductUpdateInput;
 *   RelationName: 'category' | 'orders';
 *   ListRelations: 'orders';
 *   Relations: {
 *     category: { Shape: Prisma.CategoryGetPayload<object>; Name: 'Category'; Nullable: false };
 *     orders: { Shape: Prisma.OrderGetPayload<object>[]; Name: 'Order'; Nullable: false };
 *   };
 * };
 * ```
 */
type PrismaTypes = {
  Test: {
    Name: 'Test';
    Shape: Prisma.TestGetPayload<object>;
    Include: never; // Test has no relations
    Select: Prisma.TestSelect;
    OrderBy: Prisma.TestOrderByWithRelationInput[];
    WhereUnique: Prisma.TestWhereUniqueInput;
    Where: Prisma.TestWhereInput;
    Create: Prisma.TestCreateInput;
    Update: Prisma.TestUpdateInput;
    RelationName: never;
    ListRelations: never;
    Relations: Record<string, never>;
  };
};

export default PrismaTypes;

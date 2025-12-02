/**
 * GraphQL Type Definitions
 *
 * This file imports and registers all GraphQL types with the schema builder.
 * Each type file defines Prisma model mappings and their queries/mutations.
 *
 * The Test type demonstrates the GraphQL equivalent of the tRPC test router,
 * showing how both APIs can expose the same functionality.
 *
 * To add a new type:
 * 1. Create a new file in this directory (e.g., `product.ts`)
 * 2. Define the Prisma object type and any queries/mutations
 * 3. Import the file here to register it with the schema
 *
 * Example:
 * ```typescript
 * // product.ts
 * builder.prismaObject('Product', {
 *   fields: (t) => ({
 *     id: t.exposeID('id'),
 *     name: t.exposeString('name'),
 *   }),
 * });
 * ```
 */

// =============================================================================
// Active Type Definitions
// =============================================================================

// Test model - demonstrates GraphQL equivalent of tRPC CRUD router
import './test.js';

// =============================================================================
// Additional Types
// =============================================================================

// Add additional type imports here as you create them.
// Example:
// import './product.js';
// import './order.js';

// Re-export builder for convenience
export { builder } from '../builder.js';

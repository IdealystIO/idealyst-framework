import { builder } from '../builder.js';
import { prisma } from '../../lib/database.js';

/**
 * Test GraphQL Type
 *
 * This is the GraphQL equivalent of the tRPC test router (src/routers/test.ts).
 * Both APIs provide the same CRUD operations for the Test model.
 *
 * GraphQL Queries (equivalent to tRPC queries):
 * - test(id)           → trpc.test.getById({ id })
 * - tests(skip, take)  → trpc.test.getAll({ skip, take })
 * - testCount          → trpc.test.count({})
 *
 * GraphQL Mutations (equivalent to tRPC mutations):
 * - createTest(input)      → trpc.test.create(data)
 * - updateTest(id, input)  → trpc.test.update({ id, data })
 * - deleteTest(id)         → trpc.test.delete({ id })
 *
 * Example GraphQL queries:
 *
 * ```graphql
 * # Get all tests (equivalent to trpc.test.getAll.useQuery({ take: 10 }))
 * query {
 *   tests(take: 10) {
 *     id
 *     name
 *     message
 *     status
 *     createdAt
 *   }
 * }
 *
 * # Get test by ID (equivalent to trpc.test.getById.useQuery({ id: 'xxx' }))
 * query {
 *   test(id: "test-id") {
 *     id
 *     name
 *     message
 *   }
 * }
 *
 * # Create test (equivalent to trpc.test.create.useMutation())
 * mutation {
 *   createTest(input: {
 *     name: "My Test"
 *     message: "Hello World"
 *     status: "active"
 *   }) {
 *     id
 *     name
 *   }
 * }
 *
 * # Update test (equivalent to trpc.test.update.useMutation())
 * mutation {
 *   updateTest(id: "test-id", input: { name: "Updated Name" }) {
 *     id
 *     name
 *   }
 * }
 *
 * # Delete test (equivalent to trpc.test.delete.useMutation())
 * mutation {
 *   deleteTest(id: "test-id") {
 *     id
 *   }
 * }
 * ```
 */

// =============================================================================
// Type Definition
// =============================================================================

const TestType = builder.prismaObject('Test', {
  description: 'A test record for API testing',
  fields: (t) => ({
    id: t.exposeID('id', { description: 'Unique identifier' }),
    name: t.exposeString('name', { description: 'Name of the test' }),
    message: t.exposeString('message', { description: 'Test message content' }),
    status: t.exposeString('status', { description: 'Status: "active" or "inactive"' }),
    createdAt: t.expose('createdAt', { type: 'DateTime', description: 'Creation timestamp' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime', description: 'Last update timestamp' }),
  }),
});

// =============================================================================
// Queries (equivalent to tRPC queries)
// =============================================================================

builder.queryFields((t) => ({
  // Equivalent to: trpc.test.getById({ id })
  test: t.field({
    type: TestType,
    nullable: true,
    description: 'Get a single test by ID',
    args: {
      id: t.arg.string({ required: true, description: 'The test ID' }),
    },
    resolve: async (_root, args) => {
      return prisma.test.findUnique({
        where: { id: args.id },
      });
    },
  }),

  // Equivalent to: trpc.test.getAll({ skip, take, orderBy })
  tests: t.field({
    type: [TestType],
    description: 'Get all tests with pagination',
    args: {
      skip: t.arg.int({ description: 'Number of records to skip' }),
      take: t.arg.int({ description: 'Number of records to take (default: 10, max: 100)' }),
      orderBy: t.arg.string({ description: 'Field to order by (e.g., "createdAt")' }),
      orderDir: t.arg.string({ description: 'Order direction: "asc" or "desc" (default: "desc")' }),
    },
    resolve: async (_root, args) => {
      const take = Math.min(args.take ?? 10, 100);
      const orderField = args.orderBy ?? 'createdAt';
      const orderDir = args.orderDir === 'asc' ? 'asc' : 'desc';

      return prisma.test.findMany({
        ...(args.skip != null ? { skip: args.skip } : {}),
        take,
        orderBy: { [orderField]: orderDir },
      });
    },
  }),

  // Equivalent to: trpc.test.count({ where })
  testCount: t.int({
    description: 'Get total count of test records',
    args: {
      status: t.arg.string({ description: 'Filter by status' }),
    },
    resolve: async (_root, args) => {
      return prisma.test.count({
        ...(args.status != null ? { where: { status: args.status } } : {}),
      });
    },
  }),
}));

// =============================================================================
// Input Types
// =============================================================================

const CreateTestInput = builder.inputType('CreateTestInput', {
  description: 'Input for creating a new test',
  fields: (t) => ({
    name: t.string({ required: true, description: 'Name of the test (required)' }),
    message: t.string({ required: true, description: 'Test message content (required)' }),
    status: t.string({ defaultValue: 'active', description: 'Status: "active" or "inactive" (default: "active")' }),
  }),
});

const UpdateTestInput = builder.inputType('UpdateTestInput', {
  description: 'Input for updating an existing test',
  fields: (t) => ({
    name: t.string({ description: 'New name (optional)' }),
    message: t.string({ description: 'New message (optional)' }),
    status: t.string({ description: 'New status (optional)' }),
  }),
});

// =============================================================================
// Mutations (equivalent to tRPC mutations)
// =============================================================================

builder.mutationFields((t) => ({
  // Equivalent to: trpc.test.create(data)
  createTest: t.field({
    type: TestType,
    description: 'Create a new test record',
    args: {
      input: t.arg({ type: CreateTestInput, required: true }),
    },
    resolve: async (_root, args) => {
      return prisma.test.create({
        data: {
          name: args.input.name,
          message: args.input.message,
          status: args.input.status ?? 'active',
        },
      });
    },
  }),

  // Equivalent to: trpc.test.update({ id, data })
  updateTest: t.field({
    type: TestType,
    nullable: true,
    description: 'Update an existing test record',
    args: {
      id: t.arg.string({ required: true, description: 'The test ID to update' }),
      input: t.arg({ type: UpdateTestInput, required: true }),
    },
    resolve: async (_root, args) => {
      // Check if record exists
      const existing = await prisma.test.findUnique({
        where: { id: args.id },
      });

      if (!existing) {
        throw new Error('Test not found');
      }

      // Build update data only with defined values
      const updateData: { name?: string; message?: string; status?: string } = {};
      if (args.input.name != null) updateData.name = args.input.name;
      if (args.input.message != null) updateData.message = args.input.message;
      if (args.input.status != null) updateData.status = args.input.status;

      return prisma.test.update({
        where: { id: args.id },
        data: updateData,
      });
    },
  }),

  // Equivalent to: trpc.test.delete({ id })
  deleteTest: t.field({
    type: TestType,
    nullable: true,
    description: 'Delete a test record',
    args: {
      id: t.arg.string({ required: true, description: 'The test ID to delete' }),
    },
    resolve: async (_root, args) => {
      // Check if record exists
      const existing = await prisma.test.findUnique({
        where: { id: args.id },
      });

      if (!existing) {
        throw new Error('Test not found');
      }

      return prisma.test.delete({
        where: { id: args.id },
      });
    },
  }),
}));

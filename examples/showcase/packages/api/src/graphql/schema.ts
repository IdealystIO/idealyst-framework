/**
 * GraphQL Schema Definition
 *
 * Uses Prisma database for data persistence.
 */

import { builder } from './builder.js';
import { prisma } from '../lib/database.js';

// =============================================================================
// Object Types
// =============================================================================

const ItemType = builder.objectRef<{
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}>('Item');

builder.objectType(ItemType, {
  description: 'A simple item for demonstrating CRUD operations',
  fields: (t) => ({
    id: t.exposeString('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    completed: t.exposeBoolean('completed'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

const ItemStatsType = builder.objectRef<{
  total: number;
  completed: number;
  pending: number;
}>('ItemStats');

builder.objectType(ItemStatsType, {
  description: 'Aggregate item statistics',
  fields: (t) => ({
    total: t.exposeInt('total'),
    completed: t.exposeInt('completed'),
    pending: t.exposeInt('pending'),
  }),
});

// =============================================================================
// Queries
// =============================================================================

builder.queryFields((t) => ({
  // Get single item by ID
  item: t.field({
    type: ItemType,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.item.findUnique({
        where: { id: args.id },
      });
    },
  }),

  // List all items with optional filtering
  items: t.field({
    type: [ItemType],
    args: {
      completed: t.arg.boolean(),
      search: t.arg.string(),
    },
    resolve: async (_, args) => {
      const where: any = {};

      if (args.completed !== null && args.completed !== undefined) {
        where.completed = args.completed;
      }

      if (args.search) {
        where.OR = [
          { title: { contains: args.search } },
          { description: { contains: args.search } },
        ];
      }

      return await prisma.item.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    },
  }),

  // Get item stats
  itemStats: t.field({
    type: ItemStatsType,
    resolve: async () => {
      const items = await prisma.item.findMany();

      return {
        total: items.length,
        completed: items.filter((i) => i.completed).length,
        pending: items.filter((i) => !i.completed).length,
      };
    },
  }),
}));

// =============================================================================
// Mutations
// =============================================================================

const CreateItemInput = builder.inputType('CreateItemInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    description: t.string(),
    completed: t.boolean({ defaultValue: false }),
  }),
});

const UpdateItemInput = builder.inputType('UpdateItemInput', {
  fields: (t) => ({
    title: t.string(),
    description: t.string(),
    completed: t.boolean(),
  }),
});

builder.mutationFields((t) => ({
  // Create a new item
  createItem: t.field({
    type: ItemType,
    args: {
      input: t.arg({ type: CreateItemInput, required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.item.create({
        data: {
          title: args.input.title,
          description: args.input.description,
          completed: args.input.completed ?? false,
        },
      });
    },
  }),

  // Update an existing item
  updateItem: t.field({
    type: ItemType,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
      input: t.arg({ type: UpdateItemInput, required: true }),
    },
    resolve: async (_, args) => {
      const data: any = {};

      if (args.input.title !== null && args.input.title !== undefined) {
        data.title = args.input.title;
      }
      if (args.input.description !== undefined) {
        data.description = args.input.description;
      }
      if (args.input.completed !== null && args.input.completed !== undefined) {
        data.completed = args.input.completed;
      }

      return await prisma.item.update({
        where: { id: args.id },
        data,
      });
    },
  }),

  // Delete an item
  deleteItem: t.field({
    type: ItemType,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.item.delete({
        where: { id: args.id },
      });
    },
  }),

  // Toggle item completed status
  toggleItem: t.field({
    type: ItemType,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      const item = await prisma.item.findUnique({
        where: { id: args.id },
      });

      if (!item) {
        return null;
      }

      return await prisma.item.update({
        where: { id: args.id },
        data: { completed: !item.completed },
      });
    },
  }),
}));

// Build and export the schema
export const schema = builder.toSchema();

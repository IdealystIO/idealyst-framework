/**
 * GraphQL Schema Definition
 *
 * Defines all GraphQL types, queries, and mutations using Pothos.
 * This provides a strongly-typed GraphQL API for the frontend.
 */

import { builder } from './builder.js';
import { prisma } from '../lib/database.js';

// =============================================================================
// Object Types - Define the shape of data returned by the API
// =============================================================================

/**
 * UserSettings GraphQL Type
 */
const UserSettingsType = builder.objectRef<{
  id: string;
  theme: string;
  notifications: boolean;
  emailUpdates: boolean;
  publicProfile: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>('UserSettings');

builder.objectType(UserSettingsType, {
  description: 'User preferences and settings',
  fields: (t) => ({
    id: t.exposeString('id'),
    theme: t.exposeString('theme'),
    notifications: t.exposeBoolean('notifications'),
    emailUpdates: t.exposeBoolean('emailUpdates'),
    publicProfile: t.exposeBoolean('publicProfile'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

/**
 * Comment GraphQL Type
 */
const CommentType = builder.objectRef<{
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}>('Comment');

builder.objectType(CommentType, {
  description: 'A comment on a post',
  fields: (t) => ({
    id: t.exposeString('id'),
    content: t.exposeString('content'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    author: t.field({
      type: UserType,
      resolve: async (comment) => {
        const user = await prisma.user.findUnique({
          where: { id: comment.authorId },
        });
        if (!user) throw new Error('Author not found');
        return user;
      },
    }),
    post: t.field({
      type: PostType,
      resolve: async (comment) => {
        const post = await prisma.post.findUnique({
          where: { id: comment.postId },
        });
        if (!post) throw new Error('Post not found');
        return post;
      },
    }),
    parent: t.field({
      type: CommentType,
      nullable: true,
      resolve: async (comment) => {
        if (!comment.parentId) return null;
        return await prisma.comment.findUnique({
          where: { id: comment.parentId },
        });
      },
    }),
    children: t.field({
      type: [CommentType],
      resolve: async (comment) => {
        return await prisma.comment.findMany({
          where: { parentId: comment.id },
          orderBy: { createdAt: 'asc' },
        });
      },
    }),
  }),
});

/**
 * Post GraphQL Type
 */
const PostType = builder.objectRef<{
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  tags: string | null;
  authorId: string;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}>('Post');

builder.objectType(PostType, {
  description: 'A blog post or article',
  fields: (t) => ({
    id: t.exposeString('id'),
    title: t.exposeString('title'),
    content: t.exposeString('content'),
    excerpt: t.exposeString('excerpt', { nullable: true }),
    published: t.exposeBoolean('published'),
    tags: t.exposeString('tags', { nullable: true }),
    views: t.exposeInt('views'),
    likes: t.exposeInt('likes'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    author: t.field({
      type: UserType,
      resolve: async (post) => {
        const user = await prisma.user.findUnique({
          where: { id: post.authorId },
        });
        if (!user) throw new Error('Author not found');
        return user;
      },
    }),
    comments: t.field({
      type: [CommentType],
      resolve: async (post) => {
        return await prisma.comment.findMany({
          where: { postId: post.id, parentId: null },
          orderBy: { createdAt: 'desc' },
        });
      },
    }),
    commentCount: t.int({
      resolve: async (post) => {
        return await prisma.comment.count({
          where: { postId: post.id },
        });
      },
    }),
  }),
});

/**
 * User GraphQL Type
 */
const UserType = builder.objectRef<{
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  createdAt: Date;
  updatedAt: Date;
}>('User');

builder.objectType(UserType, {
  description: 'A registered user',
  fields: (t) => ({
    id: t.exposeString('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    avatar: t.exposeString('avatar', { nullable: true }),
    bio: t.exposeString('bio', { nullable: true }),
    location: t.exposeString('location', { nullable: true }),
    website: t.exposeString('website', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    settings: t.field({
      type: UserSettingsType,
      nullable: true,
      resolve: async (user) => {
        return await prisma.userSettings.findUnique({
          where: { userId: user.id },
        });
      },
    }),
    posts: t.field({
      type: [PostType],
      args: {
        limit: t.arg.int({ defaultValue: 10 }),
        published: t.arg.boolean(),
      },
      resolve: async (user, args) => {
        return await prisma.post.findMany({
          where: {
            authorId: user.id,
            ...(args.published !== null && args.published !== undefined
              ? { published: args.published }
              : {}),
          },
          take: args.limit ?? 10,
          orderBy: { createdAt: 'desc' },
        });
      },
    }),
    comments: t.field({
      type: [CommentType],
      args: {
        limit: t.arg.int({ defaultValue: 10 }),
      },
      resolve: async (user, args) => {
        return await prisma.comment.findMany({
          where: { authorId: user.id },
          take: args.limit ?? 10,
          orderBy: { createdAt: 'desc' },
        });
      },
    }),
    postCount: t.int({
      resolve: async (user) => {
        return await prisma.post.count({
          where: { authorId: user.id },
        });
      },
    }),
    commentCount: t.int({
      resolve: async (user) => {
        return await prisma.comment.count({
          where: { authorId: user.id },
        });
      },
    }),
  }),
});

/**
 * UserStats GraphQL Type - Aggregate statistics
 */
const UserStatsType = builder.objectRef<{
  totalUsers: number;
  newUsersThisWeek: number;
  usersWithPosts: number;
  usersWithoutPosts: number;
}>('UserStats');

builder.objectType(UserStatsType, {
  description: 'Aggregate user statistics',
  fields: (t) => ({
    totalUsers: t.exposeInt('totalUsers'),
    newUsersThisWeek: t.exposeInt('newUsersThisWeek'),
    usersWithPosts: t.exposeInt('usersWithPosts'),
    usersWithoutPosts: t.exposeInt('usersWithoutPosts'),
  }),
});

/**
 * PostStats GraphQL Type
 */
const PostStatsType = builder.objectRef<{
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
}>('PostStats');

builder.objectType(PostStatsType, {
  description: 'Aggregate post statistics',
  fields: (t) => ({
    totalPosts: t.exposeInt('totalPosts'),
    publishedPosts: t.exposeInt('publishedPosts'),
    draftPosts: t.exposeInt('draftPosts'),
    totalViews: t.exposeInt('totalViews'),
    totalLikes: t.exposeInt('totalLikes'),
  }),
});

// =============================================================================
// Queries - Read operations
// =============================================================================

builder.queryFields((t) => ({
  // User queries
  user: t.field({
    type: UserType,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.user.findUnique({
        where: { id: args.id },
      });
    },
  }),

  userByEmail: t.field({
    type: UserType,
    nullable: true,
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.user.findUnique({
        where: { email: args.email },
      });
    },
  }),

  users: t.field({
    type: [UserType],
    args: {
      skip: t.arg.int({ defaultValue: 0 }),
      take: t.arg.int({ defaultValue: 10 }),
      search: t.arg.string(),
    },
    resolve: async (_, args) => {
      const where = args.search
        ? {
            OR: [
              { name: { contains: args.search, mode: 'insensitive' as const } },
              { email: { contains: args.search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      return await prisma.user.findMany({
        where,
        skip: args.skip ?? 0,
        take: args.take ?? 10,
        orderBy: { createdAt: 'desc' },
      });
    },
  }),

  userStats: t.field({
    type: UserStatsType,
    resolve: async () => {
      const [totalUsers, newUsersThisWeek, usersWithPosts] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.user.count({
          where: {
            posts: { some: {} },
          },
        }),
      ]);

      return {
        totalUsers,
        newUsersThisWeek,
        usersWithPosts,
        usersWithoutPosts: totalUsers - usersWithPosts,
      };
    },
  }),

  // Post queries
  post: t.field({
    type: PostType,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.post.findUnique({
        where: { id: args.id },
      });
    },
  }),

  posts: t.field({
    type: [PostType],
    args: {
      skip: t.arg.int({ defaultValue: 0 }),
      take: t.arg.int({ defaultValue: 10 }),
      published: t.arg.boolean(),
      authorId: t.arg.string(),
      search: t.arg.string(),
    },
    resolve: async (_, args) => {
      const where: any = {};

      if (args.published !== null && args.published !== undefined) {
        where.published = args.published;
      }
      if (args.authorId) {
        where.authorId = args.authorId;
      }
      if (args.search) {
        where.OR = [
          { title: { contains: args.search, mode: 'insensitive' } },
          { content: { contains: args.search, mode: 'insensitive' } },
        ];
      }

      return await prisma.post.findMany({
        where,
        skip: args.skip ?? 0,
        take: args.take ?? 10,
        orderBy: { createdAt: 'desc' },
      });
    },
  }),

  postStats: t.field({
    type: PostStatsType,
    resolve: async () => {
      const [totalPosts, publishedPosts, viewsAndLikes] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { published: true } }),
        prisma.post.aggregate({
          _sum: { views: true, likes: true },
        }),
      ]);

      return {
        totalPosts,
        publishedPosts,
        draftPosts: totalPosts - publishedPosts,
        totalViews: viewsAndLikes._sum.views ?? 0,
        totalLikes: viewsAndLikes._sum.likes ?? 0,
      };
    },
  }),

  // Comment queries
  comment: t.field({
    type: CommentType,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.comment.findUnique({
        where: { id: args.id },
      });
    },
  }),

  comments: t.field({
    type: [CommentType],
    args: {
      postId: t.arg.string(),
      authorId: t.arg.string(),
      skip: t.arg.int({ defaultValue: 0 }),
      take: t.arg.int({ defaultValue: 10 }),
    },
    resolve: async (_, args) => {
      const where: any = {};

      if (args.postId) where.postId = args.postId;
      if (args.authorId) where.authorId = args.authorId;

      return await prisma.comment.findMany({
        where,
        skip: args.skip ?? 0,
        take: args.take ?? 10,
        orderBy: { createdAt: 'desc' },
      });
    },
  }),
}));

// =============================================================================
// Mutations - Write operations
// =============================================================================

// Input types for mutations
const CreateUserInput = builder.inputType('CreateUserInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    name: t.string(),
    avatar: t.string(),
    bio: t.string(),
    location: t.string(),
    website: t.string(),
  }),
});

const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    name: t.string(),
    avatar: t.string(),
    bio: t.string(),
    location: t.string(),
    website: t.string(),
  }),
});

const CreatePostInput = builder.inputType('CreatePostInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string({ required: true }),
    excerpt: t.string(),
    published: t.boolean({ defaultValue: false }),
    tags: t.string(),
    authorId: t.string({ required: true }),
  }),
});

const UpdatePostInput = builder.inputType('UpdatePostInput', {
  fields: (t) => ({
    title: t.string(),
    content: t.string(),
    excerpt: t.string(),
    published: t.boolean(),
    tags: t.string(),
  }),
});

const CreateCommentInput = builder.inputType('CreateCommentInput', {
  fields: (t) => ({
    content: t.string({ required: true }),
    authorId: t.string({ required: true }),
    postId: t.string({ required: true }),
    parentId: t.string(),
  }),
});

builder.mutationFields((t) => ({
  // User mutations
  createUser: t.field({
    type: UserType,
    args: {
      input: t.arg({ type: CreateUserInput, required: true }),
    },
    resolve: async (_, args) => {
      // Check if email already exists
      const existing = await prisma.user.findUnique({
        where: { email: args.input.email },
      });
      if (existing) {
        throw new Error('A user with this email already exists');
      }

      return await prisma.user.create({
        data: {
          email: args.input.email,
          name: args.input.name,
          avatar: args.input.avatar,
          bio: args.input.bio,
          location: args.input.location,
          website: args.input.website,
          settings: {
            create: {
              theme: 'auto',
              notifications: true,
              emailUpdates: false,
              publicProfile: true,
            },
          },
        },
      });
    },
  }),

  updateUser: t.field({
    type: UserType,
    args: {
      id: t.arg.string({ required: true }),
      input: t.arg({ type: UpdateUserInput, required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.user.update({
        where: { id: args.id },
        data: {
          name: args.input.name ?? undefined,
          avatar: args.input.avatar ?? undefined,
          bio: args.input.bio ?? undefined,
          location: args.input.location ?? undefined,
          website: args.input.website ?? undefined,
        },
      });
    },
  }),

  deleteUser: t.field({
    type: UserType,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.user.delete({
        where: { id: args.id },
      });
    },
  }),

  // Post mutations
  createPost: t.field({
    type: PostType,
    args: {
      input: t.arg({ type: CreatePostInput, required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.post.create({
        data: {
          title: args.input.title,
          content: args.input.content,
          excerpt: args.input.excerpt,
          published: args.input.published ?? false,
          tags: args.input.tags,
          authorId: args.input.authorId,
        },
      });
    },
  }),

  updatePost: t.field({
    type: PostType,
    args: {
      id: t.arg.string({ required: true }),
      input: t.arg({ type: UpdatePostInput, required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.post.update({
        where: { id: args.id },
        data: {
          title: args.input.title ?? undefined,
          content: args.input.content ?? undefined,
          excerpt: args.input.excerpt ?? undefined,
          published: args.input.published ?? undefined,
          tags: args.input.tags ?? undefined,
        },
      });
    },
  }),

  deletePost: t.field({
    type: PostType,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.post.delete({
        where: { id: args.id },
      });
    },
  }),

  likePost: t.field({
    type: PostType,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.post.update({
        where: { id: args.id },
        data: {
          likes: { increment: 1 },
        },
      });
    },
  }),

  // Comment mutations
  createComment: t.field({
    type: CommentType,
    args: {
      input: t.arg({ type: CreateCommentInput, required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.comment.create({
        data: {
          content: args.input.content,
          authorId: args.input.authorId,
          postId: args.input.postId,
          parentId: args.input.parentId,
        },
      });
    },
  }),

  deleteComment: t.field({
    type: CommentType,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      return await prisma.comment.delete({
        where: { id: args.id },
      });
    },
  }),
}));

// Build and export the schema
export const schema = builder.toSchema();

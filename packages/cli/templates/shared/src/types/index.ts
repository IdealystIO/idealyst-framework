import { z } from 'zod';

// User related schemas and types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatar: z.string().url().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  website: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, 'Name is required'),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

// Post related schemas and types
export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  published: z.boolean(),
  tags: z.array(z.string()),
  authorId: z.string(),
  views: z.number(),
  likes: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const UpdatePostSchema = CreatePostSchema.partial();

// Comment related schemas and types
export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  authorId: z.string(),
  postId: z.string(),
  parentId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  postId: z.string(),
  parentId: z.string().optional(),
});

// User settings schemas and types
export const UserSettingsSchema = z.object({
  id: z.string(),
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  emailUpdates: z.boolean(),
  publicProfile: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateUserSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  notifications: z.boolean().optional(),
  emailUpdates: z.boolean().optional(),
  publicProfile: z.boolean().optional(),
});

// Inferred TypeScript types
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;

export type Comment = z.infer<typeof CommentSchema>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;

export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type UpdateUserSettings = z.infer<typeof UpdateUserSettingsSchema>;

// Extended types with relations for UI components
export type UserWithPosts = User & {
  posts: Post[];
  settings?: UserSettings;
};

export type PostWithAuthor = Post & {
  author: User;
  comments: CommentWithAuthor[];
};

export type CommentWithAuthor = Comment & {
  author: User;
  children?: CommentWithAuthor[];
};

// API Response types
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}>;

// Common utility types
export type Theme = 'light' | 'dark' | 'auto';

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

/**
 * GraphQL Demo Screen
 *
 * Demonstrates how to use GraphQL with Apollo Client for complex queries
 * with relations. This screen shows posts with their authors and comments,
 * demonstrating GraphQL's strength in fetching nested data in a single query.
 */

import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '../graphql/client';
import {
  Screen,
  View,
  Text,
  Button,
  Input,
  Card,
  Chip,
  ActivityIndicator,
  Alert,
  Divider,
} from '@idealyst/components';

// =============================================================================
// GraphQL Queries & Mutations
// =============================================================================

const GET_POSTS = gql`
  query GetPosts($skip: Int, $take: Int, $published: Boolean, $search: String) {
    posts(skip: $skip, take: $take, published: $published, search: $search) {
      id
      title
      content
      excerpt
      published
      tags
      views
      likes
      createdAt
      author {
        id
        name
        email
        avatar
      }
      comments {
        id
        content
        createdAt
        author {
          id
          name
        }
      }
      commentCount
    }
    postStats {
      totalPosts
      publishedPosts
      draftPosts
      totalViews
      totalLikes
    }
  }
`;

const GET_USERS_WITH_POSTS = gql`
  query GetUsersWithPosts($skip: Int, $take: Int) {
    users(skip: $skip, take: $take) {
      id
      email
      name
      avatar
      bio
      postCount
      commentCount
      posts(limit: 3, published: true) {
        id
        title
        views
        likes
      }
    }
    userStats {
      totalUsers
      newUsersThisWeek
      usersWithPosts
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      published
      author {
        id
        name
      }
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($id: String!) {
    likePost(id: $id) {
      id
      likes
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      author {
        id
        name
      }
    }
  }
`;

// =============================================================================
// Types (inferred from GraphQL schema)
// =============================================================================

interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  postCount: number;
  commentCount: number;
  posts: Post[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  tags: string | null;
  views: number;
  likes: number;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
  comments: Comment[];
  commentCount: number;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
  };
}

interface PostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
}

interface UserStats {
  totalUsers: number;
  newUsersThisWeek: number;
  usersWithPosts: number;
}

// =============================================================================
// Component
// =============================================================================

export function GraphQLDemoScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', authorId: '' });
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // GraphQL Queries
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery<{ posts: Post[]; postStats: PostStats }>(GET_POSTS, {
    variables: {
      take: 10,
      search: searchQuery || undefined,
    },
  });

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<{ users: User[]; userStats: UserStats }>(GET_USERS_WITH_POSTS, {
    variables: { take: 10 },
    skip: activeTab !== 'users',
  });

  // GraphQL Mutations
  const [createPost, { loading: creatingPost }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      setShowCreatePost(false);
      setNewPost({ title: '', content: '', authorId: '' });
      refetchPosts();
    },
  });

  const [likePost] = useMutation(LIKE_POST);

  const [createComment, { loading: creatingComment }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setCommentingOn(null);
      setNewComment('');
      refetchPosts();
    },
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.authorId) return;
    createPost({
      variables: {
        input: {
          title: newPost.title,
          content: newPost.content,
          authorId: newPost.authorId,
          published: true,
        },
      },
    });
  };

  const handleLikePost = (postId: string) => {
    likePost({
      variables: { id: postId },
      optimisticResponse: {
        likePost: {
          __typename: 'Post',
          id: postId,
          likes: (postsData?.posts.find((p) => p.id === postId)?.likes ?? 0) + 1,
        },
      },
    });
  };

  const handleAddComment = (postId: string, authorId: string) => {
    if (!newComment) return;
    createComment({
      variables: {
        input: {
          content: newComment,
          postId,
          authorId,
        },
      },
    });
  };

  // Render Stats
  const renderStats = () => {
    if (activeTab === 'posts' && postsData?.postStats) {
      const stats = postsData.postStats;
      return (
        <View style={{ flexDirection: 'row', gap: 8 }} padding="md">
          <Card padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Text typography="h4" intent="primary">{stats.totalPosts}</Text>
            <Text typography="caption" color="secondary">Total Posts</Text>
          </Card>
          <Card padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Text typography="h4" intent="primary">{stats.publishedPosts}</Text>
            <Text typography="caption" color="secondary">Published</Text>
          </Card>
          <Card padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Text typography="h4" intent="primary">{stats.totalViews}</Text>
            <Text typography="caption" color="secondary">Total Views</Text>
          </Card>
          <Card padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Text typography="h4" intent="primary">{stats.totalLikes}</Text>
            <Text typography="caption" color="secondary">Total Likes</Text>
          </Card>
        </View>
      );
    }

    if (activeTab === 'users' && usersData?.userStats) {
      const stats = usersData.userStats;
      return (
        <View style={{ flexDirection: 'row', gap: 8 }} padding="md">
          <Card padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Text typography="h4" intent="primary">{stats.totalUsers}</Text>
            <Text typography="caption" color="secondary">Total Users</Text>
          </Card>
          <Card padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Text typography="h4" intent="primary">{stats.newUsersThisWeek}</Text>
            <Text typography="caption" color="secondary">New This Week</Text>
          </Card>
          <Card padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Text typography="h4" intent="primary">{stats.usersWithPosts}</Text>
            <Text typography="caption" color="secondary">With Posts</Text>
          </Card>
        </View>
      );
    }

    return null;
  };

  // Render Post Card
  const renderPostCard = (post: Post) => (
    <Card key={post.id} padding="md" gap="sm">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            background="primary"
            radius="full"
            style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {post.author.name?.[0]?.toUpperCase() || post.author.email[0].toUpperCase()}
            </Text>
          </View>
          <View>
            <Text weight="semibold">{post.author.name || 'Anonymous'}</Text>
            <Text typography="caption" color="secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {post.published ? (
          <Chip size="sm" intent="success">Published</Chip>
        ) : (
          <Chip size="sm" intent="warning">Draft</Chip>
        )}
      </View>

      <Text typography="h5" weight="bold">{post.title}</Text>
      <Text color="secondary" numberOfLines={3}>
        {post.excerpt || post.content}
      </Text>

      {post.tags && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
          {post.tags.split(',').map((tag, i) => (
            <Chip key={i} size="sm" type="outlined">
              {tag.trim()}
            </Chip>
          ))}
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button
          type="text"
          size="sm"
          onPress={() => handleLikePost(post.id)}
          leftIcon="heart"
        >
          {post.likes}
        </Button>
        <Button
          type="text"
          size="sm"
          leftIcon="eye"
        >
          {post.views}
        </Button>
        <Button
          type="text"
          size="sm"
          onPress={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
          leftIcon="comment"
        >
          {post.commentCount}
        </Button>
      </View>

      {/* Comments Section */}
      {post.comments.length > 0 && (
        <View gap="sm">
          <Divider />
          <Text weight="semibold">Recent Comments</Text>
          {post.comments.slice(0, 3).map((comment) => (
            <View
              key={comment.id}
              padding="sm"
              style={{ borderLeftWidth: 2, borderLeftColor: '#ccc' }}
            >
              <Text typography="caption" weight="semibold">{comment.author.name || 'Anonymous'}</Text>
              <Text typography="caption" color="secondary">{comment.content}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Add Comment Form */}
      {commentingOn === post.id && (
        <View gap="sm">
          <Divider />
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              type="text"
              size="sm"
              onPress={() => setCommentingOn(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onPress={() => handleAddComment(post.id, post.author.id)}
              disabled={creatingComment}
            >
              {creatingComment ? 'Posting...' : 'Comment'}
            </Button>
          </View>
        </View>
      )}
    </Card>
  );

  // Render User Card
  const renderUserCard = (user: User) => (
    <Card key={user.id} padding="md" gap="sm">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          background="primary"
          radius="full"
          style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text typography="h5" weight="bold">{user.name || 'Anonymous'}</Text>
          <Text typography="caption" color="secondary">{user.email}</Text>
        </View>
      </View>

      {user.bio && <Text color="secondary">{user.bio}</Text>}

      <View style={{ flexDirection: 'row', gap: 24 }}>
        <View style={{ alignItems: 'center' }}>
          <Text typography="h4" intent="primary">{user.postCount}</Text>
          <Text typography="caption" color="secondary">Posts</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text typography="h4" intent="primary">{user.commentCount}</Text>
          <Text typography="caption" color="secondary">Comments</Text>
        </View>
      </View>

      {user.posts.length > 0 && (
        <View gap="xs">
          <Text weight="semibold">Recent Posts</Text>
          {user.posts.map((post) => (
            <View
              key={post.id}
              padding="sm"
              style={{ borderLeftWidth: 2, borderLeftColor: '#6366f1' }}
            >
              <Text weight="medium">{post.title}</Text>
              <Text typography="caption" color="secondary">
                {post.views} views · {post.likes} likes
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );

  const loading = activeTab === 'posts' ? postsLoading : usersLoading;
  const error = activeTab === 'posts' ? postsError : usersError;

  return (
    <Screen background="primary" padding="lg" scrollable>
      <View gap="lg">
        {/* Header */}
        <View gap="sm">
          <Text typography="h3">GraphQL Demo</Text>
          <Text color="secondary">
            Demonstrates complex queries with nested relations using Apollo Client
          </Text>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button
            type={activeTab === 'posts' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('posts')}
            leftIcon="file-document"
          >
            Posts
          </Button>
          <Button
            type={activeTab === 'users' ? 'contained' : 'outlined'}
            onPress={() => setActiveTab('users')}
            leftIcon="account-group"
          >
            Users
          </Button>
        </View>

        {/* Stats */}
        {renderStats()}

        {/* Search (Posts only) */}
        {activeTab === 'posts' && (
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftIcon="magnify"
              />
            </View>
            <Button
              onPress={() => setShowCreatePost(!showCreatePost)}
              leftIcon="plus"
            >
              New Post
            </Button>
          </View>
        )}

        {/* Create Post Form */}
        {showCreatePost && (
          <Card padding="md" gap="md">
            <Text typography="h5" weight="bold">Create New Post</Text>
            <Input
              label="Title"
              placeholder="Enter post title"
              value={newPost.title}
              onChangeText={(title) => setNewPost({ ...newPost, title })}
            />
            <Input
              label="Content"
              placeholder="Write your post content..."
              value={newPost.content}
              onChangeText={(content) => setNewPost({ ...newPost, content })}
            />
            <Input
              label="Author ID"
              placeholder="Enter author user ID"
              value={newPost.authorId}
              onChangeText={(authorId) => setNewPost({ ...newPost, authorId })}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Button type="outlined" onPress={() => setShowCreatePost(false)}>
                Cancel
              </Button>
              <Button onPress={handleCreatePost} disabled={creatingPost}>
                {creatingPost ? 'Creating...' : 'Create Post'}
              </Button>
            </View>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert intent="danger" title="Error">
            {error.message}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Card padding="lg">
            <View style={{ alignItems: 'center', gap: 12 }}>
              <ActivityIndicator size="lg" />
              <Text color="secondary">Loading {activeTab}...</Text>
            </View>
          </Card>
        )}

        {/* Content */}
        {!loading && !error && (
          <View gap="md">
            {activeTab === 'posts' && (
              <>
                {postsData?.posts.length === 0 ? (
                  <Card padding="lg">
                    <View style={{ alignItems: 'center', gap: 8 }}>
                      <Text typography="h5" weight="bold">No posts found</Text>
                      <Text color="secondary">Create your first post to get started</Text>
                    </View>
                  </Card>
                ) : (
                  postsData?.posts.map(renderPostCard)
                )}
              </>
            )}

            {activeTab === 'users' && (
              <>
                {usersData?.users.length === 0 ? (
                  <Card padding="lg">
                    <View style={{ alignItems: 'center' }}>
                      <Text typography="h5" weight="bold">No users found</Text>
                    </View>
                  </Card>
                ) : (
                  usersData?.users.map(renderUserCard)
                )}
              </>
            )}
          </View>
        )}

        {/* GraphQL Benefits Note */}
        <Card type="elevated" padding="md" gap="sm">
          <Text weight="semibold">Why GraphQL?</Text>
          <Text color="secondary">
            This screen fetches posts with their authors and comments in a single request.
            With REST, this would require multiple API calls. GraphQL's nested query
            capability makes it perfect for complex, relational data.
          </Text>
          <View background="secondary" padding="sm" radius="sm">
            <Text typography="caption" style={{ fontFamily: 'monospace' }}>
              {`query {
  posts {
    title
    author { name, email }
    comments { content, author { name } }
  }
}`}
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

export default GraphQLDemoScreen;

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
  View,
  Text,
  Button,
  Input,
  Card,
  Chip,
  ScrollView,
  ActivityIndicator,
  Alert,
  Divider,
} from '@idealyst/components';
import { defineStyle } from '@idealyst/theme';

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
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalPosts}</Text>
            <Text style={styles.statLabel}>Total Posts</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.publishedPosts}</Text>
            <Text style={styles.statLabel}>Published</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalViews}</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalLikes}</Text>
            <Text style={styles.statLabel}>Total Likes</Text>
          </Card>
        </View>
      );
    }

    if (activeTab === 'users' && usersData?.userStats) {
      const stats = usersData.userStats;
      return (
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.newUsersThisWeek}</Text>
            <Text style={styles.statLabel}>New This Week</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.usersWithPosts}</Text>
            <Text style={styles.statLabel}>With Posts</Text>
          </Card>
        </View>
      );
    }

    return null;
  };

  // Render Post Card
  const renderPostCard = (post: Post) => (
    <Card key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {post.author.name?.[0]?.toUpperCase() || post.author.email[0].toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>{post.author.name || 'Anonymous'}</Text>
            <Text style={styles.postDate}>
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

      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {post.excerpt || post.content}
      </Text>

      {post.tags && (
        <View style={styles.tagsContainer}>
          {post.tags.split(',').map((tag, i) => (
            <Chip key={i} size="sm" variant="outline">
              {tag.trim()}
            </Chip>
          ))}
        </View>
      )}

      <View style={styles.postActions}>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => handleLikePost(post.id)}
          leftIcon="mdi:heart"
        >
          {post.likes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          leftIcon="mdi:eye"
        >
          {post.views}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
          leftIcon="mdi:comment"
        >
          {post.commentCount}
        </Button>
      </View>

      {/* Comments Section */}
      {post.comments.length > 0 && (
        <View style={styles.commentsSection}>
          <Divider />
          <Text style={styles.commentsTitle}>Recent Comments</Text>
          {post.comments.slice(0, 3).map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentAuthor}>{comment.author.name || 'Anonymous'}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Add Comment Form */}
      {commentingOn === post.id && (
        <View style={styles.addCommentForm}>
          <Divider />
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <View style={styles.commentActions}>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setCommentingOn(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onPress={() => handleAddComment(post.id, post.author.id)}
              loading={creatingComment}
            >
              Comment
            </Button>
          </View>
        </View>
      )}
    </Card>
  );

  // Render User Card
  const renderUserCard = (user: User) => (
    <Card key={user.id} style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name || 'Anonymous'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}

      <View style={styles.userStats}>
        <View style={styles.userStat}>
          <Text style={styles.userStatValue}>{user.postCount}</Text>
          <Text style={styles.userStatLabel}>Posts</Text>
        </View>
        <View style={styles.userStat}>
          <Text style={styles.userStatValue}>{user.commentCount}</Text>
          <Text style={styles.userStatLabel}>Comments</Text>
        </View>
      </View>

      {user.posts.length > 0 && (
        <View style={styles.recentPosts}>
          <Text style={styles.recentPostsTitle}>Recent Posts</Text>
          {user.posts.map((post) => (
            <View key={post.id} style={styles.recentPost}>
              <Text style={styles.recentPostTitle}>{post.title}</Text>
              <Text style={styles.recentPostMeta}>
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>GraphQL Demo</Text>
        <Text style={styles.subtitle}>
          Demonstrates complex queries with nested relations using Apollo Client
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Button
          variant={activeTab === 'posts' ? 'filled' : 'outline'}
          onPress={() => setActiveTab('posts')}
          leftIcon="mdi:post"
        >
          Posts
        </Button>
        <Button
          variant={activeTab === 'users' ? 'filled' : 'outline'}
          onPress={() => setActiveTab('users')}
          leftIcon="mdi:account-group"
        >
          Users
        </Button>
      </View>

      {/* Stats */}
      {renderStats()}

      {/* Search (Posts only) */}
      {activeTab === 'posts' && (
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="mdi:magnify"
          />
          <Button
            onPress={() => setShowCreatePost(!showCreatePost)}
            leftIcon="mdi:plus"
          >
            New Post
          </Button>
        </View>
      )}

      {/* Create Post Form */}
      {showCreatePost && (
        <Card style={styles.createPostForm}>
          <Text style={styles.formTitle}>Create New Post</Text>
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
            multiline
            numberOfLines={4}
          />
          <Input
            label="Author ID"
            placeholder="Enter author user ID"
            value={newPost.authorId}
            onChangeText={(authorId) => setNewPost({ ...newPost, authorId })}
          />
          <View style={styles.formActions}>
            <Button variant="outline" onPress={() => setShowCreatePost(false)}>
              Cancel
            </Button>
            <Button onPress={handleCreatePost} loading={creatingPost}>
              Create Post
            </Button>
          </View>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert intent="danger" style={styles.alert}>
          <Text>{error.message}</Text>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="lg" />
          <Text>Loading {activeTab}...</Text>
        </View>
      )}

      {/* Content */}
      {!loading && !error && (
        <View style={styles.content}>
          {activeTab === 'posts' && (
            <>
              {postsData?.posts.length === 0 ? (
                <Card style={styles.emptyState}>
                  <Text style={styles.emptyText}>No posts found</Text>
                  <Text style={styles.emptySubtext}>
                    Create your first post to get started
                  </Text>
                </Card>
              ) : (
                postsData?.posts.map(renderPostCard)
              )}
            </>
          )}

          {activeTab === 'users' && (
            <>
              {usersData?.users.length === 0 ? (
                <Card style={styles.emptyState}>
                  <Text style={styles.emptyText}>No users found</Text>
                </Card>
              ) : (
                usersData?.users.map(renderUserCard)
              )}
            </>
          )}
        </View>
      )}

      {/* GraphQL Benefits Note */}
      <Card style={styles.noteCard}>
        <Text style={styles.noteTitle}>Why GraphQL?</Text>
        <Text style={styles.noteText}>
          This screen fetches posts with their authors and comments in a single request.
          With REST, this would require multiple API calls. GraphQL's nested query
          capability makes it perfect for complex, relational data.
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
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
    </ScrollView>
  );
}

// =============================================================================
// Styles
// =============================================================================

const styles = defineStyle((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.primaryText,
    opacity: 0.8,
  },
  tabs: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  alert: {
    margin: theme.spacing.md,
  },
  // Post styles
  postCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.colors.primaryText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorName: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  postDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  postContent: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  postActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  commentsSection: {
    marginTop: theme.spacing.md,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  comment: {
    paddingVertical: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.border,
    marginBottom: theme.spacing.xs,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  commentContent: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  addCommentForm: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  // User styles
  userCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  userBio: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  userStats: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  userStat: {
    alignItems: 'center',
  },
  userStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  userStatLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  recentPosts: {
    marginTop: theme.spacing.sm,
  },
  recentPostsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  recentPost: {
    paddingVertical: theme.spacing.xs,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.primary,
    paddingLeft: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  recentPostTitle: {
    fontWeight: '500',
    color: theme.colors.text,
  },
  recentPostMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  // Form styles
  createPostForm: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  // Empty state
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  emptySubtext: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  // Note card
  noteCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  noteText: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  codeBlock: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: theme.colors.text,
  },
}));

export default GraphQLDemoScreen;

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { trpc } from './utils/trpc';
import { Screen, Text, View, Button, ScrollView } from '@idealyst/components';

// Import shared components and utilities
import {
  UserCard,
  PostCard,
  LoadingSpinner,
  ErrorMessage,
  FeatureCard,
  DEMO_USERS,
  DEMO_POSTS,
  formatRelativeTime,
  type User,
  type Post,
  type PostWithAuthor
} from '{{workspaceScope}}/shared';

// Create tRPC client
const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc', // Updated to match API port
      // Optional: Add headers for authentication
      // headers() {
      //   return {
      //     authorization: getAuthToken(),
      //   };
      // },
    }),
  ],
});

// Navigation Component
function Navigation() {
  return (
    <View style={{ 
      flexDirection: 'row', 
      padding: 16, 
      backgroundColor: '#f8f9fa',
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef'
    }}>
      <Text variant="h2" style={{ marginRight: 24 }}>{{projectName}}</Text>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Text style={{ color: '#007bff' }}>Home</Text>
        </Link>
        <Link to="/users" style={{ textDecoration: 'none' }}>
          <Text style={{ color: '#007bff' }}>Users</Text>
        </Link>
        <Link to="/posts" style={{ textDecoration: 'none' }}>
          <Text style={{ color: '#007bff' }}>Posts</Text>
        </Link>
      </View>
    </View>
  );
}

// Home Page Component
function HomePage() {
  // Example tRPC usage
  const { data: helloData, isLoading: helloLoading, error: helloError } = trpc.hello.useQuery({ name: 'Web User' });
  const { data: usersData, isLoading: usersLoading } = trpc.users.getAll.useQuery();
  const { data: postsData, isLoading: postsLoading } = trpc.posts.getAll.useQuery();

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        {/* Welcome Section */}
        <View style={{ marginBottom: 32, textAlign: 'center' }}>
          <Text variant="h1" style={{ marginBottom: 16 }}>
            Welcome to {{projectName}}! 🚀
          </Text>
          <Text variant="body" style={{ marginBottom: 16, fontSize: 18 }}>
            A full-stack application built with the Idealyst Framework
          </Text>
          
          {/* tRPC Connection Test */}
          <View style={{ 
            padding: 16, 
            backgroundColor: '#e3f2fd', 
            borderRadius: 8,
            marginBottom: 24
          }}>
            <Text variant="h3" style={{ marginBottom: 8 }}>🔗 API Connection:</Text>
            {helloLoading && <Text>Testing connection...</Text>}
            {helloError && <Text style={{ color: 'red' }}>Error: {helloError.message}</Text>}
            {helloData && <Text style={{ color: 'green' }}>✅ {helloData.greeting}</Text>}
          </View>
        </View>

        {/* Features Overview */}
        <View style={{ marginBottom: 32 }}>
          <Text variant="h2" style={{ marginBottom: 16 }}>🏗️ Architecture Overview</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            <FeatureCard 
              icon="🗄️"
              title="Database Layer"
              description="Prisma ORM with SQLite, user management, posts, and comments"
            />
            <FeatureCard 
              icon="🚀"
              title="API Server"
              description="tRPC API with type-safe endpoints and real-time capabilities"
            />
            <FeatureCard 
              icon="🌐"
              title="Web Application"
              description="React web app with Idealyst components and responsive design"
            />
            <FeatureCard 
              icon="📱"
              title="Mobile App"
              description="React Native app with shared components and unified styling"
            />
            <FeatureCard 
              icon="📦"
              title="Shared Library"
              description="Cross-platform components, utilities, and type definitions"
            />
            <FeatureCard 
              icon="🔗"
              title="Full Integration"
              description="End-to-end type safety and unified development workflow"
            />
          </View>
        </View>

        {/* Live Data Preview */}
        <View style={{ marginBottom: 32 }}>
          <Text variant="h2" style={{ marginBottom: 16 }}>📊 Live Data Preview</Text>
          
          {/* Users Section */}
          <View style={{ marginBottom: 24 }}>
            <Text variant="h3" style={{ marginBottom: 12 }}>👥 Users ({usersLoading ? '...' : usersData?.length || DEMO_USERS.length})</Text>
            {usersLoading ? (
              <LoadingSpinner message="Loading users..." />
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {(usersData || DEMO_USERS.slice(0, 3)).map((user: User) => (
                  <View key={user.id} style={{ width: '300px' }}>
                    <UserCard 
                      user={user} 
                      showBio={false}
                      onPress={() => console.log('View profile:', user.name)}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Posts Section */}
          <View style={{ marginBottom: 24 }}>
            <Text variant="h3" style={{ marginBottom: 12 }}>📝 Recent Posts ({postsLoading ? '...' : postsData?.length || DEMO_POSTS.length})</Text>
            {postsLoading ? (
              <LoadingSpinner message="Loading posts..." />
            ) : (
              <View>
                {(postsData || DEMO_POSTS.slice(0, 2)).map((post: Post) => {
                  const author = DEMO_USERS.find(u => u.id === post.authorId);
                  return (
                    <PostCard 
                      key={post.id}
                      post={post}
                      author={author}
                      onPress={() => console.log('Read post:', post.title)}
                      onLike={() => console.log('Like post:', post.title)}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Quick Start Section */}
        <View style={{ 
          padding: 20, 
          backgroundColor: '#f8f9fa', 
          borderRadius: 8,
          marginBottom: 24
        }}>
          <Text variant="h2" style={{ marginBottom: 16 }}>🚀 Quick Start</Text>
          <Text variant="body" style={{ marginBottom: 12 }}>
            Your full-stack workspace is ready! Here's what you can do:
          </Text>
          <View style={{ marginLeft: 16 }}>
            <Text style={{ marginBottom: 4 }}>• 🗄️ Add your models in <code>packages/database/schema.prisma</code></Text>
            <Text style={{ marginBottom: 4 }}>• 🚀 Create API endpoints in <code>packages/api/src/routers/</code></Text>
            <Text style={{ marginBottom: 4 }}>• 📦 Build shared components in <code>packages/shared/src/</code></Text>
            <Text style={{ marginBottom: 4 }}>• 🌐 Customize this web app in <code>packages/web/src/</code></Text>
            <Text style={{ marginBottom: 4 }}>• 📱 Update the mobile app in <code>packages/mobile/src/</code></Text>
          </View>
        </View>

        {/* Development Commands */}
        <View style={{ 
          padding: 20, 
          backgroundColor: '#e8f5e8', 
          borderRadius: 8,
          marginBottom: 24
        }}>
          <Text variant="h3" style={{ marginBottom: 12 }}>💻 Development Commands</Text>
          <View style={{ fontFamily: 'monospace', fontSize: 14 }}>
            <Text style={{ marginBottom: 4 }}>yarn dev          # Start all servers</Text>
            <Text style={{ marginBottom: 4 }}>yarn web:dev      # Start web app only</Text>
            <Text style={{ marginBottom: 4 }}>yarn mobile:start # Start mobile bundler</Text>
            <Text style={{ marginBottom: 4 }}>yarn api:dev      # Start API server only</Text>
            <Text style={{ marginBottom: 4 }}>yarn db:push      # Update database schema</Text>
            <Text style={{ marginBottom: 4 }}>yarn db:studio    # Open database admin</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Users Page Component  
function UsersPage() {
  const { data: users, isLoading, error } = trpc.users.getAll.useQuery();

  if (isLoading) return <LoadingSpinner message="Loading users..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const allUsers = users || DEMO_USERS;

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text variant="h1" style={{ marginBottom: 20 }}>👥 Users ({allUsers.length})</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {allUsers.map((user: User) => (
          <View key={user.id} style={{ width: '400px' }}>
            <UserCard 
              user={user} 
              showBio={true}
              onPress={() => console.log('View profile:', user.name)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// Posts Page Component
function PostsPage() {
  const { data: posts, isLoading, error } = trpc.posts.getAll.useQuery();

  if (isLoading) return <LoadingSpinner message="Loading posts..." />;
  if (error) return <ErrorMessage message={error.message} />;

  const allPosts = posts || DEMO_POSTS;

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text variant="h1" style={{ marginBottom: 20 }}>📝 Posts ({allPosts.length})</Text>
      <View>
        {allPosts.map((post: Post) => {
          const author = DEMO_USERS.find(u => u.id === post.authorId);
          return (
            <PostCard 
              key={post.id}
              post={post}
              author={author}
              showFullContent={false}
              onPress={() => console.log('Read post:', post.title)}
              onLike={() => console.log('Like post:', post.title)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

// Main App Component
function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Screen>
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/posts" element={<PostsPage />} />
            </Routes>
          </Screen>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { Screen, Text, View, Button, ScrollView } from '@idealyst/components';
import { trpc } from './utils/trpc';

// Import shared components and utilities
import {
  UserCard,
  PostCard,
  LoadingSpinner,
  ErrorMessage,
  FeatureCard,
  TabButton,
  DEMO_USERS,
  DEMO_POSTS,
  formatRelativeTime,
  type User,
  type Post
} from '{{workspaceScope}}/shared';

// Create tRPC client
const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc', // Update this to your API URL
      // For device testing, you might need: 'http://192.168.1.xxx:3001/trpc'
      // Optional: Add headers for authentication
      // headers() {
      //   return {
      //     authorization: getAuthToken(),
      //   };
      // },
    }),
  ],
});

function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'users' | 'posts'>('home');
  
  // Example tRPC usage
  const { data: helloData, isLoading: helloLoading, error: helloError } = trpc.hello.useQuery({ name: 'Mobile User' });
  const { data: usersData, isLoading: usersLoading } = trpc.users.getAll.useQuery();
  const { data: postsData, isLoading: postsLoading } = trpc.posts.getAll.useQuery();

  const renderHome = () => (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        {/* Welcome Section */}
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <Text variant="h1" style={{ textAlign: 'center', marginBottom: 16 }}>
            Welcome to {{appName}}! 📱
          </Text>
          <Text variant="body" style={{ textAlign: 'center', marginBottom: 16, fontSize: 18 }}>
            A cross-platform mobile app built with React Native and the Idealyst Framework
          </Text>
          
          {/* tRPC Connection Test */}
          <View style={{ 
            padding: 16, 
            backgroundColor: '#e3f2fd', 
            borderRadius: 8,
            marginBottom: 24,
            width: '100%'
          }}>
            <Text variant="h3" style={{ marginBottom: 8, textAlign: 'center' }}>🔗 API Connection</Text>
            {helloLoading && <Text style={{ textAlign: 'center' }}>Testing connection...</Text>}
            {helloError && <Text style={{ color: 'red', textAlign: 'center' }}>Error: {helloError.message}</Text>}
            {helloData && <Text style={{ color: 'green', textAlign: 'center' }}>✅ {helloData.greeting}</Text>}
          </View>
        </View>

        {/* Features Overview */}
        <View style={{ marginBottom: 32 }}>
          <Text variant="h2" style={{ marginBottom: 16, textAlign: 'center' }}>🏗️ What's Included</Text>
          <FeatureCard 
            icon="🔗"
            title="Full Integration"
            description="Connected to your database and API with end-to-end type safety"
          />
          <FeatureCard 
            icon="📦"
            title="Shared Components"
            description="Cross-platform UI components that work on web and mobile"
          />
          <FeatureCard 
            icon="🎨"
            title="Idealyst Design"
            description="Beautiful, consistent styling with the Idealyst component library"
          />
          <FeatureCard 
            icon="⚡"
            title="Real-time Updates"
            description="tRPC provides instant synchronization with your backend"
          />
        </View>

        {/* Quick Data Preview */}
        <View style={{ marginBottom: 32 }}>
          <Text variant="h2" style={{ marginBottom: 16, textAlign: 'center' }}>📊 Live Data</Text>
          
          {/* Users Preview */}
          <View style={{ marginBottom: 20 }}>
            <Text variant="h3" style={{ marginBottom: 12 }}>👥 Users ({usersLoading ? '...' : usersData?.length || DEMO_USERS.length})</Text>
            {usersLoading ? (
              <LoadingSpinner message="Loading users..." />
            ) : (
              <View>
                {(usersData || DEMO_USERS.slice(0, 2)).map((user: User) => (
                  <UserCard 
                    key={user.id}
                    user={user} 
                    showBio={false}
                    onPress={() => console.log('View profile:', user.name)}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Posts Preview */}
          <View style={{ marginBottom: 20 }}>
            <Text variant="h3" style={{ marginBottom: 12 }}>📝 Recent Posts ({postsLoading ? '...' : postsData?.length || DEMO_POSTS.length})</Text>
            {postsLoading ? (
              <LoadingSpinner message="Loading posts..." />
            ) : (
              <View>
                {(postsData || DEMO_POSTS.slice(0, 1)).map((post: Post) => {
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

        {/* Development Info */}
        <View style={{ 
          padding: 20, 
          backgroundColor: '#f8f9fa', 
          borderRadius: 8,
          marginBottom: 24
        }}>
          <Text variant="h3" style={{ marginBottom: 12, textAlign: 'center' }}>🚀 Development</Text>
          <Text variant="body" style={{ textAlign: 'center', marginBottom: 12 }}>
            This app is part of your full-stack workspace. Make changes to see them reflected instantly!
          </Text>
          <Text variant="caption" style={{ textAlign: 'center', fontStyle: 'italic' }}>
            Edit packages/mobile/src/App.tsx to customize this screen
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderUsers = () => {
    const { data: users, isLoading, error } = trpc.users.getAll.useQuery();

    if (isLoading) return <LoadingSpinner message="Loading users..." />;
    if (error) return <ErrorMessage message={error.message} />;

    const allUsers = users || DEMO_USERS;

    return (
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text variant="h1" style={{ marginBottom: 20, textAlign: 'center' }}>👥 All Users ({allUsers.length})</Text>
        <View>
          {allUsers.map((user: User) => (
            <UserCard 
              key={user.id}
              user={user} 
              showBio={true}
              onPress={() => console.log('View profile:', user.name)}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderPosts = () => {
    const { data: posts, isLoading, error } = trpc.posts.getAll.useQuery();

    if (isLoading) return <LoadingSpinner message="Loading posts..." />;
    if (error) return <ErrorMessage message={error.message} />;

    const allPosts = posts || DEMO_POSTS;

    return (
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text variant="h1" style={{ marginBottom: 20, textAlign: 'center' }}>📝 All Posts ({allPosts.length})</Text>
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
  };

  const renderTabBar = () => (
    <View style={{ 
      flexDirection: 'row', 
      backgroundColor: '#f8f9fa',
      borderTopWidth: 1,
      borderTopColor: '#e9ecef',
      paddingVertical: 10
    }}>
      <TabButton
        title="Home"
        icon="🏠"
        active={currentTab === 'home'}
        onPress={() => setCurrentTab('home')}
      />
      <TabButton
        title="Users"
        icon="👥"
        active={currentTab === 'users'}
        onPress={() => setCurrentTab('users')}
      />
      <TabButton
        title="Posts"
        icon="📝"
        active={currentTab === 'posts'}
        onPress={() => setCurrentTab('posts')}
      />
    </View>
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Screen>
          <View style={{ flex: 1 }}>
            {currentTab === 'home' && renderHome()}
            {currentTab === 'users' && renderUsers()}
            {currentTab === 'posts' && renderPosts()}
            {renderTabBar()}
          </View>
        </Screen>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;

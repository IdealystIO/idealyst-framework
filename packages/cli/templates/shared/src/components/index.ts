import React from 'react';
import { View, Text, Button, Image } from '@idealyst/components';
import type { User, Post, Comment } from '../types';

interface UserCardProps {
  user: User;
  onPress?: () => void;
  showBio?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onPress, 
  showBio = false 
}) => {
  return (
    <View 
      style={{ 
        padding: 16, 
        borderRadius: 8, 
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 8
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {user.avatar && (
          <Image
            source={{ uri: user.avatar }}
            style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 25, 
              marginRight: 12 
            }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text variant="h3" style={{ marginBottom: 4 }}>
            {user.name || 'Anonymous User'}
          </Text>
          <Text variant="caption" style={{ color: 'gray' }}>
            {user.email}
          </Text>
          {user.location && (
            <Text variant="caption" style={{ color: 'gray', marginTop: 2 }}>
              📍 {user.location}
            </Text>
          )}
        </View>
        {onPress && (
          <Button 
            title="View Profile" 
            onPress={onPress}
            size="small"
          />
        )}
      </View>
      
      {showBio && user.bio && (
        <Text variant="body" style={{ marginTop: 12, fontStyle: 'italic' }}>
          {user.bio}
        </Text>
      )}
      
      {user.website && (
        <Text variant="caption" style={{ marginTop: 8, color: 'blue' }}>
          🌐 {user.website}
        </Text>
      )}
    </View>
  );
};

interface PostCardProps {
  post: Post;
  author?: User;
  onPress?: () => void;
  onLike?: () => void;
  showFullContent?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  author,
  onPress,
  onLike,
  showFullContent = false 
}) => {
  const content = showFullContent ? post.content : (post.excerpt || post.content.substring(0, 150) + '...');
  
  return (
    <View 
      style={{ 
        padding: 16, 
        borderRadius: 8, 
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 12
      }}
    >
      {/* Post Header */}
      {author && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          {author.avatar && (
            <Image
              source={{ uri: author.avatar }}
              style={{ 
                width: 32, 
                height: 32, 
                borderRadius: 16, 
                marginRight: 8 
              }}
            />
          )}
          <View>
            <Text variant="body" style={{ fontWeight: 'bold' }}>
              {author.name || 'Anonymous'}
            </Text>
            <Text variant="caption" style={{ color: 'gray' }}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}
      
      {/* Post Content */}
      <Text variant="h2" style={{ marginBottom: 8 }}>
        {post.title}
      </Text>
      
      <Text variant="body" style={{ marginBottom: 12 }}>
        {content}
      </Text>
      
      {/* Tags */}
      {post.tags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
          {post.tags.map((tag, index) => (
            <View 
              key={index}
              style={{ 
                backgroundColor: '#e3f2fd',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginRight: 6,
                marginBottom: 4
              }}
            >
              <Text variant="caption" style={{ color: '#1976d2' }}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Post Stats and Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text variant="caption" style={{ color: 'gray', marginRight: 12 }}>
            👁️ {post.views} views
          </Text>
          <Text variant="caption" style={{ color: 'gray' }}>
            ❤️ {post.likes} likes
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row' }}>
          {onLike && (
            <Button 
              title="Like" 
              onPress={onLike}
              size="small"
              variant="outline"
              style={{ marginRight: 8 }}
            />
          )}
          {onPress && (
            <Button 
              title="Read More" 
              onPress={onPress}
              size="small"
            />
          )}
        </View>
      </View>
    </View>
  );
};

interface CommentCardProps {
  comment: Comment;
  author?: User;
  onReply?: () => void;
  level?: number;
}

export const CommentCard: React.FC<CommentCardProps> = ({ 
  comment, 
  author,
  onReply,
  level = 0 
}) => {
  const indentStyle = { 
    marginLeft: level * 20,
    maxWidth: level > 2 ? '90%' : '100%'
  };
  
  return (
    <View 
      style={[
        { 
          padding: 12, 
          borderRadius: 6, 
          backgroundColor: level === 0 ? 'white' : '#f8f9fa',
          borderLeftWidth: level > 0 ? 3 : 0,
          borderLeftColor: '#e3f2fd',
          marginBottom: 8
        },
        indentStyle
      ]}
    >
      {/* Comment Header */}
      {author && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          {author.avatar && (
            <Image
              source={{ uri: author.avatar }}
              style={{ 
                width: 24, 
                height: 24, 
                borderRadius: 12, 
                marginRight: 6 
              }}
            />
          )}
          <Text variant="body" style={{ fontWeight: 'bold', fontSize: 14 }}>
            {author.name || 'Anonymous'}
          </Text>
          <Text variant="caption" style={{ color: 'gray', marginLeft: 8 }}>
            {new Date(comment.createdAt).toLocaleDateString()}
          </Text>
        </View>
      )}
      
      {/* Comment Content */}
      <Text variant="body" style={{ marginBottom: 8 }}>
        {comment.content}
      </Text>
      
      {/* Comment Actions */}
      {onReply && level < 3 && (
        <Button 
          title="Reply" 
          onPress={onReply}
          size="small"
          variant="outline"
        />
      )}
    </View>
  );
};

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message 
}) => {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60
  };
  
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <View 
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: sizeMap[size] / 2,
          borderWidth: 3,
          borderColor: '#e3f2fd',
          borderTopColor: '#1976d2',
          // Animation would be handled by the platform-specific implementation
        }}
      />
      {message && (
        <Text variant="body" style={{ marginTop: 12, textAlign: 'center' }}>
          {message}
        </Text>
      )}
    </View>
  );
};

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View 
      style={{ 
        padding: 16, 
        backgroundColor: '#ffebee', 
        borderRadius: 8, 
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
        margin: 16
      }}
    >
      <Text variant="body" style={{ color: '#c62828', marginBottom: onRetry ? 12 : 0 }}>
        ⚠️ {message}
      </Text>
      {onRetry && (
        <Button 
          title="Try Again" 
          onPress={onRetry}
          size="small"
          style={{ backgroundColor: '#f44336' }}
        />
      )}
    </View>
  );
};

// Feature Card Component - reusable for both web and native
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <View style={{ 
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 12
    }}>
      <Text style={{ fontSize: 24, marginBottom: 8, textAlign: 'center' }}>{icon}</Text>
      <Text variant="h4" style={{ marginBottom: 8, textAlign: 'center' }}>{title}</Text>
      <Text variant="body" style={{ color: '#666', textAlign: 'center' }}>{description}</Text>
    </View>
  );
};

// Tab Button Component - for navigation tabs in mobile/web apps
interface TabButtonProps {
  title: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ title, icon, active, onPress }) => {
  return (
    <Button
      title={`${icon} ${title}`}
      onPress={onPress}
      variant={active ? 'primary' : 'outline'}
      style={{ 
        flex: 1, 
        marginHorizontal: 4,
        backgroundColor: active ? '#007bff' : 'transparent',
        borderColor: active ? '#007bff' : '#ccc'
      }}
    />
  );
};

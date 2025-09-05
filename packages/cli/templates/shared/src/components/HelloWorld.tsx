import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';

interface HelloWorldProps {
  name?: string;
  platform?: 'web' | 'mobile';
  projectName?: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({ 
  name = 'World', 
  platform = 'web',
  projectName = 'Your Project'
}) => {
  const platformEmoji = platform === 'mobile' ? '📱' : '🌐';
  const platformText = platform === 'mobile' 
    ? 'Your mobile development environment is ready. This shared component works seamlessly across mobile and web platforms.'
    : 'Your web development environment is ready. This shared component works seamlessly across web and mobile platforms.';

  return (
    <Screen style={{ flex: 1, padding: 20 }}>
        <View style={{ maxWidth: 600, alignSelf: 'center' }}>
            <Text size="xlarge" weight="bold" style={{ 
            marginBottom: 16, 
            textAlign: 'center',
            color: '#1e293b'
        }}>
            Welcome to {projectName}! {platformEmoji}
        </Text>
        
        <Text size="large" style={{ 
            marginBottom: 32, 
            textAlign: 'center',
            color: '#64748b',
            lineHeight: 24,
            paddingHorizontal: 16
        }}>
            {platformText}
        </Text>
        {/* Framework Branding Card */}
        <Card variant="elevated" padding="large" intent="primary">
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 32, marginBottom: 16 }}>🚀</Text>
            <Text size="xlarge" weight="bold" style={{ marginBottom: 8, textAlign: 'center' }}>
              Idealyst Framework
            </Text>
            <Text size="medium" style={{ marginBottom: 16, textAlign: 'center' }}>
              Hello, {name}! Welcome to your cross-platform workspace.
            </Text>
          
          {/* Technology Tags */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            <Card variant="filled" padding="small" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Text size="small" weight="semibold">React</Text>
            </Card>
            <Card variant="filled" padding="small" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Text size="small" weight="semibold">TypeScript</Text>
            </Card>
            <Card variant="filled" padding="small" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Text size="small" weight="semibold">Cross-Platform</Text>
            </Card>
          </View>
        </View>
      </Card>

      {/* Quick Start Guide Card */}
      <Card variant="outlined" padding="large" style={{ marginTop: 16 }}>
        <Text size="large" weight="bold" style={{ marginBottom: 16 }}>
          🎯 Quick Start Guide
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text size="medium" weight="semibold" style={{ marginBottom: 8 }}>
            Your Workspace Overview:
          </Text>
          <Text size="small" style={{ marginBottom: 4 }}>
            • <Text weight="semibold">packages/web/</Text> - React web application
          </Text>
          <Text size="small" style={{ marginBottom: 4 }}>
            • <Text weight="semibold">packages/mobile/</Text> - React Native mobile app
          </Text>
          <Text size="small" style={{ marginBottom: 4 }}>
            • <Text weight="semibold">packages/shared/</Text> - Cross-platform components
          </Text>
          <Text size="small" style={{ marginBottom: 4 }}>
            • <Text weight="semibold">packages/api/</Text> - tRPC API server
          </Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text size="medium" weight="semibold" style={{ marginBottom: 8 }}>
            Try Editing:
          </Text>
          <Text size="small" style={{ marginBottom: 4 }}>
            1. Edit this component in <Text weight="semibold">packages/shared/src/components/HelloWorld.tsx</Text>
          </Text>
          <Text size="small" style={{ marginBottom: 4 }}>
            2. Watch changes appear in both web and mobile apps instantly!
          </Text>
          <Text size="small" style={{ marginBottom: 4 }}>
            3. Run <Text weight="semibold">yarn dev</Text> to start all development servers
          </Text>
        </View>

        <Card variant="filled" intent="success" padding="medium">
          <Text size="small" weight="semibold" style={{ marginBottom: 4 }}>
            ✨ Framework Features:
          </Text>
          <Text size="small">
            Shared components • Type safety • Hot reload • Cross-platform compatibility
          </Text>
        </Card>
      </Card>
      </View>
    </Screen>
  );
};

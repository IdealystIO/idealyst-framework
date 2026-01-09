import React, { useState, ReactNode } from 'react';
import { View, Text, Button, Card } from '@idealyst/components';
import { useUnistyles } from 'react-native-unistyles';

interface LivePreviewProps {
  /** The component to preview */
  children: ReactNode;
  /** Code string to display */
  code?: string;
  /** Title for the preview */
  title?: string;
}

export function LivePreview({ children, code, title }: LivePreviewProps) {
  const [showCode, setShowCode] = useState(false);
  const { theme } = useUnistyles();

  return (
    <Card
      type="outlined"
      style={{
        padding: 0,
        marginVertical: 16,
        overflow: 'hidden',
      }}
    >
      {/* Preview Header */}
      <View
        background="secondary"
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.primary,
        }}
      >
        <Text weight="semibold" typography="caption">
          {title || 'Preview'}
        </Text>
        {code && (
          <Button
            size="xs"
            type="text"
            onPress={() => setShowCode(!showCode)}
          >
            {showCode ? 'Hide Code' : 'Show Code'}
          </Button>
        )}
      </View>

      {/* Preview Area */}
      <View
        background="primary"
        padding="lg"
        style={{
          alignItems: 'center',
        }}
      >
        {children}
      </View>

      {/* Code Area */}
      {showCode && code && (
        <View
          background="inverse"
          padding="md"
          style={{
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.secondary,
          }}
        >
          <Text
            typography="body2"
            color="inverse"
            style={{
              fontFamily: 'monospace',
              lineHeight: 20,
            }}
          >
            {code}
          </Text>
        </View>
      )}
    </Card>
  );
}

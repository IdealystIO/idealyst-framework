import React, { useState, ReactNode } from 'react';
import { View, Text, Button } from '@idealyst/components';

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

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: 16,
      }}
    >
      {/* Preview Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        }}
      >
        <Text weight="semibold" size="sm">
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
        style={{
          padding: 24,
          backgroundColor: '#ffffff',
          alignItems: 'center',
        }}
      >
        {children}
      </View>

      {/* Code Area */}
      {showCode && code && (
        <View
          style={{
            backgroundColor: '#1e1e1e',
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: '#3d3d3d',
          }}
        >
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              lineHeight: 20,
              color: '#d4d4d4',
            }}
          >
            {code}
          </Text>
        </View>
      )}
    </View>
  );
}

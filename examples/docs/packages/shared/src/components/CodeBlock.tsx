import React from 'react';
import { View, Text } from '@idealyst/components';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  return (
    <View
      style={{
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        marginVertical: 16,
        overflow: 'hidden',
      }}
    >
      {title && (
        <View
          style={{
            backgroundColor: '#2d2d2d',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#3d3d3d',
          }}
        >
          <Text size="sm" style={{ color: '#a0a0a0' }}>
            {title}
          </Text>
        </View>
      )}
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontFamily: 'monospace',
            fontSize: 14,
            lineHeight: 22,
            color: '#d4d4d4',
          }}
        >
          {code}
        </Text>
      </View>
    </View>
  );
}

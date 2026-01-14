import React from 'react';
import { View, Text } from '@idealyst/components';
import { useUnistyles } from 'react-native-unistyles';

interface CodeBlockProps {
  code?: string;
  children?: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, children, language = 'typescript', title }: CodeBlockProps) {
  const { theme } = useUnistyles();
  const content = code ?? children ?? '';

  return (
    <View
      background="inverse"
      radius="md"
      style={{
        marginVertical: 16,
        overflow: 'hidden',
      }}
    >
      {title && (
        <View
          background="inverse-secondary"
          padding="sm"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.secondary,
          }}
        >
          <Text typography="caption" color="inverse-tertiary">
            {title}
          </Text>
        </View>
      )}
      <View padding="md" style={{ overflow: 'auto' }}>
        <Text
          typography="body2"
          color="inverse"
          style={{
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            lineHeight: 22,
          }}
        >
          {content}
        </Text>
      </View>
    </View>
  );
}

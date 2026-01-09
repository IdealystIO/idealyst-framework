import React from 'react';
import { View, Text } from '@idealyst/components';
import { useUnistyles } from 'react-native-unistyles';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const { theme } = useUnistyles();

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
      <View padding="md">
        <Text
          typography="body2"
          color="inverse"
          style={{
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            lineHeight: 22,
          }}
        >
          {code}
        </Text>
      </View>
    </View>
  );
}

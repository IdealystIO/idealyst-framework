import React from 'react';
import { View, Text, Card } from '@idealyst/components';
import { useTheme } from '@idealyst/theme';

interface PropDefinition {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
}

interface PropsTableProps {
  props: PropDefinition[];
}

export function PropsTable({ props }: PropsTableProps) {
  const theme = useTheme();

  return (
    <Card
      type="outlined"
      style={{
        padding: 0,
        overflow: 'hidden',
        marginVertical: 16,
      }}
    >
      {/* Header */}
      <View
        background="secondary"
        style={{
          flexDirection: 'row',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.primary,
        }}
      >
        <Text weight="semibold" style={{ width: 150 }}>Prop</Text>
        <Text weight="semibold" style={{ width: 200 }}>Type</Text>
        <Text weight="semibold" style={{ width: 100 }}>Default</Text>
        <Text weight="semibold" style={{ flex: 1 }}>Description</Text>
      </View>

      {/* Rows */}
      {props.map((prop, index) => (
        <View
          key={prop.name}
          style={{
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: index < props.length - 1 ? 1 : 0,
            borderBottomColor: theme.colors.border.primary,
          }}
        >
          <View style={{ width: 150, flexDirection: 'row', alignItems: 'center' }}>
            <Text
              color="link"
              style={{
                fontFamily: 'monospace',
                fontSize: 14,
              }}
            >
              {prop.name}
            </Text>
            {prop.required && (
              <Text intent="danger" style={{ marginLeft: 4 }}>*</Text>
            )}
          </View>
          <Text
            typography="body2"
            color="tertiary"
            style={{
              width: 200,
              fontFamily: 'monospace',
            }}
          >
            {prop.type}
          </Text>
          <Text
            typography="body2"
            color="secondary"
            style={{
              width: 100,
              fontFamily: 'monospace',
            }}
          >
            {prop.default || '-'}
          </Text>
          <Text typography="body2" style={{ flex: 1 }}>
            {prop.description}
          </Text>
        </View>
      ))}
    </Card>
  );
}

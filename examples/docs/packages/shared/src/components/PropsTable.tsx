import React from 'react';
import { View, Text } from '@idealyst/components';

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
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#f5f5f5',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
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
            borderBottomColor: '#e0e0e0',
          }}
        >
          <View style={{ width: 150, flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: 14,
                color: '#3b82f6',
              }}
            >
              {prop.name}
            </Text>
            {prop.required && (
              <Text style={{ color: '#ef4444', marginLeft: 4 }}>*</Text>
            )}
          </View>
          <Text
            style={{
              width: 200,
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#666666',
            }}
          >
            {prop.type}
          </Text>
          <Text
            style={{
              width: 100,
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#888888',
            }}
          >
            {prop.default || '-'}
          </Text>
          <Text size="sm" style={{ flex: 1, color: '#333333' }}>
            {prop.description}
          </Text>
        </View>
      ))}
    </View>
  );
}

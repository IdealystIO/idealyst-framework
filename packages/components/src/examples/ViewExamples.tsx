import React from 'react';
import { Screen, View, Text } from '../index';

export const ViewExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="large" weight="bold" align="center">
        View Examples
      </Text>
      
      {/* Spacing Examples */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Spacing Variants</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View spacing="none" background="surface" border="thin">
            <Text size="small">None</Text>
          </View>
          <View spacing="xs" background="surface" border="thin">
            <Text size="small">XS</Text>
          </View>
          <View spacing="sm" background="surface" border="thin">
            <Text size="small">SM</Text>
          </View>
          <View spacing="md" background="surface" border="thin">
            <Text size="small">MD</Text>
          </View>
          <View spacing="lg" background="surface" border="thin">
            <Text size="small">LG</Text>
          </View>
          <View spacing="xl" background="surface" border="thin">
            <Text size="small">XL</Text>
          </View>
        </View>
      </View>

      {/* Background Examples */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Background Variants</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View background="transparent" border="thin" spacing="sm">
            <Text size="small">Transparent</Text>
          </View>
          <View background="surface" spacing="sm">
            <Text size="small">Surface</Text>
          </View>
          <View background="primary" spacing="sm">
            <Text size="small" color="primary">Primary</Text>
          </View>
          <View background="secondary" spacing="sm">
            <Text size="small" color="secondary">Secondary</Text>
          </View>
        </View>
      </View>

      {/* Border Radius Examples */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Border Radius</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View radius="none" background="surface" spacing="sm" border="thin">
            <Text size="small">None</Text>
          </View>
          <View radius="xs" background="surface" spacing="sm" border="thin">
            <Text size="small">XS</Text>
          </View>
          <View radius="sm" background="surface" spacing="sm" border="thin">
            <Text size="small">SM</Text>
          </View>
          <View radius="md" background="surface" spacing="sm" border="thin">
            <Text size="small">MD</Text>
          </View>
          <View radius="lg" background="surface" spacing="sm" border="thin">
            <Text size="small">LG</Text>
          </View>
          <View radius="xl" background="surface" spacing="sm" border="thin">
            <Text size="small">XL</Text>
          </View>
        </View>
      </View>

      {/* Border Examples */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Border Variants</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <View border="none" background="surface" spacing="sm" radius="sm">
            <Text size="small">None</Text>
          </View>
          <View border="thin" background="surface" spacing="sm" radius="sm">
            <Text size="small">Thin</Text>
          </View>
          <View border="thick" background="surface" spacing="sm" radius="sm">
            <Text size="small">Thick</Text>
          </View>
        </View>
      </View>

      {/* Layout Examples */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Layout Examples</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <View 
            background="surface" 
            spacing="md" 
            radius="md" 
            border="thin"
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>Left</Text>
            <Text>Center</Text>
            <Text>Right</Text>
          </View>
          
          <View 
            background="surface" 
            spacing="md" 
            radius="md" 
            border="thin"
            style={{ flexDirection: 'column', alignItems: 'center' }}
          >
            <Text>Centered</Text>
            <Text>Column</Text>
            <Text>Layout</Text>
          </View>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 
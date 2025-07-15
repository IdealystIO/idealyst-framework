import React from 'react';
import { Screen, View, Text } from '../index';

export const ScreenExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="lg">
        <Text size="large" weight="bold" align="center">
          Screen Examples
        </Text>
        
        {/* Background Examples */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Background Variants</Text>
          <Text size="small" color="secondary">
            Each Screen should have a different background color
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="primary" padding="sm">
                <View spacing="sm" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text size="small" weight="bold">Primary</Text>
                  <Text size="small" color="secondary">Surface</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary" padding="sm">
                <View spacing="sm" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text size="small" weight="bold">Secondary</Text>
                  <Text size="small" color="secondary">Surface</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="tertiary" padding="sm">
                <View spacing="sm" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text size="small" weight="bold">Tertiary</Text>
                  <Text size="small" color="secondary">Surface</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="inverse" padding="sm">
                <View spacing="sm" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text size="small" weight="bold" color="primary">Inverse</Text>
                  <Text size="small" color="secondary">Surface</Text>
                </View>
              </Screen>
            </View>
          </View>
        </View>

        {/* Padding Examples */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Padding Variants</Text>
          <Text size="small" color="secondary">
            Different padding options for Screen content
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary" padding="none">
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(255,0,0,0.1)' }}>
                  <Text size="small" weight="bold">None</Text>
                  <Text size="small" color="secondary">No padding</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary" padding="sm">
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(255,0,0,0.1)' }}>
                  <Text size="small" weight="bold">Small</Text>
                  <Text size="small" color="secondary">8px</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary" padding="md">
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(255,0,0,0.1)' }}>
                  <Text size="small" weight="bold">Medium</Text>
                  <Text size="small" color="secondary">16px</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary" padding="lg">
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(255,0,0,0.1)' }}>
                  <Text size="small" weight="bold">Large</Text>
                  <Text size="small" color="secondary">24px</Text>
                </View>
              </Screen>
            </View>
          </View>
        </View>

        {/* Safe Area Examples */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Safe Area</Text>
          <Text size="small" color="secondary">
            Safe area padding for mobile devices
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="tertiary" padding="sm" safeArea={false}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0,255,0,0.1)' }}>
                  <Text size="small" weight="bold">No Safe Area</Text>
                  <Text size="small" color="secondary">Standard</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="tertiary" padding="sm" safeArea={true}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0,255,0,0.1)' }}>
                  <Text size="small" weight="bold">Safe Area</Text>
                  <Text size="small" color="secondary">Mobile</Text>
                </View>
              </Screen>
            </View>
          </View>
        </View>

        {/* Usage Examples */}
        <View spacing="md">
          <Text size="medium" weight="semibold">Common Usage</Text>
          <View style={{ height: 120, borderWidth: 1, borderColor: '#ccc' }}>
            <Screen background="primary" padding="lg">
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text size="large" weight="bold" align="center">
                  App Screen Layout
                </Text>
                <Text size="medium" color="secondary" align="center">
                  Primary background with large padding
                </Text>
                <Text size="small" color="secondary" align="center">
                  Perfect for main app screens
                </Text>
              </View>
            </Screen>
          </View>
        </View>
      </View>
    </Screen>
  );
}; 
import { useState } from 'react';
import { Screen, View, Text } from '../index';

export const ScreenExamples = () => {
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 });

  return (
    <Screen background="primary" padding="lg">
      <View gap="lg">
        <Text typography="h4" align="center">
          Screen Examples
        </Text>
        
        {/* Background Examples */}
        <View gap="md">
          <Text typography="subtitle1">Background Variants</Text>
          <Text typography="caption" color="secondary">
            Each Screen should have a different background color
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="primary" padding="sm">
                <View gap="sm" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text typography="subtitle2">Primary</Text>
                  <Text typography="caption" color="secondary">Surface</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary" padding="sm">
                <View gap="sm" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text typography="subtitle2">Secondary</Text>
                  <Text typography="caption" color="secondary">Surface</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="tertiary" padding="sm">
                <View gap="sm" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text typography="subtitle2">Tertiary</Text>
                  <Text typography="caption" color="secondary">Surface</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="inverse" padding="sm">
                <View gap="sm" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text typography="subtitle2" color="primary">Inverse</Text>
                  <Text typography="caption" color="secondary">Surface</Text>
                </View>
              </Screen>
            </View>
          </View>
        </View>

        {/* Padding Examples */}
        <View gap="md">
          <Text typography="subtitle1">Padding Variants</Text>
          <Text typography="caption" color="secondary">
            Different padding options for Screen content
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary">
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(255,0,0,0.1)' }}>
                  <Text typography="subtitle2">None</Text>
                  <Text typography="caption" color="secondary">No padding</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary" padding="sm">
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(255,0,0,0.1)' }}>
                  <Text typography="subtitle2">Small</Text>
                  <Text typography="caption" color="secondary">8px</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary" padding="md">
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(255,0,0,0.1)' }}>
                  <Text typography="subtitle2">Medium</Text>
                  <Text typography="caption" color="secondary">16px</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="secondary" padding="lg">
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(255,0,0,0.1)' }}>
                  <Text typography="subtitle2">Large</Text>
                  <Text typography="caption" color="secondary">24px</Text>
                </View>
              </Screen>
            </View>
          </View>
        </View>

        {/* Safe Area Examples */}
        <View gap="md">
          <Text typography="subtitle1">Safe Area</Text>
          <Text typography="caption" color="secondary">
            Safe area padding for mobile devices
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="tertiary" padding="sm" safeArea={false}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0,255,0,0.1)' }}>
                  <Text typography="subtitle2">No Safe Area</Text>
                  <Text typography="caption" color="secondary">Standard</Text>
                </View>
              </Screen>
            </View>
            
            <View style={{ height: 100, width: 120, borderWidth: 1, borderColor: '#ccc' }}>
              <Screen background="tertiary" padding="sm" safeArea={true}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0,255,0,0.1)' }}>
                  <Text typography="subtitle2">Safe Area</Text>
                  <Text typography="caption" color="secondary">Mobile</Text>
                </View>
              </Screen>
            </View>
          </View>
        </View>

        {/* Usage Examples */}
        <View gap="md">
          <Text typography="subtitle1">Common Usage</Text>
          <View style={{ height: 120, borderWidth: 1, borderColor: '#ccc' }}>
            <Screen background="primary" padding="lg">
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text typography="h4" align="center">
                  App Screen Layout
                </Text>
                <Text typography="body1" color="secondary" align="center">
                  Primary background with large padding
                </Text>
                <Text typography="caption" color="secondary" align="center">
                  Perfect for main app screens
                </Text>
              </View>
            </Screen>
          </View>
        </View>

        {/* onLayout Example */}
        <View gap="md">
          <Text typography="subtitle1">onLayout Callback</Text>
          <Text typography="caption" color="secondary">
            Track screen dimensions as they change
          </Text>
          <View style={{ height: 120, borderWidth: 1, borderColor: '#ccc' }}>
            <Screen
              background="secondary"
              padding="md"
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setScreenDimensions({ width, height });
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text weight="semibold">Responsive Screen</Text>
                <Text typography="caption" color="secondary">
                  Width: {Math.round(screenDimensions.width)}px
                </Text>
                <Text typography="caption" color="secondary">
                  Height: {Math.round(screenDimensions.height)}px
                </Text>
              </View>
            </Screen>
          </View>
        </View>
      </View>
    </Screen>
  );
}; 
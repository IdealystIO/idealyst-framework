/**
 * Validation Examples
 * 
 * This file demonstrates how the theme validation system works
 * and how components can use it to validate their props.
 */

import React from 'react';
import { Screen, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import Text from '../Text';
import Button from '../Button';
import Badge from '../Badge';
import { validateColorProp, validateIntentProp } from '../theme';

export function ValidationExamples() {
  const { theme } = useUnistyles();

  // Example: Valid usage
  const handleValidUsage = () => {
    console.log('=== Valid Usage Examples ===');
    
    // These should not produce warnings
    validateColorProp(theme, 'blue', 'Text');
    validateColorProp(theme, 'primary', 'Text');
    validateIntentProp(theme, 'primary', 'Button');
    validateIntentProp(theme, 'success', 'Button');
  };

  // Example: Invalid usage
  const handleInvalidUsage = () => {
    console.log('=== Invalid Usage Examples ===');
    
    // These should produce warnings in development
    validateColorProp(theme, 'invalidColor', 'Text');
    validateColorProp(theme, 'neonPink', 'Text'); 
    validateIntentProp(theme, 'invalidIntent', 'Button');
    validateIntentProp(theme, 'danger', 'Button'); // 'danger' doesn't exist, should be 'error'
  };

  return (
    <Screen background="primary" padding="lg">
    <View style={{ padding: 20, gap: 16 }}>
      <Text size="lg" weight="bold">
        Theme Validation Examples
      </Text>
      
      <Text>
        Open the browser console to see validation warnings when using invalid colors or intents.
      </Text>

      {/* Valid examples */}
      <View style={{ gap: 8 }}>
        <Text weight="semibold">✅ Valid Usage (no warnings):</Text>
        <Text color="blue">Blue text (valid palette color)</Text>
        <Text color="blue">Blue text (valid palette color)</Text>
        <Button intent="primary" onPress={handleValidUsage}>
          Valid Button
        </Button>
        <Badge color="green">Valid Badge</Badge>
      </View>

      {/* Invalid examples that would show warnings */}
      <View style={{ gap: 8 }}>
        <Text weight="semibold">⚠️ Invalid Usage (shows warnings):</Text>
        <Button onPress={handleInvalidUsage}>
          Click to Test Invalid Props (check console)
        </Button>
        
        <Text size="sm" color="secondary">
          Note: The invalid examples are triggered programmatically to avoid 
          runtime TypeScript errors. In real usage, TypeScript would catch 
          most of these at compile time.
        </Text>
      </View>

      {/* Extensibility example */}
      <View style={{ gap: 8 }}>
        <Text weight="semibold">🔧 Extensibility:</Text>
        <Text size="sm">
          When you add new colors to your theme palette (e.g., 'orange', 'teal'), 
          they automatically become available in all components that use ColorVariant.
          The validation system will recognize them as valid options.
        </Text>
        
        <Text size="sm">
          Example: If you add 'orange' to your theme.palettes, then 
          &lt;Text color="orange"&gt; and &lt;Badge color="orange"&gt; 
          will work without any code changes to the components.
        </Text>
      </View>
    </View>
    </Screen>
  );
}

export default ValidationExamples; 
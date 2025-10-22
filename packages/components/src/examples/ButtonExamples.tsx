import React from 'react';
import { Screen, View, Button, Text } from '../index';

export const ButtonExamples = () => {
  const handlePress = (buttonType: string) => {
    console.log(`Button pressed: ${buttonType}`);
  };

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="lg" weight="bold" align="center">
        Button Examples
      </Text>
      
      {/* Button Variants */}
      <View spacing="md">
        <Text size="md" weight="semibold">Variants</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button 
            type="contained" 
            intent="primary"
            onPress={() => handlePress('contained')}
          >
            Contained
          </Button>
          <Button 
            type="outlined" 
            intent="primary"
            onPress={() => handlePress('outlined')}
          >
            Outlined
          </Button>
          <Button 
            type="text" 
            intent="primary"
            onPress={() => handlePress('text')}
          >
            Text
          </Button>
        </View>
      </View>

      {/* Button Sizes */}
      <View spacing="md">
        <Text size="md" weight="semibold">Sizes</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            size="sm"
            type="contained"
            intent="primary"
            onPress={() => handlePress('sm')}
          >
            Small
          </Button>
          <Button
            size="md"
            type="contained"
            intent="primary"
            onPress={() => handlePress('md')}
          >
            Medium
          </Button>
          <Button
            size="lg"
            type="contained"
            intent="primary"
            onPress={() => handlePress('lg')}
          >
            Large
          </Button>
        </View>
      </View>

      {/* Button Intents */}
      <View spacing="md">
        <Text size="md" weight="semibold">Intents</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button 
            intent="primary"
            type="contained"
            onPress={() => handlePress('primary')}
          >
            Primary
          </Button>
          <Button 
            intent="neutral"
            type="contained"
            onPress={() => handlePress('neutral')}
          >
            Neutral
          </Button>
          <Button 
            intent="success"
            type="contained"
            onPress={() => handlePress('success')}
          >
            Success
          </Button>
          <Button 
            intent="error"
            type="contained"
            onPress={() => handlePress('error')}
          >
            Error
          </Button>
          <Button 
            intent="warning"
            type="contained"
            onPress={() => handlePress('warning')}
          >
            Warning
          </Button>
        </View>
      </View>

      {/* Disabled States */}
      <View spacing="md">
        <Text size="md" weight="semibold">Disabled States</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            type="contained"
            intent="primary"
            disabled
            onPress={() => handlePress('disabled-contained')}
          >
            Disabled Contained
          </Button>
          <Button
            type="outlined"
            intent="primary"
            disabled
            onPress={() => handlePress('disabled-outlined')}
          >
            Disabled Outlined
          </Button>
          <Button
            type="text"
            intent="primary"
            disabled
            onPress={() => handlePress('disabled-text')}
          >
            Disabled Text
          </Button>
        </View>
      </View>

      {/* Buttons with Icons */}
      <View spacing="md">
        <Text size="md" weight="semibold">Buttons with Icons</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            type="contained"
            intent="primary"
            leftIcon="plus"
            onPress={() => handlePress('icon-left')}
          >
            Add Item
          </Button>
          <Button
            type="contained"
            intent="success"
            rightIcon="check"
            onPress={() => handlePress('icon-right')}
          >
            Save
          </Button>
          <Button
            type="contained"
            intent="error"
            leftIcon="delete"
            rightIcon="alert"
            onPress={() => handlePress('icon-both')}
          >
            Delete
          </Button>
          <Button
            type="outlined"
            intent="primary"
            leftIcon="download"
            onPress={() => handlePress('icon-outlined')}
          >
            Download
          </Button>
          <Button
            type="text"
            intent="primary"
            leftIcon="pencil"
            onPress={() => handlePress('icon-text')}
          >
            Edit
          </Button>
        </View>
      </View>

      {/* Icon-only Buttons */}
      <View spacing="md">
        <Text size="md" weight="semibold">Icon-only Buttons</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            type="contained"
            intent="primary"
            leftIcon="home"
            size="sm"
            onPress={() => handlePress('icon-only-small')}
          />
          <Button
            type="contained"
            intent="primary"
            leftIcon="cog"
            size="md"
            onPress={() => handlePress('icon-only-medium')}
          />
          <Button
            type="contained"
            intent="primary"
            leftIcon="heart"
            size="lg"
            onPress={() => handlePress('icon-only-large')}
          />
          <Button
            type="outlined"
            intent="success"
            leftIcon="check-circle"
            onPress={() => handlePress('icon-only-outlined')}
          />
          <Button
            type="text"
            intent="error"
            leftIcon="close-circle"
            onPress={() => handlePress('icon-only-text')}
          />
        </View>
      </View>

      {/* Different Intents with Icons */}
      <View spacing="md">
        <Text size="md" weight="semibold">Icons with Different Intents</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            type="contained"
            intent="primary"
            leftIcon="information"
            onPress={() => handlePress('info')}
          >
            Info
          </Button>
          <Button
            type="contained"
            intent="success"
            leftIcon="check-circle"
            onPress={() => handlePress('success')}
          >
            Success
          </Button>
          <Button
            type="contained"
            intent="warning"
            leftIcon="alert"
            onPress={() => handlePress('warning')}
          >
            Warning
          </Button>
          <Button
            type="contained"
            intent="error"
            leftIcon="alert-circle"
            onPress={() => handlePress('error')}
          >
            Error
          </Button>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 
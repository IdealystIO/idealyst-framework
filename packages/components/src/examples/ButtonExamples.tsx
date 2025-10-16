import React from 'react';
import { Screen, View, Button, Text } from '../index';

export const ButtonExamples = () => {
  const handlePress = (buttonType: string) => {
    console.log(`Button pressed: ${buttonType}`);
  };

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="large" weight="bold" align="center">
        Button Examples
      </Text>
      
      {/* Button Variants */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Variants</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            intent="primary"
            onPress={() => handlePress('contained')}
          >
            Contained
          </Button>
          <Button 
            variant="outlined" 
            intent="primary"
            onPress={() => handlePress('outlined')}
          >
            Outlined
          </Button>
          <Button 
            variant="text" 
            intent="primary"
            onPress={() => handlePress('text')}
          >
            Text
          </Button>
        </View>
      </View>

      {/* Button Sizes */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Sizes</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button 
            size="small" 
            variant="contained"
            intent="primary"
            onPress={() => handlePress('small')}
          >
            Small
          </Button>
          <Button 
            size="medium" 
            variant="contained"
            intent="primary"
            onPress={() => handlePress('medium')}
          >
            Medium
          </Button>
          <Button 
            size="large" 
            variant="contained"
            intent="primary"
            onPress={() => handlePress('large')}
          >
            Large
          </Button>
        </View>
      </View>

      {/* Button Intents */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Intents</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button 
            intent="primary"
            variant="contained"
            onPress={() => handlePress('primary')}
          >
            Primary
          </Button>
          <Button 
            intent="neutral"
            variant="contained"
            onPress={() => handlePress('neutral')}
          >
            Neutral
          </Button>
          <Button 
            intent="success"
            variant="contained"
            onPress={() => handlePress('success')}
          >
            Success
          </Button>
          <Button 
            intent="error"
            variant="contained"
            onPress={() => handlePress('error')}
          >
            Error
          </Button>
          <Button 
            intent="warning"
            variant="contained"
            onPress={() => handlePress('warning')}
          >
            Warning
          </Button>
        </View>
      </View>

      {/* Disabled States */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Disabled States</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            intent="primary"
            disabled
            onPress={() => handlePress('disabled-contained')}
          >
            Disabled Contained
          </Button>
          <Button
            variant="outlined"
            intent="primary"
            disabled
            onPress={() => handlePress('disabled-outlined')}
          >
            Disabled Outlined
          </Button>
          <Button
            variant="text"
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
        <Text size="medium" weight="semibold">Buttons with Icons</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            intent="primary"
            leftIcon="plus"
            onPress={() => handlePress('icon-left')}
          >
            Add Item
          </Button>
          <Button
            variant="contained"
            intent="success"
            rightIcon="check"
            onPress={() => handlePress('icon-right')}
          >
            Save
          </Button>
          <Button
            variant="contained"
            intent="error"
            leftIcon="delete"
            rightIcon="alert"
            onPress={() => handlePress('icon-both')}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            intent="primary"
            leftIcon="download"
            onPress={() => handlePress('icon-outlined')}
          >
            Download
          </Button>
          <Button
            variant="text"
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
        <Text size="medium" weight="semibold">Icon-only Buttons</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="contained"
            intent="primary"
            leftIcon="home"
            size="small"
            onPress={() => handlePress('icon-only-small')}
          />
          <Button
            variant="contained"
            intent="primary"
            leftIcon="cog"
            size="medium"
            onPress={() => handlePress('icon-only-medium')}
          />
          <Button
            variant="contained"
            intent="primary"
            leftIcon="heart"
            size="large"
            onPress={() => handlePress('icon-only-large')}
          />
          <Button
            variant="outlined"
            intent="success"
            leftIcon="check-circle"
            onPress={() => handlePress('icon-only-outlined')}
          />
          <Button
            variant="text"
            intent="error"
            leftIcon="close-circle"
            onPress={() => handlePress('icon-only-text')}
          />
        </View>
      </View>

      {/* Different Intents with Icons */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Icons with Different Intents</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            intent="primary"
            leftIcon="information"
            onPress={() => handlePress('info')}
          >
            Info
          </Button>
          <Button
            variant="contained"
            intent="success"
            leftIcon="check-circle"
            onPress={() => handlePress('success')}
          >
            Success
          </Button>
          <Button
            variant="contained"
            intent="warning"
            leftIcon="alert"
            onPress={() => handlePress('warning')}
          >
            Warning
          </Button>
          <Button
            variant="contained"
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
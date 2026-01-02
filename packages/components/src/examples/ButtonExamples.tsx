import React from 'react';
import { Screen, View, Button, Text } from '@idealyst/components';

export const ButtonExamples = () => {
  const handlePress = (buttonType: string) => {
    console.log(`Button pressed: ${buttonType}`);
  };

  return (
    <Screen background="primary">
      <View gap="xl">
      <Text typography="h4" align="center">
        Button Examples
      </Text>
      
      {/* Button Variants */}
      <View gap="md">
        <Text typography="subtitle1">Variants</Text>
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
      <View gap="md">
        <Text typography="subtitle1">Sizes</Text>
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
      <View gap="md">
        <Text typography="subtitle1">Intents</Text>
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
      <View gap="md">
        <Text typography="subtitle1">Disabled States</Text>
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
      <View gap="md">
        <Text typography="subtitle1">Buttons with Icons</Text>
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
      <View gap="md">
        <Text typography="subtitle1">Icon-only Buttons</Text>
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
      <View gap="md">
        <Text typography="subtitle1">Icons with Different Intents</Text>
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

      {/* Gradient Overlay */}
      <View gap="md">
        <Text typography="subtitle1">Gradient Overlay</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            type="contained"
            intent="primary"
            onPress={() => handlePress('no-gradient')}
          >
            No Gradient
          </Button>
          <Button
            type="contained"
            intent="primary"
            gradient="darken"
            onPress={() => handlePress('gradient-darken')}
          >
            Darken
          </Button>
          <Button
            type="contained"
            intent="primary"
            gradient="lighten"
            onPress={() => handlePress('gradient-lighten')}
          >
            Lighten
          </Button>
        </View>
      </View>

      {/* Gradient with Different Intents */}
      <View gap="md">
        <Text typography="subtitle1">Gradient Intents (Darken)</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            type="contained"
            intent="primary"
            gradient="darken"
            onPress={() => handlePress('gradient-primary')}
          >
            Primary
          </Button>
          <Button
            type="contained"
            intent="success"
            gradient="darken"
            onPress={() => handlePress('gradient-success')}
          >
            Success
          </Button>
          <Button
            type="contained"
            intent="error"
            gradient="darken"
            onPress={() => handlePress('gradient-error')}
          >
            Error
          </Button>
          <Button
            type="contained"
            intent="warning"
            gradient="darken"
            onPress={() => handlePress('gradient-warning')}
          >
            Warning
          </Button>
          <Button
            type="contained"
            intent="neutral"
            gradient="darken"
            onPress={() => handlePress('gradient-neutral')}
          >
            Neutral
          </Button>
        </View>
      </View>

      {/* Gradient with Icons */}
      <View gap="md">
        <Text typography="subtitle1">Gradient with Icons</Text>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Button
            type="contained"
            intent="primary"
            gradient="darken"
            leftIcon="rocket-launch"
            onPress={() => handlePress('gradient-icon-launch')}
          >
            Launch
          </Button>
          <Button
            type="contained"
            intent="success"
            gradient="lighten"
            leftIcon="check"
            rightIcon="arrow-right"
            onPress={() => handlePress('gradient-icon-submit')}
          >
            Submit
          </Button>
          <Button
            type="contained"
            intent="error"
            gradient="darken"
            leftIcon="delete"
            onPress={() => handlePress('gradient-icon-delete')}
          >
            Delete
          </Button>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 
import React from 'react';
import { Screen, View, Text, Card, Button } from '../index';

export const CardExamples = () => {
  const handleCardPress = (cardType: string) => {
    console.log(`Card pressed: ${cardType}`);
  };

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="large" weight="bold" align="center">
        Card Examples
      </Text>
      
      {/* Card Variants */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Variants</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Card variant="default" padding="medium">
            <Text>Default Card</Text>
            <Text size="small" color="secondary">
              This is a default card with standard styling
            </Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Outlined Card</Text>
            <Text size="small" color="secondary">
              This is an outlined card with border
            </Text>
          </Card>
          
          <Card variant="elevated" padding="medium">
            <Text>Elevated Card</Text>
            <Text size="small" color="secondary">
              This is an elevated card with shadow
            </Text>
          </Card>
          
          <Card variant="filled" padding="medium">
            <Text>Filled Card</Text>
            <Text size="small" color="secondary">
              This is a filled card with background
            </Text>
          </Card>
        </View>
      </View>

      {/* Card Intents */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Intents</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Card intent="neutral" padding="medium" variant="outlined">
            <Text>Neutral Card</Text>
          </Card>
          
          <Card intent="primary" padding="medium" variant="outlined">
            <Text>Primary Card</Text>
          </Card>
          
          <Card intent="success" padding="medium" variant="outlined">
            <Text>Success Card</Text>
          </Card>
          
          <Card intent="error" padding="medium" variant="outlined">
            <Text>Error Card</Text>
          </Card>
          
          <Card intent="warning" padding="medium" variant="outlined">
            <Text>Warning Card</Text>
          </Card>
          
          <Card intent="info" padding="medium" variant="outlined">
            <Text>Info Card</Text>
          </Card>
        </View>
      </View>

      {/* Card Padding */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Padding</Text>
        <View spacing="sm">
          <Card padding="none" variant="outlined">
            <Text>No Padding</Text>
          </Card>
          
          <Card padding="small" variant="outlined">
            <Text>Small Padding</Text>
          </Card>
          
          <Card padding="medium" variant="outlined">
            <Text>Medium Padding</Text>
          </Card>
          
          <Card padding="large" variant="outlined">
            <Text>Large Padding</Text>
          </Card>
        </View>
      </View>

      {/* Card Radius */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Border Radius</Text>
        <View spacing="sm">
          <Card radius="none" variant="outlined" padding="medium">
            <Text>No Radius</Text>
          </Card>
          
          <Card radius="small" variant="outlined" padding="medium">
            <Text>Small Radius</Text>
          </Card>
          
          <Card radius="medium" variant="outlined" padding="medium">
            <Text>Medium Radius</Text>
          </Card>
          
          <Card radius="large" variant="outlined" padding="medium">
            <Text>Large Radius</Text>
          </Card>
        </View>
      </View>

      {/* Clickable Cards */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Interactive Cards</Text>
        <View spacing="sm">
          <Card 
            clickable 
            onPress={() => handleCardPress('clickable')} 
            variant="outlined" 
            padding="medium"
          >
            <Text weight="semibold">Clickable Card</Text>
            <Text size="small" color="secondary">
              Click me to see interaction
            </Text>
          </Card>
          
          <Card 
            clickable 
            disabled 
            onPress={() => handleCardPress('disabled')} 
            variant="outlined" 
            padding="medium"
          >
            <Text weight="semibold">Disabled Card</Text>
            <Text size="small" color="secondary">
              This card is disabled
            </Text>
          </Card>
        </View>
      </View>

      {/* Complex Card Layout */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Complex Layout</Text>
        <Card variant="elevated" padding="large" radius="medium">
          <Text size="large" weight="bold">Product Card</Text>
          <Text size="small" color="secondary" style={{ marginVertical: 8 }}>
            This is a more complex card layout with multiple elements
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Button size="small" variant="contained" intent="primary">
              Buy Now
            </Button>
            <Button size="small" variant="outlined" intent="neutral">
              Add to Cart
            </Button>
          </View>
        </Card>
      </View>
    </View>
    </Screen>
  );
}; 
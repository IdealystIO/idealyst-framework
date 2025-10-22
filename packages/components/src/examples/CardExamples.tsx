import React from 'react';
import { Screen, View, Text, Card, Button } from '../index';

export const CardExamples = () => {
  const handleCardPress = (cardType: string) => {
    console.log(`Card pressed: ${cardType}`);
  };

  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="lg" weight="bold" align="center">
        Card Examples
      </Text>
      
      {/* Card Variants */}
      <View spacing="md">
        <Text size="md" weight="semibold">Variants</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Card variant="default" padding="md">
            <Text>Default Card</Text>
            <Text size="sm" color="secondary">
              This is a default card with standard styling
            </Text>
          </Card>
          
          <Card variant="outlined" padding="md">
            <Text>Outlined Card</Text>
            <Text size="sm" color="secondary">
              This is an outlined card with border
            </Text>
          </Card>
          
          <Card variant="elevated" padding="md">
            <Text>Elevated Card</Text>
            <Text size="sm" color="secondary">
              This is an elevated card with shadow
            </Text>
          </Card>
          
          <Card variant="filled" padding="md">
            <Text>Filled Card</Text>
            <Text size="sm" color="secondary">
              This is a filled card with background
            </Text>
          </Card>
        </View>
      </View>

      {/* Card Intents */}
      <View spacing="md">
        <Text size="md" weight="semibold">Intents</Text>
        <View spacing="sm" style={{ gap: 10 }}>
          <Card intent="neutral" padding="md" variant="outlined">
            <Text>Neutral Card</Text>
          </Card>
          
          <Card intent="primary" padding="md" variant="outlined">
            <Text>Primary Card</Text>
          </Card>
          
          <Card intent="success" padding="md" variant="outlined">
            <Text>Success Card</Text>
          </Card>
          
          <Card intent="error" padding="md" variant="outlined">
            <Text>Error Card</Text>
          </Card>
          
          <Card intent="warning" padding="md" variant="outlined">
            <Text>Warning Card</Text>
          </Card>
          
          <Card intent="info" padding="md" variant="outlined">
            <Text>Info Card</Text>
          </Card>
        </View>
      </View>

      {/* Card Padding */}
      <View spacing="md">
        <Text size="md" weight="semibold">Padding</Text>
        <View spacing="sm">
          <Card padding="none" variant="outlined">
            <Text>No Padding</Text>
          </Card>
          
          <Card padding="sm" variant="outlined">
            <Text>Small Padding</Text>
          </Card>
          
          <Card padding="md" variant="outlined">
            <Text>Medium Padding</Text>
          </Card>
          
          <Card padding="lg" variant="outlined">
            <Text>Large Padding</Text>
          </Card>
        </View>
      </View>

      {/* Card Radius */}
      <View spacing="md">
        <Text size="md" weight="semibold">Border Radius</Text>
        <View spacing="sm">
          <Card radius="none" variant="outlined" padding="md">
            <Text>No Radius</Text>
          </Card>
          
          <Card radius="sm" variant="outlined" padding="md">
            <Text>Small Radius</Text>
          </Card>
          
          <Card radius="md" variant="outlined" padding="md">
            <Text>Medium Radius</Text>
          </Card>
          
          <Card radius="lg" variant="outlined" padding="md">
            <Text>Large Radius</Text>
          </Card>
        </View>
      </View>

      {/* Clickable Cards */}
      <View spacing="md">
        <Text size="md" weight="semibold">Interactive Cards</Text>
        <View spacing="sm">
          <Card 
            clickable 
            onPress={() => handleCardPress('clickable')} 
            variant="outlined" 
            padding="md"
          >
            <Text weight="semibold">Clickable Card</Text>
            <Text size="sm" color="secondary">
              Click me to see interaction
            </Text>
          </Card>
          
          <Card 
            clickable 
            disabled 
            onPress={() => handleCardPress('disabled')} 
            variant="outlined" 
            padding="md"
          >
            <Text weight="semibold">Disabled Card</Text>
            <Text size="sm" color="secondary">
              This card is disabled
            </Text>
          </Card>
        </View>
      </View>

      {/* Complex Card Layout */}
      <View spacing="md">
        <Text size="md" weight="semibold">Complex Layout</Text>
        <Card variant="elevated" padding="lg" radius="md">
          <Text size="lg" weight="bold">Product Card</Text>
          <Text size="sm" color="secondary" style={{ marginVertical: 8 }}>
            This is a more complex card layout with multiple elements
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Button size="sm" variant="contained" intent="primary">
              Buy Now
            </Button>
            <Button size="sm" variant="outlined" intent="neutral">
              Add to Cart
            </Button>
          </View>
        </Card>
      </View>
    </View>
    </Screen>
  );
}; 
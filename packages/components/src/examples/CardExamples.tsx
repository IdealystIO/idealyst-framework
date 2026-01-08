import React from 'react';
import { Screen, View, Text, Card, Button } from '../index';

export const CardExamples = () => {
  const handleCardPress = (cardType: string) => {
    console.log(`Card pressed: ${cardType}`);
  };

  return (
    <Screen background="primary" padding="lg">
      <View gap="xl">
      <Text typography="h4" align="center">
        Card Examples
      </Text>
      
      {/* Card Variants */}
      <View gap="md">
        <Text typography="subtitle1">Variants</Text>
        <View gap="sm" style={{ gap: 10 }}>
          
          <Card type="outlined" padding="md">
            <Text>Outlined Card</Text>
            <Text typography="caption" color="secondary">
              This is an outlined card with border
            </Text>
          </Card>
          
          <Card type="elevated" padding="md">
            <Text>Elevated Card</Text>
            <Text typography="caption" color="secondary">
              This is an elevated card with shadow
            </Text>
          </Card>
          
          <Card type="filled" padding="md">
            <Text>Filled Card</Text>
            <Text typography="caption" color="secondary">
              This is a filled card with background
            </Text>
          </Card>
        </View>
      </View>

      {/* Card Intents */}
      <View gap="md">
        <Text typography="subtitle1">Intents</Text>
        <View gap="sm" style={{ gap: 10 }}>
          <Card intent="neutral" padding="md" type="outlined">
            <Text>Neutral Card</Text>
          </Card>
          
          <Card intent="primary" padding="md" type="outlined">
            <Text>Primary Card</Text>
          </Card>
          
          <Card intent="success" padding="md" type="outlined">
            <Text>Success Card</Text>
          </Card>
          
          <Card intent="error" padding="md" type="outlined">
            <Text>Error Card</Text>
          </Card>
          
          <Card intent="warning" padding="md" type="outlined">
            <Text>Warning Card</Text>
          </Card>
          
          <Card intent="info" padding="md" type="outlined">
            <Text>Info Card</Text>
          </Card>
        </View>
      </View>

      {/* Card Padding */}
      <View gap="md">
        <Text typography="subtitle1">Padding</Text>
        <View gap="sm">
          <Card type="outlined">
            <Text>No Padding</Text>
          </Card>
          
          <Card padding="sm" type="outlined">
            <Text>Small Padding</Text>
          </Card>
          
          <Card padding="md" type="outlined">
            <Text>Medium Padding</Text>
          </Card>
          
          <Card padding="lg" type="outlined">
            <Text>Large Padding</Text>
          </Card>
        </View>
      </View>

      {/* Card Radius */}
      <View gap="md">
        <Text typography="subtitle1">Border Radius</Text>
        <View gap="sm">
          <Card radius="none" type="outlined" padding="md">
            <Text>No Radius</Text>
          </Card>
          
          <Card radius="sm" type="outlined" padding="md">
            <Text>Small Radius</Text>
          </Card>
          
          <Card radius="md" type="outlined" padding="md">
            <Text>Medium Radius</Text>
          </Card>
          
          <Card radius="lg" type="outlined" padding="md">
            <Text>Large Radius</Text>
          </Card>
        </View>
      </View>

      {/* Clickable Cards */}
      <View gap="md">
        <Text typography="subtitle1">Interactive Cards</Text>
        <View gap="sm">
          <Card 
            clickable 
            onPress={() => handleCardPress('clickable')} 
            type="outlined" 
            padding="md"
          >
            <Text weight="semibold">Clickable Card</Text>
            <Text typography="caption" color="secondary">
              Click me to see interaction
            </Text>
          </Card>
          
          <Card 
            clickable 
            disabled 
            onPress={() => handleCardPress('disabled')} 
            type="outlined" 
            padding="md"
          >
            <Text weight="semibold">Disabled Card</Text>
            <Text typography="caption" color="secondary">
              This card is disabled
            </Text>
          </Card>
        </View>
      </View>

      {/* Complex Card Layout */}
      <View gap="md">
        <Text typography="subtitle1">Complex Layout</Text>
        <Card type="elevated" padding="lg" radius="md">
          <Text typography="h4">Product Card</Text>
          <Text typography="caption" color="secondary" style={{ marginVertical: 8 }}>
            This is a more complex card layout with multiple elements
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Button size="sm" type="contained" intent="primary">
              Buy Now
            </Button>
            <Button size="sm" type="outlined" intent="neutral">
              Add to Cart
            </Button>
          </View>
        </Card>
      </View>
    </View>
    </Screen>
  );
}; 
import React from 'react';
import { Screen, View, Text, Divider, Card } from '../index';

export const DividerExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View spacing="none">
      <Text size="large" weight="bold" align="center">
        Divider Examples
      </Text>
      
      {/* Horizontal Dividers */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Horizontal Dividers</Text>
        <View style={{ gap: 10 }}>
          <Card variant="outlined" padding="medium">
            <Text>Content above</Text>
            <Divider orientation="horizontal" />
            <Text>Content below</Text>
          </Card>
          <Card variant="outlined" padding="medium">
            <Text>Content above</Text>
            <Divider orientation="horizontal" variant="dashed" />
            <Text>Content below</Text>
          </Card>
          <Card variant="outlined" padding="medium">
            <Text>Content above</Text>
            <Divider orientation="horizontal" variant="dotted" />
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Divider Variants */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Variants</Text>
        <View style={{ gap: 10 }}>
          <Card variant="outlined" padding="medium">
            <Text>Solid divider</Text>
            <Divider variant="solid" />
            <Text>Content below</Text>
          </Card>
          <Card variant="outlined" padding="medium">
            <Text>Dashed divider</Text>
            <Divider variant="dashed" />
            <Text>Content below</Text>
          </Card>
          <Card variant="outlined" padding="medium">
            <Text>Dotted divider</Text>
            <Divider variant="dotted" />
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Divider Thickness */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Thickness</Text>
        <View style={{ gap: 10 }}>
          <Card variant="outlined" padding="medium">
            <Text>Thin divider</Text>
            <Divider thickness="thin" />
            <Text>Content below</Text>
          </Card>
          <Card variant="outlined" padding="medium">
            <Text>Medium divider</Text>
            <Divider thickness="medium" />
            <Text>Content below</Text>
          </Card>
          <Card variant="outlined" padding="medium">
            <Text>Thick divider</Text>
            <Divider thickness="thick" />
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Divider Intents */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Intents</Text>
        <View style={{ gap: 10 }}>
          <Card variant="outlined" padding="medium">
            <Text>Primary divider</Text>
            <Divider intent="primary" />
            <Text>Content below</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
                    <Text>Neutral divider</Text>
        <Divider intent="neutral" />
            <Text>Content below</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Neutral divider</Text>
            <Divider intent="neutral" />
            <Text>Content below</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Success divider</Text>
            <Divider intent="success" />
            <Text>Content below</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Error divider</Text>
            <Divider intent="error" />
            <Text>Content below</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Warning divider</Text>
            <Divider intent="warning" />
            <Text>Content below</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Info divider</Text>
            <Divider intent="info" />
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Divider Spacing */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Spacing</Text>
        <View style={{ gap: 10 }}>
          <Card variant="outlined" padding="medium">
            <Text>No spacing</Text>
            <Divider spacing="none" />
            <Text>Content immediately after</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Small spacing</Text>
            <Divider spacing="small" />
            <Text>Content with small spacing</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Medium spacing</Text>
            <Divider spacing="medium" />
            <Text>Content with medium spacing</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Large spacing</Text>
            <Divider spacing="large" />
            <Text>Content with large spacing</Text>
          </Card>
        </View>
      </View>

      {/* Divider with Content */}
      <View spacing="md">
        <Text size="medium" weight="semibold">With Content</Text>
        <View style={{ gap: 10 }}>
          <Card variant="outlined" padding="medium">
            <Text>Content above</Text>
            <Divider spacing="medium">
              <Text size="small" color="secondary">OR</Text>
            </Divider>
            <Text>Content below</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Content above</Text>
            <Divider spacing="medium" intent="primary">
              <Text size="small" color="primary" weight="semibold">SECTION</Text>
            </Divider>
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Vertical Dividers */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Vertical Dividers</Text>
        <Card variant="outlined" padding="medium">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text>Left</Text>
            <Divider orientation="vertical" />
            <Text>Center</Text>
            <Divider orientation="vertical" variant="dashed" />
            <Text>Right</Text>
          </View>
        </Card>
      </View>

      {/* Custom Length */}
      <View spacing="md">
        <Text size="medium" weight="semibold">Custom Length</Text>
        <View style={{ gap: 10 }}>
          <Card variant="outlined" padding="medium">
            <Text>Auto length</Text>
            <Divider length="auto" />
            <Text>Content below</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>Full length</Text>
            <Divider length="full" />
            <Text>Content below</Text>
          </Card>
          
          <Card variant="outlined" padding="medium">
            <Text>50% length</Text>
            <Divider length={50} />
            <Text>Content below</Text>
          </Card>
        </View>
      </View>
    </View>
    </Screen>
  );
}; 
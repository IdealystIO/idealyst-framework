import React from 'react';
import { Screen, View, Text, Divider, Card } from '../index';

export const DividerExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View gap="xl">
      <Text typography="h4" align="center">
        Divider Examples
      </Text>
      
      {/* Horizontal Dividers */}
      <View gap="md">
        <Text typography="subtitle1">Horizontal Dividers</Text>
        <View style={{ gap: 10 }}>
          <Card type="outlined" padding="md">
            <Text>Content above</Text>
            <Divider orientation="horizontal" />
            <Text>Content below</Text>
          </Card>
          <Card type="outlined" padding="md">
            <Text>Content above</Text>
            <Divider orientation="horizontal" type="dashed" />
            <Text>Content below</Text>
          </Card>
          <Card type="outlined" padding="md">
            <Text>Content above</Text>
            <Divider orientation="horizontal" type="dotted" />
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Divider Variants */}
      <View gap="md">
        <Text typography="subtitle1">Variants</Text>
        <View style={{ gap: 10 }}>
          <Card type="outlined" padding="md">
            <Text>Solid divider</Text>
            <Divider type="solid" />
            <Text>Content below</Text>
          </Card>
          <Card type="outlined" padding="md">
            <Text>Dashed divider</Text>
            <Divider type="dashed" />
            <Text>Content below</Text>
          </Card>
          <Card type="outlined" padding="md">
            <Text>Dotted divider</Text>
            <Divider type="dotted" />
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Divider Thickness */}
      <View gap="md">
        <Text typography="subtitle1">Thickness</Text>
        <View style={{ gap: 10 }}>
          <Card type="outlined" padding="md">
            <Text>Thin divider</Text>
            <Divider thickness="thin" />
            <Text>Content below</Text>
          </Card>
          <Card type="outlined" padding="md">
            <Text>Medium divider</Text>
            <Divider thickness="md" />
            <Text>Content below</Text>
          </Card>
          <Card type="outlined" padding="md">
            <Text>Thick divider</Text>
            <Divider thickness="thick" />
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Divider Intents */}
      <View gap="md">
        <Text typography="subtitle1">Intents</Text>
        <View style={{ gap: 10 }}>
          <Card type="outlined" padding="md">
            <Text>Primary divider</Text>
            <Divider intent="primary" />
            <Text>Content below</Text>
          </Card>
          
          <Card type="outlined" padding="md">
                    <Text>Neutral divider</Text>
        <Divider intent="neutral" />
            <Text>Content below</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Neutral divider</Text>
            <Divider intent="neutral" />
            <Text>Content below</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Success divider</Text>
            <Divider intent="success" />
            <Text>Content below</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Error divider</Text>
            <Divider intent="error" />
            <Text>Content below</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Warning divider</Text>
            <Divider intent="warning" />
            <Text>Content below</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Info divider</Text>
            <Divider intent="info" />
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Divider Spacing */}
      <View gap="md">
        <Text typography="subtitle1">Spacing</Text>
        <View style={{ gap: 10 }}>
          <Card type="outlined" padding="md">
            <Text>No spacing</Text>
            <Divider  />
            <Text>Content immediately after</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Small spacing</Text>
            <Divider spacing="sm" />
            <Text>Content with small spacing</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Medium spacing</Text>
            <Divider spacing="md" />
            <Text>Content with medium spacing</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Large spacing</Text>
            <Divider spacing="lg" />
            <Text>Content with large spacing</Text>
          </Card>
        </View>
      </View>

      {/* Divider with Content */}
      <View gap="md">
        <Text typography="subtitle1">With Content</Text>
        <View style={{ gap: 10 }}>
          <Card type="outlined" padding="md">
            <Text>Content above</Text>
            <Divider spacing="md">
              <Text typography="caption" color="secondary">OR</Text>
            </Divider>
            <Text>Content below</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Content above</Text>
            <Divider spacing="md" intent="primary">
              <Text typography="subtitle2" color="primary">SECTION</Text>
            </Divider>
            <Text>Content below</Text>
          </Card>
        </View>
      </View>

      {/* Vertical Dividers */}
      <View gap="md">
        <Text typography="subtitle1">Vertical Dividers</Text>
        <Card type="outlined" padding="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text>Left</Text>
            <Divider orientation="vertical" />
            <Text>Center</Text>
            <Divider orientation="vertical" type="dashed" />
            <Text>Right</Text>
          </View>
        </Card>
      </View>

      {/* Custom Length */}
      <View gap="md">
        <Text typography="subtitle1">Custom Length</Text>
        <View style={{ gap: 10 }}>
          <Card type="outlined" padding="md">
            <Text>Auto length</Text>
            <Divider length="auto" />
            <Text>Content below</Text>
          </Card>
          
          <Card type="outlined" padding="md">
            <Text>Full length</Text>
            <Divider length="full" />
            <Text>Content below</Text>
          </Card>
          
          <Card type="outlined" padding="md">
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
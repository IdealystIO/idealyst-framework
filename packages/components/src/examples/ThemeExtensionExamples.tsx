import React, { useEffect } from 'react';
import { Screen, View, Button, Text, Badge, Card, Input, Checkbox } from '../index';

export const ThemeExtensionExamples = () => {
  return (
    <Screen background="primary" padding="lg">
      <View gap="lg">
        <Text typography="h4" align="center">
          Extended Theme Test
        </Text>
        
        {/* Extended Colors */}
        <View gap="md">
          <Text typography="subtitle1">Extended Colors</Text>
                     <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
             <Badge color={"orange" as any}>Orange</Badge>
             <Badge color={"teal" as any}>Teal</Badge>
             <Badge color={"indigo" as any}>Indigo</Badge>
             <Badge color={"violet" as any}>Violet</Badge>
             <Badge color={"emerald" as any}>Emerald</Badge>
           </View>
           
           <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
             <Text color={"orange" as any}>Orange Text</Text>
             <Text color={"teal" as any}>Teal Text</Text>
             <Text color={"indigo" as any}>Indigo Text</Text>
             <Text color={"violet" as any}>Violet Text</Text>
             <Text color={"emerald" as any}>Emerald Text</Text>
           </View>
        </View>

        {/* Extended Intents */}
                          <View gap="md">
           <Text typography="subtitle1">Extended Intents</Text>
           <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
             <Button intent={"accent" as any}>Accent Button</Button>
             <Button intent={"feature" as any}>Feature Button</Button>
             <Button intent={"highlight" as any}>Highlight Button</Button>
           </View>
           
           <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
             <Button intent={"accent" as any} type="outlined">Accent Outlined</Button>
             <Button intent={"feature" as any} type="outlined">Feature Outlined</Button>
             <Button intent={"highlight" as any} type="outlined">Highlight Outlined</Button>
           </View>
         </View>

         {/* Mixed Usage */}
         <View gap="md">
           <Text typography="subtitle1">Mixed Extended Usage</Text>
           
           <Card>
             <View gap="sm">
               <Text color={"orange" as any} weight="bold">Orange Card Header</Text>
               <Text color="secondary">This card uses extended orange color for the header</Text>
               <Button intent={"accent" as any} size="sm">Accent Action</Button>
             </View>
           </Card>
           
           <Card>
             <View gap="sm">
               <Text color={"teal" as any} weight="bold">Teal Card Header</Text>
               <Text color="secondary">This card uses extended teal color for the header</Text>
               <Button intent={"feature" as any} size="sm">Feature Action</Button>
             </View>
           </Card>
         </View>

         {/* Form with Extended Colors */}
         <View gap="md">
           <Text typography="subtitle1">Form with Extended Styling</Text>
           
           <Input 
             placeholder="Input with accent intent" 
             intent={"accent" as any}
           />
           
           <Input 
             placeholder="Input with feature intent" 
             intent={"feature" as any}
           />
           
           <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
             <Checkbox intent={"accent" as any}>Accent Checkbox</Checkbox>
             <Checkbox intent={"feature" as any}>Feature Checkbox</Checkbox>
           </View>
         </View>
      </View>
    </Screen>
  );
}; 
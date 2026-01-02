import React from 'react';
import { Screen, View, Text } from '../index';
import Accordion from '../Accordion';
import type { AccordionItem } from '../Accordion/types';

export const AccordionExamples: React.FC = () => {
  const basicItems: AccordionItem[] = [
    {
      id: 'item1',
      title: 'What is React?',
      content: 'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.',
    },
    {
      id: 'item2',
      title: 'What is TypeScript?',
      content: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    },
    {
      id: 'item3',
      title: 'What is Unistyles?',
      content: 'Unistyles is a cross-platform styling library that works with both React and React Native, providing a unified API for styling components.',
    },
  ];

  const richContentItems: AccordionItem[] = [
    {
      id: 'rich1',
      title: 'Rich Content Example',
      content: (
        <View gap="sm">
          <Text weight="semibold">Features:</Text>
          <Text>• Cross-platform support</Text>
          <Text>• Type-safe styling</Text>
          <Text>• Theme variants</Text>
        </View>
      ),
    },
    {
      id: 'rich2',
      title: 'Another Section',
      content: (
        <View gap="xl">
          <Text>This section contains rich content with multiple paragraphs.</Text>
          <Text style={{ marginTop: 8 }}>You can include any React components here.</Text>
        </View>
      ),
    },
  ];

  const disabledItems: AccordionItem[] = [
    { id: 'enabled1', title: 'Enabled Item', content: 'This item is enabled.' },
    { id: 'disabled', title: 'Disabled Item', content: 'This item is disabled.', disabled: true },
    { id: 'enabled2', title: 'Another Enabled Item', content: 'This item is also enabled.' },
  ];

  return (
    <Screen background="primary" padding="lg">
    <View gap="lg">
      <Text typography="h3">Accordion Examples</Text>

      <View gap="md">
        <Text typography="h5">Basic Accordion</Text>
        <Accordion items={basicItems} />
      </View>

      <View gap="md">
        <Text typography="h5">Allow Multiple Expanded</Text>
        <Accordion items={basicItems} allowMultiple />
      </View>

      <View gap="md">
        <Text typography="h5">Default Expanded</Text>
        <Accordion items={basicItems} defaultExpanded={['item1', 'item2']} allowMultiple />
      </View>

      <View gap="md">
        <Text typography="h5">Variants</Text>
        <View gap="sm">
          <View gap="xs">
            <Text typography="body2">Default</Text>
            <Accordion items={basicItems} type="standard" />
          </View>
          <View gap="xs">
            <Text typography="body2">Separated</Text>
            <Accordion items={basicItems} type="separated" />
          </View>
          <View gap="xs">
            <Text typography="body2">Bordered</Text>
            <Accordion items={basicItems} type="bordered" />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Sizes</Text>
        <View gap="sm">
          <View gap="xs">
            <Text typography="body2">Small</Text>
            <Accordion items={basicItems} size="sm" type="separated" />
          </View>
          <View gap="xs">
            <Text typography="body2">Medium (default)</Text>
            <Accordion items={basicItems} size="md" type="separated" />
          </View>
          <View gap="xs">
            <Text typography="body2">Large</Text>
            <Accordion items={basicItems} size="lg" type="separated" />
          </View>
        </View>
      </View>

      <View gap="md">
        <Text typography="h5">Rich Content</Text>
        <Accordion items={richContentItems} type="bordered" />
      </View>

      <View gap="md">
        <Text typography="h5">Disabled Items</Text>
        <Accordion items={disabledItems} type="separated" />
      </View>
    </View>
    </Screen>
  );
};

export default AccordionExamples;

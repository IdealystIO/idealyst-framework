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
        <View spacing="sm">
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
        <View>
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
    <View spacing="lg">
      <Text size="xl" weight="bold">Accordion Examples</Text>

      <View spacing="md">
        <Text size="lg" weight="semibold">Basic Accordion</Text>
        <Accordion items={basicItems} />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Allow Multiple Expanded</Text>
        <Accordion items={basicItems} allowMultiple />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Default Expanded</Text>
        <Accordion items={basicItems} defaultExpanded={['item1', 'item2']} allowMultiple />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Variants</Text>
        <View spacing="sm">
          <View spacing="xs">
            <Text size="sm" weight="medium">Default</Text>
            <Accordion items={basicItems} variant="default" />
          </View>
          <View spacing="xs">
            <Text size="sm" weight="medium">Separated</Text>
            <Accordion items={basicItems} variant="separated" />
          </View>
          <View spacing="xs">
            <Text size="sm" weight="medium">Bordered</Text>
            <Accordion items={basicItems} variant="bordered" />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Sizes</Text>
        <View spacing="sm">
          <View spacing="xs">
            <Text size="sm" weight="medium">Small</Text>
            <Accordion items={basicItems} size="sm" variant="separated" />
          </View>
          <View spacing="xs">
            <Text size="sm" weight="medium">Medium (default)</Text>
            <Accordion items={basicItems} size="md" variant="separated" />
          </View>
          <View spacing="xs">
            <Text size="sm" weight="medium">Large</Text>
            <Accordion items={basicItems} size="lg" variant="separated" />
          </View>
        </View>
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Rich Content</Text>
        <Accordion items={richContentItems} variant="bordered" />
      </View>

      <View spacing="md">
        <Text size="lg" weight="semibold">Disabled Items</Text>
        <Accordion items={disabledItems} variant="separated" />
      </View>
    </View>
    </Screen>
  );
};

export default AccordionExamples;

import React from 'react';
import { View, Text, Accordion, Screen } from '@idealyst/components';
import { ComponentPlayground, accordionPropConfig } from '../../components/ComponentPlayground';

// Demo wrapper with sample items
function DemoAccordion(props: any) {
  const items = [
    { id: '1', title: 'What is Idealyst?', content: 'A cross-platform UI framework for React and React Native.' },
    { id: '2', title: 'How do I get started?', content: 'Run `npx @idealyst/cli init` to create a new project.' },
    { id: '3', title: 'Is it free to use?', content: 'Yes, Idealyst is open source and free for all projects.' },
  ];
  return <Accordion {...props} items={items} />;
}

export function AccordionPage() {
  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Accordion
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 32, lineHeight: 26 }}>
          Collapsible content sections for organizing information.
          Supports single or multiple expanded items with smooth animations.
        </Text>

        <ComponentPlayground
          component={DemoAccordion}
          componentName="Accordion"
          propConfig={accordionPropConfig}
          showChildren={false}
        />
      </View>
    </Screen>
  );
}

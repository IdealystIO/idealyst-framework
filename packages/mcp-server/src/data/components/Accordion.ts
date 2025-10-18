export const Accordion = {
  category: "display",
  description: "Expandable/collapsible content sections with support for single or multiple open items",
  props: `
- \`items\`: AccordionItem[] - Array of accordion items
  - \`id\`: string - Unique identifier for the item
  - \`title\`: string - Title text displayed in the header
  - \`content\`: ReactNode - Content displayed when expanded
  - \`disabled\`: boolean - Whether the item is disabled
- \`allowMultiple\`: boolean - Allow multiple items to be expanded simultaneously (default: false)
- \`defaultExpanded\`: string[] - Array of item IDs to expand by default
- \`variant\`: 'default' | 'separated' | 'bordered' - Visual style variant
- \`size\`: 'small' | 'medium' | 'large' - Size of accordion items
- \`style\`: ViewStyle - Additional custom styles
- \`testID\`: string - Test identifier
`,
  features: [
    "Single or multiple item expansion modes",
    "Default expanded items support",
    "Three visual variants",
    "Three size options",
    "Disabled item state",
    "Controlled and uncontrolled modes",
  ],
  bestPractices: [
    "Use 'default' variant for standard content organization",
    "Use 'separated' variant for distinct sections",
    "Set allowMultiple to true for FAQs where users may need to compare answers",
    "Keep accordion titles concise and descriptive",
    "Use defaultExpanded sparingly to avoid overwhelming users",
  ],
  usage: `
import { Accordion } from '@idealyst/components';

const items = [
  {
    id: '1',
    title: 'What is Idealyst?',
    content: <Text>Idealyst is a cross-platform React framework...</Text>,
  },
  {
    id: '2',
    title: 'How do I get started?',
    content: <Text>Install the CLI and create a new project...</Text>,
  },
];

<Accordion
  items={items}
  variant="bordered"
  defaultExpanded={['1']}
/>
`,
  examples: {
    basic: `import { Accordion, Text } from '@idealyst/components';

const items = [
  { id: '1', title: 'Section 1', content: <Text>Content 1</Text> },
  { id: '2', title: 'Section 2', content: <Text>Content 2</Text> },
];

<Accordion items={items} />`,

    variants: `import { Accordion, Text } from '@idealyst/components';

const items = [
  { id: '1', title: 'Item', content: <Text>Content</Text> },
];

// Different variants
<Accordion items={items} variant="default" />
<Accordion items={items} variant="separated" />
<Accordion items={items} variant="bordered" />`,

    "with-icons": `import { Accordion, View, Icon, Text } from '@idealyst/components';

const items = [
  {
    id: '1',
    title: 'Account Settings',
    content: (
      <View spacing="sm">
        <Icon name="account" size="md" />
        <Text>Manage your account preferences</Text>
      </View>
    ),
  },
];

<Accordion items={items} intent="primary" />`,

    interactive: `import { Accordion, Text } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const items = [
    { id: '1', title: 'FAQ 1', content: <Text>Answer 1</Text> },
    { id: '2', title: 'FAQ 2', content: <Text>Answer 2</Text> },
    { id: '3', title: 'FAQ 3', content: <Text>Answer 3</Text> },
  ];

  return (
    <Accordion
      items={items}
      allowMultiple
      defaultExpanded={['1']}
      variant="bordered"
    />
  );
}`,
  },
};

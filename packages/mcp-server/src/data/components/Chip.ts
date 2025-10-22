export const Chip = {
category: "display",
    description: "Compact element for tags, filters, and selections with optional delete action",
    props: `
- \`label\`: string - Chip text
- \`variant\`: 'filled' | 'outlined' | 'soft' - Visual style
- \`intent\`: 'primary' | 'neutral' | 'success' | 'error' | 'warning' - Color scheme
- \`size\`: 'sm' | 'md' | 'lg' - Chip size
- \`icon\`: IconName | ReactNode - Leading icon
- \`deletable\`: boolean - Show delete button
- \`onDelete\`: () => void - Delete handler
- \`deleteIcon\`: IconName | ReactNode - Custom delete icon (defaults to 'close')
- \`selectable\`: boolean - Enable selection
- \`selected\`: boolean - Selected state
- \`onPress\`: () => void - Press handler
- \`disabled\`: boolean - Disabled state
`,
    features: [
      "Three variants: filled, outlined, soft",
      "Five intent colors",
      "Icon support with MDI icons",
      "Deletable with onDelete handler",
      "Customizable delete icon (defaults to MDI 'close')",
      "Selectable with selected state",
      "Three sizes",
      "Disabled state",
    ],
    bestPractices: [
      "Use for tags, filters, and multi-select options",
      "Use deletable chips for removable tags",
      "Use selectable chips for filter options",
      "Keep chip labels concise",
    ],
    usage: `
import { Chip } from '@idealyst/components';

<Chip
  label="React"
  icon="check"
  deletable
  onDelete={() => removeTag('React')}
/>
`,
    examples: {
      basic: `import { Chip } from '@idealyst/components';

<Chip label="Tag" />`,
      variants: `import { Chip } from '@idealyst/components';

<Chip label="Filled" variant="filled" intent="primary" />
<Chip label="Outlined" variant="outlined" intent="success" />
<Chip label="Soft" variant="soft" intent="warning" />`,
      "with-icons": `import { Chip } from '@idealyst/components';

<Chip label="Star" icon="star" />
<Chip label="Heart" icon="heart" intent="error" />

// Custom delete icon
<Chip
  label="Custom Delete"
  deletable
  deleteIcon="close-circle"
  onDelete={() => console.log('deleted')}
/>

// Alternative delete icons
<Chip
  label="Remove"
  deletable
  deleteIcon="delete"
  onDelete={() => console.log('deleted')}
/>`,
      interactive: `import { Chip, View } from '@idealyst/components';
import { useState } from 'react';

function Example() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Node.js']);

  return (
    <View spacing="sm">
      {tags.map(tag => (
        <Chip
          key={tag}
          label={tag}
          deletable
          onDelete={() => setTags(tags.filter(t => t !== tag))}
        />
      ))}
    </View>
  );
}`,
    }
};

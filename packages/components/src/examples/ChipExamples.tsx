import React, { useState } from 'react';
import { Screen, View, Text, Chip, Divider } from '@idealyst/components';

export const ChipExamples = () => {
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());
  const [tags, setTags] = useState(['React', 'TypeScript', 'JavaScript', 'Node.js']);

  const toggleChip = (id: string) => {
    const newSelected = new Set(selectedChips);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedChips(newSelected);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <Screen background="primary" safeArea>
      <View spacing="lg" style={{ maxWidth: 800, width: '100%', paddingHorizontal: 16, marginHorizontal: 'auto' }}>
        <Text size="xlarge" weight="bold">Chip Examples</Text>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Basic Chips</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Default" />
          <Chip label="Primary" intent="primary" />
          <Chip label="Success" intent="success" />
          <Chip label="Error" intent="error" />
          <Chip label="Warning" intent="warning" />
          <Chip label="Neutral" intent="neutral" />
        </View>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Variants</Text>

        <Text size="medium" weight="semibold">Filled (Default)</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Filled Primary" variant="filled" intent="primary" />
          <Chip label="Filled Success" variant="filled" intent="success" />
          <Chip label="Filled Error" variant="filled" intent="error" />
        </View>

        <Text size="medium" weight="semibold">Outlined</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Outlined Primary" variant="outlined" intent="primary" />
          <Chip label="Outlined Success" variant="outlined" intent="success" />
          <Chip label="Outlined Error" variant="outlined" intent="error" />
        </View>

        <Text size="medium" weight="semibold">Soft</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Soft Primary" variant="soft" intent="primary" />
          <Chip label="Soft Success" variant="soft" intent="success" />
          <Chip label="Soft Error" variant="soft" intent="error" />
        </View>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Sizes</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Chip label="Small" size="small" />
          <Chip label="Medium" size="medium" />
          <Chip label="Large" size="large" />
        </View>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">With Icons</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Star" icon="star" />
          <Chip label="Heart" icon="heart" intent="error" />
          <Chip label="Check" icon="check" intent="success" />
          <Chip label="Info" icon="information" variant="outlined" />
        </View>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Deletable Chips</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              deletable
              onDelete={() => removeTag(tag)}
              intent="primary"
              variant="outlined"
            />
          ))}
        </View>
        <Text size="small" color="secondary">Click the X to remove tags</Text>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Selectable Chips</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map(option => (
            <Chip
              key={option}
              label={option}
              selectable
              selected={selectedChips.has(option)}
              onPress={() => toggleChip(option)}
              intent="primary"
              variant="outlined"
            />
          ))}
        </View>
        <Text size="small" color="secondary">
          Selected: {Array.from(selectedChips).join(', ') || 'None'}
        </Text>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Clickable Chips</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip
            label="Click me!"
            onPress={() => alert('Chip clicked!')}
            intent="primary"
          />
          <Chip
            label="Another action"
            onPress={() => console.log('Clicked')}
            variant="outlined"
            intent="success"
          />
        </View>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Disabled State</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Disabled" disabled />
          <Chip label="Disabled Outlined" variant="outlined" disabled />
          <Chip label="Disabled Deletable" deletable onDelete={() => {}} disabled />
          <Chip label="Disabled Selectable" selectable onPress={() => {}} disabled />
        </View>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Filter Example</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip
            label="All"
            selectable
            selected={selectedChips.has('filter-all')}
            onPress={() => toggleChip('filter-all')}
            variant="soft"
            intent="neutral"
          />
          <Chip
            label="Active"
            selectable
            selected={selectedChips.has('filter-active')}
            onPress={() => toggleChip('filter-active')}
            variant="soft"
            intent="success"
          />
          <Chip
            label="Completed"
            selectable
            selected={selectedChips.has('filter-completed')}
            onPress={() => toggleChip('filter-completed')}
            variant="soft"
            intent="primary"
          />
          <Chip
            label="Archived"
            selectable
            selected={selectedChips.has('filter-archived')}
            onPress={() => toggleChip('filter-archived')}
            variant="soft"
            intent="neutral"
          />
        </View>

        <Divider spacing="medium" />
        <Text size="large" weight="semibold">Category Tags</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Design" variant="soft" intent="primary" size="small" />
          <Chip label="Development" variant="soft" intent="success" size="small" />
          <Chip label="Marketing" variant="soft" intent="warning" size="small" />
          <Chip label="Sales" variant="soft" intent="error" size="small" />
          <Chip label="Support" variant="soft" intent="neutral" size="small" />
        </View>
      </View>
    </Screen>
  );
};

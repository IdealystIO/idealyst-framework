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
        <Text size="xl" weight="bold">Chip Examples</Text>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">Basic Chips</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Default" />
          <Chip label="Primary" intent="primary" />
          <Chip label="Success" intent="success" />
          <Chip label="Error" intent="error" />
          <Chip label="Warning" intent="warning" />
          <Chip label="Neutral" intent="neutral" />
        </View>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">Variants</Text>

        <Text size="md" weight="semibold">Filled (Default)</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Filled Primary" type="filled" intent="primary" />
          <Chip label="Filled Success" type="filled" intent="success" />
          <Chip label="Filled Error" type="filled" intent="error" />
        </View>

        <Text size="md" weight="semibold">Outlined</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Outlined Primary" type="outlined" intent="primary" />
          <Chip label="Outlined Success" type="outlined" intent="success" />
          <Chip label="Outlined Error" type="outlined" intent="error" />
        </View>

        <Text size="md" weight="semibold">Soft</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Soft Primary" type="soft" intent="primary" />
          <Chip label="Soft Success" type="soft" intent="success" />
          <Chip label="Soft Error" type="soft" intent="error" />
        </View>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">Sizes</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Chip label="Small" size="sm" />
          <Chip label="Medium" size="md" />
          <Chip label="Large" size="lg" />
        </View>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">With Icons</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Star" icon="star" />
          <Chip label="Heart" icon="heart" intent="error" />
          <Chip label="Check" icon="check" intent="success" />
          <Chip label="Info" icon="information" type="outlined" />
        </View>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">Deletable Chips</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              deletable
              onDelete={() => removeTag(tag)}
              intent="primary"
              type="outlined"
            />
          ))}
        </View>
        <Text size="sm" color="secondary">Click the X to remove tags</Text>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">Selectable Chips</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map(option => (
            <Chip
              key={option}
              label={option}
              selectable
              selected={selectedChips.has(option)}
              onPress={() => toggleChip(option)}
              intent="primary"
              type="outlined"
            />
          ))}
        </View>
        <Text size="sm" color="secondary">
          Selected: {Array.from(selectedChips).join(', ') || 'None'}
        </Text>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">Clickable Chips</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip
            label="Click me!"
            onPress={() => alert('Chip clicked!')}
            intent="primary"
          />
          <Chip
            label="Another action"
            onPress={() => console.log('Clicked')}
            type="outlined"
            intent="success"
          />
        </View>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">Disabled State</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Disabled" disabled />
          <Chip label="Disabled Outlined" type="outlined" disabled />
          <Chip label="Disabled Deletable" deletable onDelete={() => {}} disabled />
          <Chip label="Disabled Selectable" selectable onPress={() => {}} disabled />
        </View>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">Filter Example</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip
            label="All"
            selectable
            selected={selectedChips.has('filter-all')}
            onPress={() => toggleChip('filter-all')}
            type="soft"
            intent="neutral"
          />
          <Chip
            label="Active"
            selectable
            selected={selectedChips.has('filter-active')}
            onPress={() => toggleChip('filter-active')}
            type="soft"
            intent="success"
          />
          <Chip
            label="Completed"
            selectable
            selected={selectedChips.has('filter-completed')}
            onPress={() => toggleChip('filter-completed')}
            type="soft"
            intent="primary"
          />
          <Chip
            label="Archived"
            selectable
            selected={selectedChips.has('filter-archived')}
            onPress={() => toggleChip('filter-archived')}
            type="soft"
            intent="neutral"
          />
        </View>

        <Divider spacing="md" />
        <Text size="lg" weight="semibold">Category Tags</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Design" type="soft" intent="primary" size="sm" />
          <Chip label="Development" type="soft" intent="success" size="sm" />
          <Chip label="Marketing" type="soft" intent="warning" size="sm" />
          <Chip label="Sales" type="soft" intent="error" size="sm" />
          <Chip label="Support" type="soft" intent="neutral" size="sm" />
        </View>
      </View>
    </Screen>
  );
};

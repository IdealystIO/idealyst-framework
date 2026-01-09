import React, { useState, useMemo } from 'react';
import { View, Text, Card, Screen, Select, Switch, Chip, Table, Divider } from '@idealyst/components';
import * as Components from '@idealyst/components';
import { componentRegistry, type PropDefinition } from '@idealyst/tooling';
import { LivePreview } from '../../components/LivePreview';
import {
  ComponentPlayground,
  type PropConfig,
  // Import all pre-configured prop configs
  buttonPropConfig,
  inputPropConfig,
  chipPropConfig,
  cardPropConfig,
  badgePropConfig,
  alertPropConfig,
  switchPropConfig,
  checkboxPropConfig,
  selectPropConfig,
  sliderPropConfig,
  progressPropConfig,
  textPropConfig,
  iconPropConfig,
  avatarPropConfig,
  dividerPropConfig,
  textAreaPropConfig,
  radioButtonPropConfig,
  dialogPropConfig,
  tooltipPropConfig,
  skeletonPropConfig,
  tablePropConfig,
  listPropConfig,
  menuPropConfig,
  breadcrumbPropConfig,
  accordionPropConfig,
  linkPropConfig,
} from '../../components/ComponentPlayground';

// Map component names to their pre-configured prop configs
const propConfigMap: Record<string, PropConfig[]> = {
  Button: buttonPropConfig,
  Input: inputPropConfig,
  Chip: chipPropConfig,
  Card: cardPropConfig,
  Badge: badgePropConfig,
  Alert: alertPropConfig,
  Switch: switchPropConfig,
  Checkbox: checkboxPropConfig,
  Select: selectPropConfig,
  Slider: sliderPropConfig,
  Progress: progressPropConfig,
  Text: textPropConfig,
  Icon: iconPropConfig,
  Avatar: avatarPropConfig,
  Divider: dividerPropConfig,
  TextArea: textAreaPropConfig,
  RadioButton: radioButtonPropConfig,
  Dialog: dialogPropConfig,
  Tooltip: tooltipPropConfig,
  Skeleton: skeletonPropConfig,
  Table: tablePropConfig,
  List: listPropConfig,
  Menu: menuPropConfig,
  Breadcrumb: breadcrumbPropConfig,
  Accordion: accordionPropConfig,
  Link: linkPropConfig,
};

// Default children for playground components
const defaultChildrenMap: Record<string, string | React.ReactNode> = {
  Button: 'Click Me',
  Text: 'Sample text content',
  Badge: '3',
  Chip: 'Chip Label',
  Link: 'Click here',
  Alert: undefined, // Alert uses title/message, not children
};

interface ComponentDocPageProps {
  componentName: string;
}

/**
 * Generic component documentation page that renders any component from the registry.
 */
export function ComponentDocPage({ componentName }: ComponentDocPageProps) {
  const definition = componentRegistry[componentName];
  const Component = (Components as any)[componentName];

  // State for interactive playground props
  const [playgroundProps, setPlaygroundProps] = useState<Record<string, any>>({});

  // Get default values for playground
  const defaultProps = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (definition) {
      Object.entries(definition.props).forEach(([key, prop]) => {
        if (prop.default !== undefined) {
          defaults[key] = prop.default;
        } else if (prop.values && prop.values.length > 0) {
          defaults[key] = prop.values[0];
        }
      });
    }
    return defaults;
  }, [definition]);

  // Merge defaults with playground props
  const currentProps = { ...defaultProps, ...playgroundProps };

  if (!definition) {
    return (
      <Screen>
        <Text typography="h3">Component not found: {componentName}</Text>
        <Text color="secondary">
          This component is not available in the registry.
        </Text>
      </Screen>
    );
  }

  // Categorize props
  const requiredProps = Object.entries(definition.props).filter(([_, p]) => p.required);
  const optionalProps = Object.entries(definition.props).filter(([_, p]) => !p.required);

  // Helper to render prop control
  const renderPropControl = (propName: string, prop: PropDefinition) => {
    const currentValue = currentProps[propName];

    if (prop.type === 'boolean') {
      return (
        <Switch
          checked={currentValue ?? false}
          onCheckedChange={(checked) => setPlaygroundProps(prev => ({ ...prev, [propName]: checked }))}
          size="sm"
        />
      );
    }

    if (prop.values && prop.values.length > 0) {
      return (
        <Select
          size="sm"
          value={currentValue ?? prop.values[0]}
          onValueChange={(value) => setPlaygroundProps(prev => ({ ...prev, [propName]: value }))}
          options={prop.values.map(v => ({ value: v, label: v }))}
          style={{ minWidth: 120 }}
        />
      );
    }

    return (
      <Text typography="caption" color="tertiary">
        {prop.type}
      </Text>
    );
  };

  // Get sample content based on component type
  const getSampleContent = () => {
    switch (componentName) {
      case 'Button':
        return { title: 'Click me' };
      case 'Text':
        return { children: 'Sample text content' };
      case 'Badge':
        return { children: '3' };
      case 'Chip':
        return { label: 'Chip Label' };
      case 'Card':
        return { children: <Text>Card content goes here</Text> };
      case 'Alert':
        return { title: 'Alert Title', message: 'This is an alert message' };
      case 'Avatar':
        return { fallback: 'AB' };
      case 'Input':
        return { placeholder: 'Enter text...' };
      case 'TextArea':
        return { placeholder: 'Enter text...' };
      case 'Progress':
        return { value: 65 };
      case 'Slider':
        return { value: 50 };
      case 'Tooltip':
        return { content: 'Tooltip text', children: <Text>Hover me</Text> };
      case 'Accordion':
        return {
          items: [
            { id: '1', title: 'Section 1', content: <Text>Content for section 1</Text> },
            { id: '2', title: 'Section 2', content: <Text>Content for section 2</Text> },
            { id: '3', title: 'Section 3', content: <Text>Content for section 3</Text> },
          ],
        };
      case 'Table':
        return {
          columns: [
            { key: 'name', title: 'Name', dataIndex: 'name' },
            { key: 'role', title: 'Role', dataIndex: 'role' },
          ],
          data: [
            { name: 'Alice', role: 'Developer' },
            { name: 'Bob', role: 'Designer' },
          ],
        };
      case 'Menu':
        return {
          items: [
            { id: '1', label: 'Edit' },
            { id: '2', label: 'Duplicate' },
            { id: '3', label: 'Delete', intent: 'error' },
          ],
          children: <Text>Click for menu</Text>,
        };
      case 'Breadcrumb':
        return {
          items: [
            { label: 'Home', onPress: () => {} },
            { label: 'Products', onPress: () => {} },
            { label: 'Current Page' },
          ],
        };
      case 'TabBar':
        return {
          items: [
            { value: 'tab1', label: 'Tab 1' },
            { value: 'tab2', label: 'Tab 2' },
            { value: 'tab3', label: 'Tab 3' },
          ],
          defaultValue: 'tab1',
        };
      case 'Select':
        return {
          options: [
            { value: 'opt1', label: 'Option 1' },
            { value: 'opt2', label: 'Option 2' },
            { value: 'opt3', label: 'Option 3' },
          ],
          placeholder: 'Select an option',
        };
      case 'Dialog':
        return {
          open: false,
          onOpenChange: () => {},
          title: 'Dialog Title',
          children: <Text>Dialog content</Text>,
        };
      case 'Popover':
        return {
          open: false,
          onOpenChange: () => {},
          anchor: <Text>Anchor</Text>,
          children: <Text>Popover content</Text>,
        };
      case 'Icon':
        return { name: 'home' };
      case 'RadioButton':
        return { value: 'option1', label: 'Option 1' };
      case 'Checkbox':
        return { label: 'Check me' };
      case 'Switch':
        return { checked: false };
      case 'Video':
        return {
          source: 'https://www.w3schools.com/html/mov_bbb.mp4',
          width: 320,
          height: 180,
          controls: true,
        };
      case 'Image':
        return {
          source: { uri: 'https://picsum.photos/200/150' },
          width: 200,
          height: 150,
        };
      case 'SVGImage':
        return {
          source: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>',
          width: 50,
          height: 50,
        };
      case 'Link':
        return { children: 'Click this link', href: '#' };
      case 'List':
        return { children: <Text>List requires children (ListItem components)</Text> };
      case 'Pressable':
        return { children: <Text>Press me</Text> };
      case 'Skeleton':
        return { width: 200, height: 20 };
      case 'Divider':
        return {};
      case 'ActivityIndicator':
        return {};
      case 'View':
        return { children: <Text>View content</Text> };
      case 'Screen':
        return { children: <Text>Screen content</Text> };
      default:
        return {};
    }
  };

  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        {/* Header */}
        <Text typography="h2" weight="bold" style={{ marginBottom: 8 }}>
          {componentName}
        </Text>

        {definition.description && (
          <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
            {definition.description}
          </Text>
        )}

        {definition.category && (
          <Chip size="sm" type="outlined" style={{ marginBottom: 24 }}>
            {definition.category}
          </Chip>
        )}

        {/* Interactive Playground */}
        {Component && propConfigMap[componentName] && (
          <>
            <Text typography="h4" weight="semibold" style={{ marginBottom: 16 }}>
              Interactive Playground
            </Text>

            <ComponentPlayground
              component={Component}
              componentName={componentName}
              propConfig={propConfigMap[componentName]}
              defaultChildren={defaultChildrenMap[componentName] ?? 'Example'}
              showChildren={!['Icon', 'Divider', 'Progress', 'Slider', 'Avatar', 'Skeleton', 'Switch', 'Checkbox', 'RadioButton'].includes(componentName)}
            />

            <View style={{ marginBottom: 32 }} />
          </>
        )}

        {/* Fallback simple playground for components without propConfig */}
        {Component && !propConfigMap[componentName] && (
          <>
            <Text typography="h4" weight="semibold" style={{ marginBottom: 16 }}>
              Preview
            </Text>

            <LivePreview title="Preview">
              <View style={{ alignItems: 'flex-start' }}>
                <Component {...currentProps} {...getSampleContent()} />
              </View>
            </LivePreview>

            {/* Simple Playground Controls */}
            {Object.entries(definition.props).filter(([_, prop]) => prop.values || prop.type === 'boolean').length > 0 && (
              <Card variant="outlined" style={{ padding: 20, marginTop: 16, marginBottom: 32 }}>
                <Text weight="semibold" style={{ marginBottom: 16 }}>Props</Text>
                <View style={{ gap: 12 }}>
                  {Object.entries(definition.props)
                    .filter(([_, prop]) => prop.values || prop.type === 'boolean')
                    .map(([propName, prop]) => (
                      <View
                        key={propName}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 16,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text weight="medium">{propName}</Text>
                          {prop.description && (
                            <Text typography="caption" color="tertiary">
                              {prop.description}
                            </Text>
                          )}
                        </View>
                        {renderPropControl(propName, prop)}
                      </View>
                    ))}
                </View>
              </Card>
            )}
          </>
        )}

        {/* Props Documentation */}
        <Text typography="h4" weight="semibold" style={{ marginBottom: 16 }}>
          Props
        </Text>

        {requiredProps.length > 0 && (
          <>
            <Text weight="medium" style={{ marginBottom: 12 }}>Required</Text>
            <PropsTable props={requiredProps} />
          </>
        )}

        {optionalProps.length > 0 && (
          <>
            <Text weight="medium" style={{ marginTop: 24, marginBottom: 12 }}>Optional</Text>
            <PropsTable props={optionalProps} />
          </>
        )}

        {/* Import Statement */}
        <Text typography="h4" weight="semibold" style={{ marginTop: 32, marginBottom: 12 }}>
          Import
        </Text>

        <View background="inverse" style={{ padding: 16, borderRadius: 8 }}>
          <Text
            typography="body2"
            color="inverse"
            style={{ fontFamily: 'monospace' }}
          >
            {`import { ${componentName} } from '@idealyst/components';`}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

/**
 * Table component for displaying props documentation
 */
function PropsTable({ props }: { props: [string, PropDefinition][] }) {
  const columns = [
    { key: 'name', title: 'Prop', dataIndex: 'name' as const, width: 150 },
    { key: 'type', title: 'Type', dataIndex: 'type' as const, width: 200 },
    { key: 'default', title: 'Default', dataIndex: 'default' as const, width: 100 },
    { key: 'description', title: 'Description', dataIndex: 'description' as const },
  ];

  const data = props.map(([name, prop]) => ({
    name,
    type: prop.values ? prop.values.join(' | ') : prop.type,
    default: prop.default !== undefined ? String(prop.default) : '-',
    description: prop.description || '-',
  }));

  return (
    <Card variant="outlined" style={{ overflow: 'hidden' }}>
      <Table
        columns={columns}
        data={data}
        size="sm"
      />
    </Card>
  );
}

export default ComponentDocPage;

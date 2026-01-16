import React, { useState, useMemo } from 'react';
import { View, Text, Card, Screen, Select, Switch, Chip, Table, Divider } from '@idealyst/components';
import * as Components from '@idealyst/components';
import { componentRegistry, type PropDefinition } from '@idealyst/tooling';
import { LivePreview } from '../../components/LivePreview';
import { ComponentErrorBoundary } from '../../components/ComponentErrorBoundary';
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
          onChange={(checked) => setPlaygroundProps(prev => ({ ...prev, [propName]: checked }))}
          size="sm"
        />
      );
    }

    if (prop.values && prop.values.length > 0) {
      return (
        <Select
          size="sm"
          value={currentValue ?? prop.values[0]}
          onChange={(value) => setPlaygroundProps(prev => ({ ...prev, [propName]: value }))}
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

  // Get sample content from registry (docs.ts files)
  const getSampleContent = () => definition.sampleProps?.props || {};

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

            <ComponentErrorBoundary componentName={componentName}>
              <ComponentPlayground
                component={Component}
                componentName={componentName}
                propConfig={propConfigMap[componentName]}
                defaultChildren={definition.sampleProps?.children ?? 'Example'}
                showChildren={!['Icon', 'Divider', 'Progress', 'Slider', 'Avatar', 'Skeleton', 'Switch', 'Checkbox', 'RadioButton'].includes(componentName)}
                fixedProps={definition.sampleProps?.props}
                stateConfig={definition.sampleProps?.state}
              />
            </ComponentErrorBoundary>

            <View style={{ marginBottom: 32 }} />
          </>
        )}

        {/* Fallback simple playground for components without propConfig */}
        {Component && !propConfigMap[componentName] && (
          <>
            <Text typography="h4" weight="semibold" style={{ marginBottom: 16 }}>
              Preview
            </Text>

            <ComponentErrorBoundary componentName={componentName}>
              <LivePreview title="Preview">
                <View style={{ alignItems: 'flex-start' }}>
                  <Component {...currentProps} {...getSampleContent()} />
                </View>
              </LivePreview>
            </ComponentErrorBoundary>

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

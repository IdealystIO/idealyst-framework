import React, { useState, useMemo, ReactNode } from 'react';
import { View, Text, Card, Select, Icon, Button, Dialog, Table } from '@idealyst/components';
import type { TableColumn } from '@idealyst/components/Table/types';
import { useTheme } from '@idealyst/theme';

// Force Babel to bundle these icons for playground use
function IconPreloader() {
  return (
    <View style={{ display: 'none' }}>
      <Icon name="check" />
      <Icon name="close" />
      <Icon name="plus" />
      <Icon name="minus" />
      <Icon name="arrow-right" />
      <Icon name="arrow-left" />
      <Icon name="email" />
      <Icon name="lock" />
      <Icon name="account" />
      <Icon name="magnify" />
      <Icon name="heart" />
      <Icon name="star" />
      <Icon name="home" />
      <Icon name="cog" />
      <Icon name="bell" />
      <Icon name="send" />
      <Icon name="fullscreen" />
      <Icon name="help-circle-outline" />
      <Icon name="content-copy" />
    </View>
  );
}

export type PropConfig = {
  name: string;
  /** Control type */
  type: 'select' | 'boolean' | 'text';
  /** Available options for select type */
  options?: string[];
  /** Default value */
  default?: string | boolean;
  /** Human-readable description */
  description?: string;
  /** TypeScript type signature */
  typeSignature?: string;
  /** Whether this value is theme-extensible */
  themeExtensible?: boolean;
};

/**
 * Configuration for controlled state bindings
 */
export type StateConfig = Record<string, {
  /** Initial value for the state */
  initial: any;
  /** The prop name that receives the onChange callback */
  onChangeProp: string;
  /** If true, the callback toggles a boolean value instead of receiving a new value */
  toggle?: boolean;
}>;

type PlaygroundProps = {
  /** Component to render */
  component: React.ComponentType<any>;
  /** Component name for code generation */
  componentName: string;
  /** Configuration for editable props */
  propConfig: PropConfig[];
  /** Default children/content */
  defaultChildren?: ReactNode;
  /** Whether to show children input */
  showChildren?: boolean;
  /** Fixed props that are always passed to the component (not editable in playground) */
  fixedProps?: Record<string, any>;
  /** Controlled state configuration from docs.ts */
  stateConfig?: StateConfig;
};

/**
 * Generate code string from props, excluding defaults
 * Props are formatted one per line with indentation
 */
function generateCode(
  componentName: string,
  props: Record<string, any>,
  defaults: Record<string, any>,
  children?: string
): string {
  const propEntries = Object.entries(props).filter(([key, value]) => {
    // Skip undefined/null values and 'none' placeholder values
    if (value === undefined || value === null || value === 'none') return false;
    // Skip if value equals the default
    if (defaults[key] !== undefined && defaults[key] === value) return false;
    // Skip false booleans (they're usually defaults)
    if (value === false) return false;
    return true;
  });

  // No props - simple output
  if (propEntries.length === 0) {
    if (!children) {
      return `<${componentName} />`;
    }
    return `<${componentName}>${children}</${componentName}>`;
  }

  // Format each prop on its own line with indentation
  const propsLines = propEntries.map(([key, value]) => {
    if (typeof value === 'boolean') {
      return value ? `  ${key}` : `  ${key}={false}`;
    }
    if (typeof value === 'string') {
      return `  ${key}="${value}"`;
    }
    return `  ${key}={${JSON.stringify(value)}}`;
  });

  if (!children) {
    return `<${componentName}\n${propsLines.join('\n')}\n/>`;
  }

  return `<${componentName}\n${propsLines.join('\n')}\n>\n  ${children}\n</${componentName}>`;
}

/**
 * Interactive component playground with live preview and code generation
 */
export function ComponentPlayground({
  component: Component,
  componentName,
  propConfig,
  defaultChildren = 'Example',
  showChildren = true,
  fixedProps = {},
  stateConfig,
}: PlaygroundProps) {
  const theme = useTheme();

  // Initialize state from defaults
  const initialState = useMemo(() => {
    const state: Record<string, any> = {};
    propConfig.forEach((prop) => {
      state[prop.name] = prop.default ?? (prop.type === 'boolean' ? false : prop.options?.[0]);
    });
    return state;
  }, [propConfig]);

  // Initialize controlled state from stateConfig
  const initialControlledState = useMemo(() => {
    if (!stateConfig) return {};
    const state: Record<string, any> = {};
    Object.entries(stateConfig).forEach(([propName, config]) => {
      state[propName] = config.initial;
    });
    return state;
  }, [stateConfig]);

  // Controlled state for interactive demos (e.g., Switch checked, Dialog open)
  const [controlledState, setControlledState] = useState<Record<string, any>>(initialControlledState);

  // Generate callbacks for controlled state
  const stateCallbacks = useMemo(() => {
    if (!stateConfig) return {};
    const callbacks: Record<string, (value?: any) => void> = {};
    Object.entries(stateConfig).forEach(([propName, config]) => {
      if (config.toggle) {
        // Toggle mode: callback takes no arguments, toggles boolean state
        callbacks[config.onChangeProp] = () => {
          setControlledState(prev => ({ ...prev, [propName]: !prev[propName] }));
        };
      } else {
        // Normal mode: callback receives new value
        callbacks[config.onChangeProp] = (value: any) => {
          setControlledState(prev => ({ ...prev, [propName]: value }));
        };
      }
    });
    return callbacks;
  }, [stateConfig]);

  const [props, setProps] = useState<Record<string, any>>(initialState);
  const [children, setChildren] = useState(
    typeof defaultChildren === 'string' ? defaultChildren : ''
  );
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const updateProp = (name: string, value: any) => {
    setProps((prev) => ({ ...prev, [name]: value }));
  };

  const resetToDefaults = () => {
    setProps(initialState);
    setChildren(typeof defaultChildren === 'string' ? defaultChildren : '');
    setControlledState(initialControlledState);
  };

  // Build defaults map from propConfig
  const defaults = useMemo(() => {
    const d: Record<string, any> = {};
    propConfig.forEach((prop) => {
      if (prop.default !== undefined) {
        d[prop.name] = prop.default;
      }
    });
    return d;
  }, [propConfig]);

  // Generate code string
  const codeString = generateCode(
    componentName,
    props,
    defaults,
    showChildren ? children : undefined
  );

  // Check if any props are theme-extensible
  const hasThemeExtensible = propConfig.some((p) => p.themeExtensible);

  // Build table data from propConfig
  const tableData = useMemo(() => {
    const data = propConfig.map((prop) => ({
      ...prop,
      id: prop.name,
    }));
    // Add children row if applicable
    if (showChildren) {
      data.push({
        id: 'children',
        name: 'children',
        type: 'select' as const,
        typeSignature: 'ReactNode',
        options: ['Click Me', 'Submit', 'Save', 'Cancel', 'Delete'],
        default: typeof defaultChildren === 'string' ? defaultChildren : 'Example',
      });
    }
    return data;
  }, [propConfig, showChildren, defaultChildren]);

  // Table columns
  const tableColumns: TableColumn<typeof tableData[0]>[] = useMemo(() => [
    {
      key: 'name',
      title: 'Prop',
      width: 100,
      align: 'left',
      render: (_: any, row: typeof tableData[0]) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text typography="body2" weight="medium" style={{ fontFamily: 'monospace' }}>
            {row.name}
          </Text>
          {row.themeExtensible && (
            <Text typography="caption" color="tertiary">*</Text>
          )}
        </View>
      ),
    },
    {
      key: 'type',
      title: 'Type',
      width: 300,
      align: 'left',
      render: (_: any, row: typeof tableData[0]) => (
        <View>
          <Text typography="caption" color="link" style={{ fontFamily: 'monospace' }}>
            {row.typeSignature || (row.type === 'boolean' ? 'boolean' : 'string')}
          </Text>
          {row.options && row.options.length <= 5 && (
            <Text typography="caption" color="tertiary" style={{ marginTop: 2 }}>
              {row.options.filter((o: string) => o !== 'none').slice(0, 4).join(', ')}
              {row.options.filter((o: string) => o !== 'none').length > 4 ? '...' : ''}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'value',
      title: 'Value',
      width: 150,
      align: 'left',
      render: (_: any, row: typeof tableData[0]) => {
        // Special handling for children row
        if (row.name === 'children') {
          return (
            <Select
              size="xs"
              value={children}
              onChange={setChildren}
              options={row.options?.map((opt: string) => ({ label: opt, value: opt })) || []}
            />
          );
        }
        if (row.type === 'select' && row.options) {
          return (
            <Select
              size="xs"
              value={props[row.name]}
              onChange={(value) => updateProp(row.name, value)}
              options={row.options.map((opt: string) => ({ label: opt, value: opt }))}
            />
          );
        }
        if (row.type === 'boolean') {
          return (
            <Select
              size="xs"
              value={props[row.name] ? 'true' : 'false'}
              onChange={(value) => updateProp(row.name, value === 'true')}
              options={[
                { label: 'true', value: 'true' },
                { label: 'false', value: 'false' },
              ]}
            />
          );
        }
        return null;
      },
    },
  ], [props, children, setChildren, updateProp]);

  // Convert icon string names to Icon components for rendering
  const getComponentProps = () => {
    const componentProps: Record<string, any> = {};
    Object.entries(props).forEach(([key, value]) => {
      if (value === 'none' || value === undefined) return;
      // Convert icon props to actual Icon components
      componentProps[key] = value;
    });
    return componentProps;
  };

  return (
    <View style={{ gap: 16 }}>
      <IconPreloader />

      {/* Single card with Props table + Preview side by side */}
      <Card type="outlined" style={{ padding: 0, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row' }}>
          {/* Props Table */}
          <View style={{ flex: 1 }}>
            <Table
              type="striped"
              columns={tableColumns}
              data={tableData}
              size="sm"
            />

            {/* Footer with reset */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.colors.surface.secondary,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border.primary,
                padding: 8,
                paddingHorizontal: 12,
              }}
            >
              {hasThemeExtensible ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text typography="caption" style={{ color: theme.colors.text.tertiary }}>
                    * Theme-extensible
                  </Text>
                  <div onClick={() => setHelpDialogOpen(true)} style={{ cursor: 'pointer' }}>
                    <Icon name="help-circle-outline" size={14} color={theme.colors.text.tertiary} />
                  </div>
                </View>
              ) : <View />}
              <div onClick={resetToDefaults} style={{ cursor: 'pointer' }}>
                <Text typography="body2" color="link">
                  Reset
                </Text>
              </div>
            </View>
          </View>

          {/* Preview Panel with Code below */}
          <View style={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeftWidth: 1, borderLeftColor: theme.colors.border.primary }}>
            <View
              style={{
                backgroundColor: theme.colors.surface.secondary,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border.primary,
                padding: 8,
                paddingHorizontal: 12,
              }}
            >
              <Text typography="body2" weight="semibold">Preview</Text>
            </View>
            <View
              backgroundColor='screen'
              style={{
                flex: 1,
                padding: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Component {...fixedProps} {...controlledState} {...stateCallbacks} {...getComponentProps()}>
                {showChildren ? children : defaultChildren}
              </Component>
            </View>
            {/* Code section with import and usage */}
            <View
              scrollable
              background="inverse-secondary"
              style={{
                borderTopWidth: 1,
                borderTopColor: theme.colors.border.primary,
              }}
            >
              {/* Import line */}
              <View
                padding="sm"
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <Text
                  typography="body2"
                  color="inverse"
                  style={{ fontFamily: 'monospace' }}
                >
                  {`import { ${componentName} } from '@idealyst/components';`}
                </Text>
              </View>
              {/* Code usage */}
              <View
                padding="sm"
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  height: 150,
                  overflow: 'hidden',
                }}
              >
                <Text
                  typography="body2"
                  color="inverse"
                  style={{
                    fontFamily: 'monospace',
                    whiteSpace: 'pre',
                    lineHeight: 18,
                    flex: 1,
                    overflow: 'hidden',
                  }}
                >
                  {codeString}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>

      {/* Fullscreen Code Dialog */}
      <Dialog
        open={codeDialogOpen}
        onClose={() => setCodeDialogOpen(false)}
        title="Generated Code"
      >
        <View
          background="inverse-secondary"
          radius="md"
          style={{
            minWidth: 400,
            maxWidth: 600,
            overflow: 'hidden',
          }}
        >
          {/* Import line */}
          <View
            padding="sm"
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <Text
              typography="body2"
              color="inverse"
              style={{ fontFamily: 'monospace' }}
            >
              {`import { ${componentName} } from '@idealyst/components';`}
            </Text>
            <div
              onClick={() => navigator.clipboard.writeText(`import { ${componentName} } from '@idealyst/components';`)}
              style={{ cursor: 'pointer', marginLeft: 8 }}
            >
              <Icon name="content-copy" size={16} color="inverse" />
            </div>
          </View>
          {/* Code usage */}
          <View
            padding="md"
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Text
              typography="body2"
              color="inverse"
              style={{
                fontFamily: 'monospace',
                whiteSpace: 'pre',
                lineHeight: 20,
                flex: 1,
              }}
            >
              {codeString}
            </Text>
            <div
              onClick={() => navigator.clipboard.writeText(codeString)}
              style={{ cursor: 'pointer', marginLeft: 8 }}
            >
              <Icon name="content-copy" size={16} color="inverse" />
            </div>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 8 }}>
          <Button
            type="outlined"
            size="sm"
            onPress={() => {
              const fullCode = `import { ${componentName} } from '@idealyst/components';\n\n${codeString}`;
              navigator.clipboard.writeText(fullCode);
            }}
          >
            Copy All
          </Button>
          <Button
            size="sm"
            onPress={() => setCodeDialogOpen(false)}
          >
            Close
          </Button>
        </View>
      </Dialog>

      {/* Help Dialog for Theme-extensible */}
      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        title="Theme-extensible Props"
      >
        <View style={{ maxWidth: 400 }}>
          <Text typography="body1" style={{ lineHeight: 22, marginBottom: 12 }}>
            Props marked with <Text weight="semibold">*</Text> are theme-extensible.
            This means their available values can be customized in your theme configuration.
          </Text>
          <Text typography="body1" style={{ lineHeight: 22, marginBottom: 12 }}>
            For example, you can add custom intents (like "brand" or "accent") or
            custom sizes beyond the defaults shown here.
          </Text>
          <Text typography="body2" color="tertiary" style={{ lineHeight: 20 }}>
            See the Theme documentation for details on extending these values.
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
          <Button
            size="sm"
            onPress={() => setHelpDialogOpen(false)}
          >
            Got it
          </Button>
        </View>
      </Dialog>
    </View>
  );
}

// Common icon options for components
const iconOptions = ['none', 'check', 'close', 'plus', 'minus', 'arrowRight', 'arrowLeft', 'email', 'lock', 'account', 'magnify', 'heart', 'star', 'home', 'cog', 'bell', 'send'];

// Pre-configured prop configs for common components
export const buttonPropConfig: PropConfig[] = [
  {
    name: 'type',
    type: 'select',
    options: ['contained', 'outlined', 'text'],
    default: 'contained',
    description: 'Visual style variant',
    typeSignature: 'ButtonType',
  },
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'primary',
    description: 'Semantic color scheme',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Button size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'gradient',
    type: 'select',
    options: ['none', 'darken', 'lighten'],
    default: 'none',
    description: 'Gradient overlay (contained only)',
    typeSignature: 'ButtonGradient',
  },
  {
    name: 'leftIcon',
    type: 'select',
    options: iconOptions,
    default: 'none',
    description: 'Icon on the left side',
    typeSignature: 'IconName | ReactNode',
  },
  {
    name: 'rightIcon',
    type: 'select',
    options: iconOptions,
    default: 'none',
    description: 'Icon on the right side',
    typeSignature: 'IconName | ReactNode',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: 'Disables interaction',
  },
];

export const inputPropConfig: PropConfig[] = [
  {
    name: 'type',
    type: 'select',
    options: ['outlined', 'filled', 'bare'],
    default: 'outlined',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
  },
  {
    name: 'intent',
    type: 'select',
    options: ['neutral', 'primary', 'success', 'error', 'warning'],
    default: 'neutral',
  },
  {
    name: 'inputType',
    type: 'select',
    options: ['text', 'email', 'password', 'number'],
    default: 'text',
  },
  {
    name: 'leftIcon',
    type: 'select',
    options: iconOptions,
    default: 'none',
  },
  {
    name: 'rightIcon',
    type: 'select',
    options: iconOptions,
    default: 'none',
  },
  {
    name: 'placeholder',
    type: 'select',
    options: ['Enter text...', 'Email address', 'Password', 'Search...', 'Username'],
    default: 'Enter text...',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
  },
  {
    name: 'hasError',
    type: 'boolean',
    default: false,
  },
];

export const chipPropConfig: PropConfig[] = [
  {
    name: 'type',
    type: 'select',
    options: ['filled', 'outlined', 'soft'],
    default: 'filled',
  },
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'primary',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
  },
  {
    name: 'leftIcon',
    type: 'select',
    options: iconOptions,
    default: 'none',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
  },
];

export const cardPropConfig: PropConfig[] = [
  {
    name: 'variant',
    type: 'select',
    options: ['elevated', 'outlined', 'filled'],
    default: 'elevated',
  },
];

export const badgePropConfig: PropConfig[] = [
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'primary',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
  },
];

export const alertPropConfig: PropConfig[] = [
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'primary',
  },
  {
    name: 'variant',
    type: 'select',
    options: ['filled', 'outlined', 'soft'],
    default: 'filled',
  },
  {
    name: 'icon',
    type: 'select',
    options: iconOptions,
    default: 'none',
  },
  {
    name: 'closable',
    type: 'boolean',
    default: false,
  },
];

export const switchPropConfig: PropConfig[] = [
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'primary',
    description: 'Color when switch is on',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Switch size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: 'Disables interaction',
  },
];

export const checkboxPropConfig: PropConfig[] = [
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'primary',
    description: 'Color when checked',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Checkbox size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'checked',
    type: 'boolean',
    default: false,
    description: 'Whether the checkbox is checked',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: 'Disables interaction',
  },
];

export const selectPropConfig: PropConfig[] = [
  {
    name: 'type',
    type: 'select',
    options: ['outlined', 'filled'],
    default: 'outlined',
    description: 'Visual style variant',
    typeSignature: 'SelectType',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Select size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'intent',
    type: 'select',
    options: ['neutral', 'primary', 'success', 'error', 'warning'],
    default: 'neutral',
    description: 'Focus/validation color',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: 'Disables interaction',
  },
  {
    name: 'hasError',
    type: 'boolean',
    default: false,
    description: 'Show error state',
  },
];

export const sliderPropConfig: PropConfig[] = [
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'primary',
    description: 'Slider track color',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Slider size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: 'Disables interaction',
  },
];

export const progressPropConfig: PropConfig[] = [
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'primary',
    description: 'Progress bar color',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Progress bar height',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'value',
    type: 'select',
    options: ['0', '25', '50', '75', '100'],
    default: '50',
    description: 'Progress percentage (0-100)',
    typeSignature: 'number',
  },
];

export const textPropConfig: PropConfig[] = [
  {
    name: 'typography',
    type: 'select',
    options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption', 'overline'],
    default: 'body1',
    description: 'Typography variant',
    typeSignature: 'Typography',
    themeExtensible: true,
  },
  {
    name: 'weight',
    type: 'select',
    options: ['light', 'normal', 'medium', 'semibold', 'bold'],
    default: 'normal',
    description: 'Font weight',
    typeSignature: 'TextWeightVariant',
  },
  {
    name: 'color',
    type: 'select',
    options: ['primary', 'secondary', 'tertiary', 'inverse', 'link', 'error', 'success', 'warning'],
    default: 'primary',
    description: 'Text color',
    typeSignature: 'Text',
    themeExtensible: true,
  },
  {
    name: 'align',
    type: 'select',
    options: ['left', 'center', 'right'],
    default: 'left',
    description: 'Text alignment',
    typeSignature: 'TextAlignVariant',
  },
];

export const iconPropConfig: PropConfig[] = [
  {
    name: 'name',
    type: 'select',
    options: ['home', 'cog', 'account', 'bell', 'heart', 'star', 'check', 'close', 'plus', 'minus', 'magnify', 'email', 'lock', 'send'],
    default: 'home',
    description: 'Icon name',
    typeSignature: 'IconName',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Icon size',
    typeSignature: 'Size | number',
    themeExtensible: true,
  },
  {
    name: 'intent',
    type: 'select',
    options: ['none', 'primary', 'neutral', 'success', 'error', 'warning'],
    default: 'none',
    description: 'Icon color intent',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
];

export const avatarPropConfig: PropConfig[] = [
  {
    name: 'size',
    type: 'select',
    options: ['sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Avatar size',
    typeSignature: 'AvatarSizeVariant',
  },
  {
    name: 'shape',
    type: 'select',
    options: ['circle', 'square'],
    default: 'circle',
    description: 'Avatar shape',
    typeSignature: 'AvatarShapeVariant',
  },
  {
    name: 'fallback',
    type: 'select',
    options: ['JD', 'AB', 'XY', 'MN'],
    default: 'JD',
    description: 'Fallback initials',
    typeSignature: 'string',
  },
];

export const dividerPropConfig: PropConfig[] = [
  {
    name: 'orientation',
    type: 'select',
    options: ['horizontal', 'vertical'],
    default: 'horizontal',
    description: 'Divider orientation',
    typeSignature: 'DividerOrientationVariant',
  },
  {
    name: 'type',
    type: 'select',
    options: ['solid', 'dashed', 'dotted'],
    default: 'solid',
    description: 'Line style',
    typeSignature: 'DividerType',
  },
  {
    name: 'thickness',
    type: 'select',
    options: ['thin', 'md', 'thick'],
    default: 'thin',
    description: 'Line thickness',
    typeSignature: 'DividerThicknessVariant',
  },
  {
    name: 'spacing',
    type: 'select',
    options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Spacing around divider',
    typeSignature: 'DividerSpacingVariant',
    themeExtensible: true,
  },
];

export const textAreaPropConfig: PropConfig[] = [
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Text area size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'intent',
    type: 'select',
    options: ['neutral', 'primary', 'success', 'error', 'warning'],
    default: 'neutral',
    description: 'Intent color',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
  {
    name: 'placeholder',
    type: 'select',
    options: ['Enter description...', 'Write your message...', 'Add notes...'],
    default: 'Enter description...',
    description: 'Placeholder text',
    typeSignature: 'string',
  },
  {
    name: 'rows',
    type: 'select',
    options: ['2', '3', '4', '5'],
    default: '3',
    description: 'Number of visible rows',
    typeSignature: 'number',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: 'Disables interaction',
  },
];

export const radioButtonPropConfig: PropConfig[] = [
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'primary',
    description: 'Color when selected',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Radio button size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'checked',
    type: 'boolean',
    default: false,
    description: 'Whether the radio is selected',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: 'Disables interaction',
  },
];

export const dialogPropConfig: PropConfig[] = [
  {
    name: 'size',
    type: 'select',
    options: ['sm', 'md', 'lg', 'fullscreen'],
    default: 'md',
    description: 'Dialog size',
    typeSignature: 'DialogSizeVariant',
  },
  {
    name: 'type',
    type: 'select',
    options: ['default', 'alert', 'confirmation'],
    default: 'default',
    description: 'Dialog type',
    typeSignature: 'DialogType',
  },
  {
    name: 'showCloseButton',
    type: 'boolean',
    default: true,
    description: 'Show close button',
  },
  {
    name: 'closeOnBackdropClick',
    type: 'boolean',
    default: true,
    description: 'Close on backdrop click',
  },
];

export const tooltipPropConfig: PropConfig[] = [
  {
    name: 'placement',
    type: 'select',
    options: ['top', 'bottom', 'left', 'right'],
    default: 'top',
    description: 'Tooltip placement',
    typeSignature: 'TooltipPlacement',
  },
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral', 'success', 'error', 'warning'],
    default: 'neutral',
    description: 'Tooltip color',
    typeSignature: 'Intent',
    themeExtensible: true,
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Tooltip size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
];

export const skeletonPropConfig: PropConfig[] = [
  {
    name: 'shape',
    type: 'select',
    options: ['rectangle', 'circle', 'rounded'],
    default: 'rectangle',
    description: 'Skeleton shape',
    typeSignature: 'SkeletonShape',
  },
  {
    name: 'animation',
    type: 'select',
    options: ['pulse', 'wave', 'none'],
    default: 'pulse',
    description: 'Animation type',
    typeSignature: 'SkeletonAnimation',
  },
  {
    name: 'width',
    type: 'select',
    options: ['50', '100', '150', '200'],
    default: '100',
    description: 'Width in pixels',
    typeSignature: 'number | string',
  },
  {
    name: 'height',
    type: 'select',
    options: ['20', '40', '60', '80'],
    default: '20',
    description: 'Height in pixels',
    typeSignature: 'number | string',
  },
];

export const tablePropConfig: PropConfig[] = [
  {
    name: 'type',
    type: 'select',
    options: ['standard', 'bordered', 'striped'],
    default: 'standard',
    description: 'Table style type',
    typeSignature: 'TableType',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Table size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'stickyHeader',
    type: 'boolean',
    default: false,
    description: 'Keep header fixed when scrolling',
  },
];

export const listPropConfig: PropConfig[] = [
  {
    name: 'type',
    type: 'select',
    options: ['default', 'bordered', 'divided'],
    default: 'default',
    description: 'List style type',
    typeSignature: 'ListType',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'List item size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'scrollable',
    type: 'boolean',
    default: false,
    description: 'Enable scroll on overflow',
  },
];

export const menuPropConfig: PropConfig[] = [
  {
    name: 'placement',
    type: 'select',
    options: ['top', 'bottom', 'left', 'right', 'bottom-start', 'bottom-end'],
    default: 'bottom-start',
    description: 'Menu placement',
    typeSignature: 'MenuPlacement',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Menu size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'closeOnSelection',
    type: 'boolean',
    default: true,
    description: 'Close menu on item selection',
  },
];

export const breadcrumbPropConfig: PropConfig[] = [
  {
    name: 'intent',
    type: 'select',
    options: ['primary', 'neutral'],
    default: 'primary',
    description: 'Link color intent',
    typeSignature: 'BreadcrumbIntentVariant',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Breadcrumb text size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'responsive',
    type: 'boolean',
    default: false,
    description: 'Enable responsive collapsing',
  },
];

export const accordionPropConfig: PropConfig[] = [
  {
    name: 'type',
    type: 'select',
    options: ['standard', 'separated', 'bordered'],
    default: 'standard',
    description: 'Accordion style type',
    typeSignature: 'AccordionType',
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Accordion size',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'allowMultiple',
    type: 'boolean',
    default: false,
    description: 'Allow multiple items expanded',
  },
];

export const linkPropConfig: PropConfig[] = [
  {
    name: 'to',
    type: 'select',
    options: ['/home', '/about', '/contact', '/settings'],
    default: '/home',
    description: 'Navigation destination',
    typeSignature: 'string',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: 'Disables the link',
  },
];

export const gridPropConfig: PropConfig[] = [
  {
    name: 'columns',
    type: 'select',
    options: ['1', '2', '3', '4', '6'],
    default: '2',
    description: 'Number of columns (also supports responsive object)',
    typeSignature: 'number | Partial<Record<Breakpoint, number>>',
  },
  {
    name: 'gap',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    description: 'Gap between grid items',
    typeSignature: 'Size',
    themeExtensible: true,
  },
  {
    name: 'padding',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: undefined,
    description: 'Padding on all sides',
    typeSignature: 'Size',
    themeExtensible: true,
  },
];

import React, { useState, useMemo, ReactNode } from 'react';
import { View, Text, Card, Select, Icon, Button, Dialog } from '@idealyst/components';

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
}: PlaygroundProps) {
  // Initialize state from defaults
  const initialState = useMemo(() => {
    const state: Record<string, any> = {};
    propConfig.forEach((prop) => {
      state[prop.name] = prop.default ?? (prop.type === 'boolean' ? false : prop.options?.[0]);
    });
    return state;
  }, [propConfig]);

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

  // Convert icon string names to Icon components for rendering
  const getComponentProps = () => {
    const componentProps: Record<string, any> = {};
    Object.entries(props).forEach(([key, value]) => {
      if (value === 'none' || value === undefined) return;
      // Convert icon props to actual Icon components
      if ((key === 'leftIcon' || key === 'rightIcon') && typeof value === 'string') {
        componentProps[key] = <Icon name={value as any} />;
      } else {
        componentProps[key] = value;
      }
    });
    return componentProps;
  };

  return (
    <View style={{ gap: 16 }}>
      <IconPreloader />

      {/* Main layout: Props table + Preview side by side */}
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'stretch' }}>
        {/* Props Table */}
        <Card variant="outlined" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#f8f9fa',
              borderBottomWidth: 1,
              borderBottomColor: '#e9ecef',
              padding: 8,
              paddingHorizontal: 12,
            }}
          >
            <View style={{ flex: 3 }}>
              <Text typography="body2" weight="semibold">Prop</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text typography="body2" weight="semibold">Type</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text typography="body2" weight="semibold">Value</Text>
            </View>
          </View>

          {/* Prop Rows */}
          {propConfig.map((prop, index) => (
            <View
              key={prop.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 8,
                paddingHorizontal: 12,
                borderBottomWidth: index < propConfig.length - 1 ? 1 : 0,
                borderBottomColor: '#e9ecef',
              }}
            >
              <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text typography="body2" weight="medium" style={{ fontFamily: 'monospace' }}>
                  {prop.name}
                </Text>
                {prop.themeExtensible && (
                  <Text typography="caption" style={{ color: '#868e96' }}>*</Text>
                )}
              </View>
              <View style={{ flex: 3 }}>
                <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6741d9' }}>
                  {prop.typeSignature || (prop.type === 'boolean' ? 'boolean' : 'string')}
                </Text>
                {prop.options && prop.options.length <= 5 && (
                  <Text typography="caption" style={{ color: '#868e96', marginTop: 2 }}>
                    {prop.options.filter(o => o !== 'none').slice(0, 4).join(', ')}
                    {prop.options.filter(o => o !== 'none').length > 4 ? '...' : ''}
                  </Text>
                )}
              </View>
              <View style={{ flex: 2 }}>
                {prop.type === 'select' && prop.options && (
                  <Select
                    size="sm"
                    value={props[prop.name]}
                    onValueChange={(value) => updateProp(prop.name, value)}
                    options={prop.options.map((opt) => ({ label: opt, value: opt }))}
                  />
                )}
                {prop.type === 'boolean' && (
                  <Select
                    size="sm"
                    value={props[prop.name] ? 'true' : 'false'}
                    onValueChange={(value) => updateProp(prop.name, value === 'true')}
                    options={[
                      { label: 'true', value: 'true' },
                      { label: 'false', value: 'false' },
                    ]}
                  />
                )}
              </View>
            </View>
          ))}

          {/* Children row if applicable */}
          {showChildren && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 8,
                paddingHorizontal: 12,
                borderTopWidth: 1,
                borderTopColor: '#e9ecef',
              }}
            >
              <View style={{ flex: 3 }}>
                <Text typography="body2" weight="medium" style={{ fontFamily: 'monospace' }}>
                  children
                </Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6741d9' }}>
                  ReactNode
                </Text>
              </View>
              <View style={{ flex: 2 }}>
                <Select
                  size="sm"
                  value={children}
                  onValueChange={setChildren}
                  options={[
                    { label: 'Click Me', value: 'Click Me' },
                    { label: 'Submit', value: 'Submit' },
                    { label: 'Save', value: 'Save' },
                    { label: 'Cancel', value: 'Cancel' },
                    { label: 'Delete', value: 'Delete' },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Footer with reset */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              borderTopWidth: 1,
              borderTopColor: '#e9ecef',
              padding: 8,
              paddingHorizontal: 12,
            }}
          >
            {hasThemeExtensible ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text typography="caption" style={{ color: '#868e96' }}>
                  * Theme-extensible
                </Text>
                <div onClick={() => setHelpDialogOpen(true)} style={{ cursor: 'pointer' }}>
                  <Icon name="help-circle-outline" size={14} color="#868e96" />
                </div>
              </View>
            ) : <View />}
            <div onClick={resetToDefaults} style={{ cursor: 'pointer' }}>
              <Text typography="body2" style={{ color: '#228be6' }}>
                Reset
              </Text>
            </div>
          </View>
        </Card>

        {/* Preview Panel with Code below */}
        <Card variant="outlined" style={{ flex: 1, padding: 0, overflow: 'hidden', minWidth: 280, display: 'flex', flexDirection: 'column' }}>
          <View
            style={{
              backgroundColor: '#f8f9fa',
              borderBottomWidth: 1,
              borderBottomColor: '#e9ecef',
              padding: 8,
              paddingHorizontal: 12,
            }}
          >
            <Text typography="body2" weight="semibold">Preview</Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
            }}
          >
            <Component {...getComponentProps()}>
              {showChildren ? children : defaultChildren}
            </Component>
          </View>
          {/* Code below preview - static height */}
          <View
            style={{
              backgroundColor: '#1e1e1e',
              padding: 12,
              borderTopWidth: 1,
              borderTopColor: '#e9ecef',
              height: 100,
              overflow: 'hidden',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text
                typography="body2"
                style={{
                  fontFamily: 'monospace',
                  color: '#d4d4d4',
                  whiteSpace: 'pre',
                  lineHeight: 18,
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                {codeString}
              </Text>
              <div
                onClick={() => setCodeDialogOpen(true)}
                style={{ cursor: 'pointer', marginLeft: 8 }}
              >
                <Icon name="fullscreen" color="#888" />
              </div>
            </View>
          </View>
        </Card>
      </View>

      {/* Fullscreen Code Dialog */}
      <Dialog
        open={codeDialogOpen}
        onClose={() => setCodeDialogOpen(false)}
        title="Generated Code"
      >
        <View
          style={{
            backgroundColor: '#1e1e1e',
            padding: 20,
            borderRadius: 8,
            minWidth: 400,
            maxWidth: 600,
          }}
        >
          <Text
            typography="body2"
            style={{
              fontFamily: 'monospace',
              color: '#d4d4d4',
              whiteSpace: 'pre',
              lineHeight: 20,
            }}
          >
            {codeString}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 8 }}>
          <Button
            type="outlined"
            size="sm"
            onPress={() => {
              navigator.clipboard.writeText(codeString);
            }}
          >
            Copy
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
          <Text typography="body2" style={{ color: '#666666', lineHeight: 20 }}>
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
  },
  {
    name: 'size',
    type: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
  },
];

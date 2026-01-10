import * as babel from '@babel/core';
import * as path from 'path';

// Import the plugin
const plugin = require('../web.js');

/**
 * Helper to transform code and extract detected icon names
 */
function transform(code: string, options = {}, filename = 'test.tsx') {
  const result = babel.transformSync(code, {
    filename,
    presets: [
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [[plugin, options]],
    babelrc: false,
    configFile: false,
  });
  return result;
}

/**
 * Extract icon names that were detected by checking the generated code
 */
function getDetectedIcons(transformedCode: string | null | undefined): string[] {
  if (!transformedCode) return [];

  // Look for the registerMany call and extract icon names
  // Pattern: IconRegistry.registerMany({ "icon-name": _mdiIconName, ... })
  // Note: Babel outputs double quotes
  const match = transformedCode.match(/registerMany\(\{([^}]+)\}\)/);
  if (!match) return [];

  // Match both single and double quoted strings
  const iconMatches = match[1].matchAll(/["']([^"']+)["']:/g);
  return Array.from(iconMatches).map(m => m[1]);
}

describe('MDI Icon Registry Babel Plugin', () => {
  describe('JSX String Literal Detection', () => {
    it('detects icon name in Icon component', () => {
      const code = `<Icon name="home" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('home');
    });

    it('detects icon name in IconSvg component', () => {
      const code = `<IconSvg name="account" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('account');
    });

    it('detects icon name with mdi: prefix', () => {
      const code = `<Icon name="mdi:home" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('home');
    });

    it('detects icon in JSX expression container', () => {
      const code = `<Icon name={"cog"} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('cog');
    });

    it('detects kebab-case icon names', () => {
      const code = `<Icon name="account-circle" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('account-circle');
    });
  });

  describe('Button Component Icon Props', () => {
    it('detects leftIcon prop', () => {
      const code = `<Button leftIcon="chevron-left">Back</Button>`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('chevron-left');
    });

    it('detects rightIcon prop', () => {
      const code = `<Button rightIcon="chevron-right">Next</Button>`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('chevron-right');
    });

    it('detects both leftIcon and rightIcon', () => {
      const code = `<Button leftIcon="arrow-left" rightIcon="arrow-right">Navigate</Button>`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('arrow-left');
      expect(icons).toContain('arrow-right');
    });
  });

  describe('Input Component Icon Props', () => {
    it('detects leftIcon in Input', () => {
      const code = `<Input leftIcon="magnify" placeholder="Search..." />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('magnify');
    });

    it('detects rightIcon in Input', () => {
      const code = `<Input rightIcon="close" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('close');
    });
  });

  describe('Other Components with Icon Props', () => {
    it('detects icon in Badge', () => {
      const code = `<Badge icon="check" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('check');
    });

    it('detects icon in Alert', () => {
      const code = `<Alert icon="alert-circle" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('alert-circle');
    });

    it('detects icon and deleteIcon in Chip', () => {
      const code = `<Chip icon="tag" deleteIcon="close-circle" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('tag');
      expect(icons).toContain('close-circle');
    });

    it('detects icon in MenuItem', () => {
      const code = `<MenuItem icon="cog">Settings</MenuItem>`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('cog');
    });

    it('detects leading and trailing in ListItem', () => {
      const code = `<ListItem leading="account" trailing="chevron-right" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('account');
      expect(icons).toContain('chevron-right');
    });
  });

  describe('Ternary Expression Detection', () => {
    it('detects both icons in ternary expression in props', () => {
      const code = `<Icon name={isVisible ? "eye" : "eye-off"} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('eye');
      expect(icons).toContain('eye-off');
    });

    it('detects icons in ternary with different conditions', () => {
      const code = `<Icon name={hasError ? "alert" : "check"} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('alert');
      expect(icons).toContain('check');
    });
  });

  describe('Logical Expression Detection', () => {
    it('detects icon in logical AND expression', () => {
      const code = `<Icon name={hasIcon && "star"} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('star');
    });

    it('detects icon in logical OR expression', () => {
      const code = `<Icon name={customIcon || "star"} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // This tests the right side of OR
      expect(icons).toContain('star');
    });
  });

  describe('Variable Reference Detection', () => {
    it('detects icon from variable with string literal', () => {
      const code = `
        const iconName = "home";
        <Icon name={iconName} />
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('home');
    });

    it('detects both icons from variable with ternary expression', () => {
      const code = `
        const iconName = isPasswordVisible ? 'eye-off' : 'eye';
        <IconSvg name={iconName} />
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('eye');
      expect(icons).toContain('eye-off');
    });

    it('detects icon from variable with logical expression', () => {
      const code = `
        const iconName = showIcon && 'star';
        <Icon name={iconName} />
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('star');
    });

    it('detects icons from multiple variable assignments', () => {
      const code = `
        const icon1 = "home";
        const icon2 = isActive ? "check" : "close";
        <>
          <Icon name={icon1} />
          <Icon name={icon2} />
        </>
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('home');
      expect(icons).toContain('check');
      expect(icons).toContain('close');
    });
  });

  describe('Object Property Detection', () => {
    it('detects icon in object literal', () => {
      const code = `
        const menuItem = { icon: "home", label: "Home" };
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('home');
    });

    it('detects leftIcon and rightIcon in object', () => {
      const code = `
        const buttonConfig = {
          leftIcon: "arrow-left",
          rightIcon: "arrow-right",
        };
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('arrow-left');
      expect(icons).toContain('arrow-right');
    });

    it('detects leading and trailing in object', () => {
      const code = `
        const listItemConfig = {
          leading: "account",
          trailing: "chevron-right",
        };
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('account');
      expect(icons).toContain('chevron-right');
    });

    it('detects icons in array of objects', () => {
      const code = `
        const menuItems = [
          { icon: "home", label: "Home" },
          { icon: "cog", label: "Settings" },
          { icon: "account", label: "Profile" },
        ];
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('home');
      expect(icons).toContain('cog');
      expect(icons).toContain('account');
    });
  });

  describe('Config Icons Option', () => {
    it('includes icons from config option', () => {
      const code = `const x = 1;`; // No icon usage in code
      const result = transform(code, { icons: ['star', 'heart'] });
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('star');
      expect(icons).toContain('heart');
    });

    it('combines config icons with detected icons', () => {
      const code = `<Icon name="home" />`;
      const result = transform(code, { icons: ['star'] });
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('home');
      expect(icons).toContain('star');
    });
  });

  describe('Multiple Icons in Same File', () => {
    it('deduplicates repeated icon names', () => {
      const code = `
        <>
          <Icon name="home" />
          <Icon name="home" />
          <Button leftIcon="home">Go Home</Button>
        </>
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // Should only appear once
      expect(icons.filter(i => i === 'home')).toHaveLength(1);
    });

    it('collects all unique icons from complex component', () => {
      const code = `
        function MyComponent({ isEditing }) {
          const statusIcon = isEditing ? "pencil" : "check";
          return (
            <div>
              <Button leftIcon="arrow-left" rightIcon="arrow-right">Navigate</Button>
              <Input leftIcon="magnify" rightIcon="close" />
              <Icon name={statusIcon} />
              <Alert icon="information" />
            </div>
          );
        }
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('arrow-left');
      expect(icons).toContain('arrow-right');
      expect(icons).toContain('magnify');
      expect(icons).toContain('close');
      expect(icons).toContain('pencil');
      expect(icons).toContain('check');
      expect(icons).toContain('information');
    });
  });

  describe('Cases That Should NOT Be Detected', () => {
    it('does not detect icons for non-icon components', () => {
      const code = `<div name="home" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).not.toContain('home');
    });

    it('does not detect non-icon props', () => {
      const code = `<Icon size="large" color="red" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toHaveLength(0);
    });

    it('does not detect icons with invalid characters', () => {
      const code = `<Icon name="home@invalid" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).not.toContain('home@invalid');
    });

    it('does not detect dynamic template literals', () => {
      const code = '<Icon name={`icon-${dynamicPart}`} />';
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // Dynamic template literals cannot be statically analyzed
      expect(icons).toHaveLength(0);
    });

    it('does not detect icons from function calls', () => {
      const code = `<Icon name={getIconName()} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // Function return values cannot be statically analyzed
      expect(icons).toHaveLength(0);
    });

    it('does not detect icons from complex expressions', () => {
      const code = `<Icon name={icons[currentIndex]} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // Array access cannot be statically analyzed
      expect(icons).toHaveLength(0);
    });

    it('does not detect icons from object member access', () => {
      const code = `<Icon name={config.iconName} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // Object property access cannot be statically analyzed
      expect(icons).toHaveLength(0);
    });

    it('does not detect non-icon object properties', () => {
      const code = `
        const config = {
          title: "home",
          description: "star",
        };
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // title and description are not icon props
      expect(icons).not.toContain('home');
      expect(icons).not.toContain('star');
    });

    it('does not detect text children as icon names', () => {
      const code = `<Text>eye</Text>`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // Text content should not be detected as icons
      expect(icons).not.toContain('eye');
    });

    it('does not detect icon-like strings in other props', () => {
      const code = `
        <Button title="home" aria-label="eye">Click me</Button>
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // title and aria-label are not icon props
      expect(icons).not.toContain('home');
      expect(icons).not.toContain('eye');
    });

    it('does not detect icon names in className or style props', () => {
      const code = `
        <div className="icon-home" style={{ icon: "star" }}>
          <span data-icon="account">Content</span>
        </div>
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // className values and data attributes should not be detected
      expect(icons).not.toContain('home');
      expect(icons).not.toContain('account');
      // Note: style.icon might be detected by ObjectProperty visitor - that's intentional
    });

    it('does not detect string literals in JSX text content', () => {
      const code = `
        <View>
          <Text>The eye icon shows visibility</Text>
          <Text>Click home to go back</Text>
        </View>
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).not.toContain('eye');
      expect(icons).not.toContain('home');
    });

    it('does not detect icons from string concatenation', () => {
      const code = `<Icon name={"home" + "-outline"} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // Binary expression (string concat) cannot be statically analyzed
      expect(icons).not.toContain('home');
      expect(icons).not.toContain('home-outline');
    });

    it('does not inject code when no icons are found', () => {
      const code = `const x = 1 + 2;`;
      const result = transform(code);

      // Should not have IconRegistry import or registerMany call
      expect(result?.code).not.toContain('IconRegistry');
      expect(result?.code).not.toContain('registerMany');
      expect(result?.code).not.toContain('@mdi/js');
    });

    it('does not detect invalid icon names that are not in @mdi/js', () => {
      const code = `<Icon name="definitely-not-a-real-mdi-icon-xyz123" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // Invalid icon names should be filtered out during validation
      expect(icons).not.toContain('definitely-not-a-real-mdi-icon-xyz123');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty icon name gracefully', () => {
      const code = `<Icon name="" />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toHaveLength(0);
    });

    it('handles null-like values gracefully', () => {
      const code = `<Icon name={null} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toHaveLength(0);
    });

    it('handles spread props without crashing', () => {
      const code = `<Icon {...iconProps} />`;
      const result = transform(code);

      // Should not crash, just not detect any icons
      expect(result?.code).toBeDefined();
    });

    it('handles nested ternary expressions', () => {
      const code = `<Icon name={a ? "home" : b ? "settings" : "account"} />`;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      // Should at least detect the top-level branches
      expect(icons).toContain('home');
      // Nested ternary may or may not be fully detected depending on implementation
    });

    it('preserves original code functionality', () => {
      const code = `
        const MyComponent = () => {
          const [visible, setVisible] = useState(false);
          return <Icon name="home" onClick={() => setVisible(!visible)} />;
        };
      `;
      const result = transform(code);

      // Original code should still be present
      expect(result?.code).toContain('useState');
      expect(result?.code).toContain('setVisible');
    });
  });

  describe('Real-World Input Password Toggle Pattern', () => {
    it('detects eye icons from password toggle pattern', () => {
      // This is the actual pattern used in Input.web.tsx
      const code = `
        const renderPasswordToggleIcon = () => {
          const iconName = isPasswordVisible ? 'eye-off' : 'eye';
          return (
            <IconSvg
              name={iconName}
              aria-label={iconName}
            />
          );
        };
      `;
      const result = transform(code);
      const icons = getDetectedIcons(result?.code);

      expect(icons).toContain('eye');
      expect(icons).toContain('eye-off');
    });
  });
});

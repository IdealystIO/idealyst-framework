# MDI Auto-Import Babel Plugin

Automatically imports Material Design Icons for web builds and transforms Icon components to use the imported paths.

## Features

### 1. Context-Aware String Replacement
The plugin only transforms strings that are actually used with the `Icon` component. This prevents false positives on common words like "home", "account", etc.

```jsx
// ✅ WILL transform - used with Icon
const iconName = "home";
<Icon name={iconName} />

// ❌ WON'T transform - not used with Icon
const pageName = "home";
<div>{pageName}</div>
```

### 2. Namespace Prefix Support
Use the `mdi:` prefix to explicitly mark a string as an icon name. This guarantees transformation even in complex scenarios.

```jsx
// Always transforms, even in complex expressions
const icon = "mdi:home";
<Icon name={icon} />

// Works with conditionals
<Icon name={showMenu ? "mdi:menu" : "mdi:close"} />
```

### 3. Variable Tracking with Scope Analysis
The plugin follows variables back to their declarations to determine if they contain icon names.

```jsx
// Plugin tracks that iconName is used with Icon
const iconName = "account";  // ✅ Will transform
<Icon name={iconName} />

// Plugin knows this is unrelated
const userName = "account";  // ❌ Won't transform
<div>{userName}</div>
```

### 4. Manifest Support
Add frequently-used icons to a manifest file to ensure they're always available:

```json
{
  "icons": ["home", "menu", "close", "check", "alert"]
}
```

Icons in the manifest are always imported, even if not statically analyzable.

## Usage

### Direct String Literals
The simplest case - just use the icon name directly:

```jsx
<Icon name="home" size="md" />
```

**Transforms to:**
```jsx
import { mdiHome as _mdiHome } from '@mdi/js';
<Icon path={_mdiHome} size="md" />
```

### Variables
Use variables for dynamic icons:

```jsx
const iconName = "account";
<Icon name={iconName} size="md" />
```

**The plugin will:**
1. Detect that `iconName` is used with `Icon`
2. Import `mdiAccount`
3. Transform the component

### Namespace Prefix (Recommended for Dynamic Cases)
For maximum reliability, especially with computed values:

```jsx
const iconName = "mdi:star";
<Icon name={iconName} size="md" />
```

The `mdi:` prefix guarantees the string will be recognized as an icon name.

### Conditional Expressions
```jsx
<Icon name={isActive ? "check" : "close"} size="md" />
```

**The plugin will:**
1. Import both `mdiCheck` and `mdiClose`
2. Keep the component as-is (since there are multiple possible icons)

To transform conditionals, use namespace prefixes:
```jsx
<Icon name={isActive ? "mdi:check" : "mdi:close"} size="md" />
```

### Function Returns
For function calls that return icon names, add them to the manifest:

```jsx
// icons.manifest.json
{
  "icons": ["file", "folder", "document"]
}

// Your code
function getFileIcon(type) {
  return type === 'dir' ? 'folder' : 'file';
}

<Icon name={getFileIcon(fileType)} />  // Icons pre-imported from manifest
```

## Configuration

### Plugin Options

```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['@idealyst/components/plugin/web', {
      debug: false,  // Enable debug logging
      manifestPath: './icons.manifest.json'  // Path to icon manifest
    }]
  ]
};
```

### Manifest File Format

```json
{
  "icons": [
    "home",
    "menu",
    "close",
    "account",
    "settings"
  ]
}
```

## How It Works

### First Pass: Variable Tracking
1. Scan all `<Icon>` components in the file
2. Track any variables used in the `name` prop
3. Mark these variables as "icon-related"

### Second Pass: Transformation
1. For each `<Icon>` component:
   - Extract icon names from the `name` prop
   - Handle direct strings, variables, conditionals, etc.
   - Import the required MDI icons
   - Transform `name="icon"` to `path={_mdiIcon}`

2. For each string literal:
   - Check if it's icon-related (used with Icon, has `mdi:` prefix, or in manifest)
   - If yes, import the icon
   - Context-aware: only transforms Icon-related strings

### Third Pass: Add Imports
- Add all collected icon imports from `@mdi/js`
- Add `MdiIcon` import from `@mdi/react` if needed

## Best Practices

### ✅ DO

```jsx
// Use direct strings when possible
<Icon name="home" />

// Use namespace prefix for dynamic icons
const icon = "mdi:account";
<Icon name={icon} />

// Add common icons to manifest
// icons.manifest.json: { "icons": ["home", "menu"] }

// Use variables for clarity
const deleteIcon = "delete";
<Icon name={deleteIcon} />
```

### ❌ DON'T

```jsx
// Don't rely on transformation for computed strings
<Icon name={`icon-${type}`} />  // Won't work

// Don't use common words without context
const home = "home";  // If not used with Icon, won't transform
<SomeOtherComponent name={home} />

// Don't use complex expressions without namespace
<Icon name={getIcon()} />  // Add to manifest instead
```

## Troubleshooting

### Icon not transforming?
1. Check if the string is actually used with `<Icon name={...} />`
2. Try adding `mdi:` prefix: `"mdi:home"`
3. Add the icon to `icons.manifest.json`
4. Enable debug mode to see what the plugin is doing

### False positives?
This should be rare with the enhanced plugin, but if it happens:
1. Ensure the variable is not used with `Icon`
2. Report it as a bug with the code example

### Getting warnings about dynamic expressions?
Add the possible icon names to the manifest file.

## Migration from Old Plugin

The enhanced plugin is backwards compatible. Existing code will continue to work.

New features you can now use:
- Variables with icon names (without manifest)
- Namespace prefix for explicit marking
- Better handling of common words

## Examples

See `test-cases.jsx` for comprehensive examples of all supported patterns.

## Technical Details

### Icon Name Format
- Input: `"home"`, `"account-circle"`, `"chevron-right"`
- Output: `mdiHome`, `mdiAccountCircle`, `mdiChevronRight`

The plugin converts kebab-case and snake_case to PascalCase and adds the `mdi` prefix.

### Scope Analysis
Uses Babel's scope API to:
- Track variable bindings
- Follow references to declarations
- Determine if a variable is icon-related

### Performance
- Single-pass analysis per file
- Minimal overhead during build
- Only processes files that import Icon component

## Contributing

To test changes to the plugin:
1. Edit `packages/components/plugin/web.js`
2. Run a build: `yarn build`
3. Check the transformed output in `dist/`

Enable debug mode to see detailed logs:
```javascript
{
  debug: true
}
```

# @idealyst/mcp-server

> Model Context Protocol server for the Idealyst Framework

Provides AI assistants like Claude Code with access to accurate, type-checked documentation and examples for Idealyst components, theme, and navigation.

## Features

- 🔍 **Type-Driven Documentation**: Extract TypeScript types directly from source packages
- ✅ **Validated Examples**: All examples are type-checked and guaranteed to compile
- 🎨 **Theme Type Access**: Get Size, Intent, Color, and other theme types
- 🧭 **Navigation Types**: Access to routing and navigator type definitions
- 🔎 **Icon Search**: Search through 7,447 Material Design Icons
- 📚 **Component Docs**: Detailed documentation with props, usage, and best practices

## Installation

### Global Installation

```bash
npm install -g @idealyst/mcp-server
```

### Project Installation

```bash
npm install --save-dev @idealyst/mcp-server
# or
yarn add -D @idealyst/mcp-server
```

## Usage with Claude Code

### Project-Level Configuration

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "idealyst": {
      "command": "npx",
      "args": ["@idealyst/mcp-server"]
    }
  }
}
```

### User-Level Configuration

Add to `~/.config/claude-code/mcp_config.json`:

```json
{
  "mcpServers": {
    "idealyst": {
      "command": "idealyst-mcp"
    }
  }
}
```

### Claude Desktop Configuration

#### macOS/Linux

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "idealyst": {
      "command": "npx",
      "args": ["@idealyst/mcp-server"]
    }
  }
}
```

#### Windows

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "idealyst": {
      "command": "npx",
      "args": ["@idealyst/mcp-server"]
    }
  }
}
```

## Available Tools

### Component Tools

#### `get_component_types`

Get TypeScript type definitions for a component.

```typescript
{
  component: "Button",
  format: "both" // "typescript" | "json" | "both"
}
```

Returns the actual TypeScript interface and/or parsed JSON schema with prop details.

#### `get_component_docs`

Get comprehensive documentation for a component including props, usage, features, and best practices.

```typescript
{
  component: "Button"
}
```

#### `get_component_example`

Get a specific example type for a component.

```typescript
{
  component: "Button",
  example_type: "basic" // "basic" | "variants" | "with-icons" | "interactive"
}
```

#### `get_component_examples_ts`

Get validated TypeScript examples that are guaranteed to compile.

```typescript
{
  component: "Button"
}
```

#### `list_components`

List all available Idealyst components with descriptions.

#### `search_components`

Search for components by name, category, or feature.

```typescript
{
  query: "form",
  category: "form" // optional: "layout" | "form" | "display" | "navigation" | "overlay" | "data"
}
```

### Theme Tools

#### `get_theme_types`

Get all theme type definitions (Size, Intent, Color, etc.).

```typescript
{
  format: "json" // "typescript" | "json" | "both"
}
```

### Navigation Tools

#### `get_navigation_types`

Get navigation type definitions for routers, navigators, and screens.

```typescript
{
  format: "typescript" // "typescript" | "json" | "both"
}
```

### Icon Tools

#### `search_icons`

Search through 7,447 Material Design Icons.

```typescript
{
  query: "arrow",
  limit: 20 // optional, default: 20
}
```

### CLI Tools

#### `get_cli_usage`

Get information about Idealyst CLI commands.

```typescript
{
  command: "init" // optional, omit for all commands
}
```

## Type Extraction System

This MCP server uses a unique **type-driven architecture** to ensure documentation accuracy:

1. **Extract Types**: Parse TypeScript from `@idealyst/components`, `@idealyst/theme`, `@idealyst/navigation`
2. **Validate Examples**: Type-check all examples against extracted types
3. **Serve Types**: Provide both raw TypeScript and JSON schema via MCP tools

See [TYPE-SYSTEM.md](./TYPE-SYSTEM.md) for detailed documentation.

## Development

### Setup

```bash
# Install dependencies
yarn install

# Extract types from packages
yarn extract-types

# Validate examples
yarn validate-examples

# Build
yarn build

# Run locally
yarn start
```

### Adding Examples

Create TypeScript example files in `examples/components/`:

```typescript
// examples/components/Button.examples.tsx
import React from 'react';
import { Button } from '@idealyst/components';

export function BasicButton() {
  return (
    <Button type="contained" intent="primary">
      Save
    </Button>
  );
}
```

Then validate:

```bash
yarn validate-examples
```

### Project Structure

```
packages/mcp-server/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/                # MCP tool implementations
│   │   └── get-types.ts      # Type extraction tools
│   ├── data/                 # Component documentation
│   │   ├── components/       # Component docs
│   │   ├── cli-commands.ts   # CLI documentation
│   │   └── framework-guides.ts
│   └── generated/            # Auto-generated (gitignored)
│       └── types.json        # Extracted types
├── scripts/
│   ├── extract-types.ts      # Type extraction script
│   ├── type-extractor.ts     # Extraction utilities
│   └── validate-examples.ts  # Example validation
├── examples/
│   └── components/           # Type-checked examples
│       ├── Button.examples.tsx
│       ├── Card.examples.tsx
│       └── ...
├── ARCHITECTURE.md           # System architecture
├── TYPE-SYSTEM.md           # Type system documentation
└── package.json
```

## Build Process

The build includes type extraction and validation:

```json
{
  "scripts": {
    "prebuild": "yarn extract-types && yarn validate-examples",
    "build": "tsc && chmod +x dist/index.js"
  }
}
```

This ensures:
- ✅ Types are up-to-date
- ✅ Examples are valid
- ✅ Build fails if examples have type errors

## Resources

The server also provides markdown resources accessible via MCP:

- `idealyst://framework/getting-started` - Getting started guide
- `idealyst://framework/components-overview` - Components overview
- `idealyst://framework/theming` - Theming guide
- `idealyst://framework/cli` - CLI reference
- `idealyst://navigation/overview` - Navigation system overview
- `idealyst://navigation/route-configuration` - Route configuration
- `idealyst://navigation/navigator-types` - Navigator types guide
- `idealyst://icons/reference` - Icon reference with common icons

## Benefits

### For AI Assistants
- 🎯 **Accurate Types**: Get exact TypeScript interfaces from source
- ✅ **Validated Examples**: Examples guaranteed to compile
- 📊 **Multiple Formats**: TypeScript and JSON schema formats
- 🔄 **Always Updated**: Types extracted from actual packages

### For Developers
- 🚀 **Fast Development**: AI generates correct code on first try
- 📖 **Reliable Docs**: Documentation always matches reality
- 🔍 **Easy Discovery**: Search components, icons, and types
- 💡 **Best Practices**: Built-in guidance and examples

## Example Queries for Claude

Once the MCP server is connected, you can ask:

- "List all Idealyst components"
- "Get the TypeScript types for the Button component"
- "Show me validated examples for the Card component"
- "What are the available Size values in the theme?"
- "Search for arrow icons"
- "How do I create a new Idealyst workspace?"
- "What navigation types are available?"

## Troubleshooting

### "Types file not found" Error

Run type extraction:
```bash
yarn extract-types
```

### Examples Have Type Errors

This means the examples don't match the current types (which is good - we caught it!):
```bash
yarn validate-examples  # See errors
# Fix examples, then re-validate
```

### Types Are Out of Date

Re-extract after changing component packages:
```bash
yarn extract-types
yarn build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add/update examples with type validation
4. Run `yarn validate-examples`
5. Submit a pull request

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [TYPE-SYSTEM.md](./TYPE-SYSTEM.md) for technical details.

## License

MIT

## Links

- [Idealyst Framework](https://github.com/IdealystIO/idealyst-framework)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code](https://code.claude.com/)

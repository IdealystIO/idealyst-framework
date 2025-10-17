# @idealyst/mcp-server

Model Context Protocol (MCP) server providing documentation, examples, and usage instructions for the Idealyst framework.

## What is this?

This MCP server allows AI assistants (like Claude) to access comprehensive documentation about the Idealyst framework, including:

- Component documentation and examples
- CLI usage instructions
- Framework setup guides
- Best practices and patterns

## Installation

```bash
# From the Idealyst monorepo
cd packages/mcp-server
yarn install
yarn build

# Or install globally
npm install -g @idealyst/mcp-server
```

## Usage with Claude Desktop

Add this server to your Claude Desktop configuration:

### macOS/Linux

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "idealyst": {
      "command": "node",
      "args": [
        "/absolute/path/to/idealyst-framework/packages/mcp-server/dist/index.js"
      ]
    }
  }
}
```

### Windows

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "idealyst": {
      "command": "node",
      "args": [
        "C:\\path\\to\\idealyst-framework\\packages\\mcp-server\\dist\\index.js"
      ]
    }
  }
}
```

After adding the configuration, restart Claude Desktop.

## Available Tools

### list_components

List all available Idealyst components with brief descriptions.

**Example:**
```
List all Idealyst components
```

### get_component_docs

Get detailed documentation for a specific component including props, usage, and examples.

**Parameters:**
- `component` (string): Component name (e.g., 'Button', 'Card', 'Input')

**Example:**
```
Get documentation for the Button component
```

### get_component_example

Get code examples for a specific component.

**Parameters:**
- `component` (string): Component name
- `example_type` (optional): 'basic', 'variants', 'with-icons', or 'interactive'

**Example:**
```
Show me an interactive example of the Dialog component
```

### get_cli_usage

Get information about Idealyst CLI commands.

**Parameters:**
- `command` (optional): Specific CLI command

**Example:**
```
How do I use the Idealyst CLI to create a new web app?
```

### search_components

Search for components by name, category, or feature.

**Parameters:**
- `query` (optional): Search query
- `category` (optional): Filter by category ('layout', 'form', 'display', 'navigation', 'overlay', 'data')

**Example:**
```
Search for form components in Idealyst
```

## Available Resources

The server also provides framework guides as resources:

- **Getting Started**: Complete setup guide
- **Components Overview**: All available components organized by category
- **Theming Guide**: Customizing themes
- **CLI Reference**: Complete CLI documentation

## Development

```bash
# Install dependencies
yarn install

# Build
yarn build

# Watch mode
yarn dev

# Test the server
node dist/index.js
```

## Example Queries for Claude

Once the MCP server is connected to Claude, you can ask questions like:

- "List all Idealyst components"
- "Show me how to use the Button component with icons"
- "How do I create a new Idealyst workspace?"
- "What form components are available in Idealyst?"
- "Give me an example of using the Dialog component"
- "How do I customize the theme in Idealyst?"

## Architecture

The server exposes:

- **Tools**: Callable functions for querying component docs, examples, and CLI usage
- **Resources**: Static framework guides and documentation

All data is stored in TypeScript files under `src/data/`:
- `components.ts`: Component documentation and examples
- `cli-commands.ts`: CLI command reference
- `framework-guides.ts`: Framework setup and usage guides

## Adding New Components

To add documentation for a new component, edit `src/data/components.ts`:

```typescript
export const components: Record<string, any> = {
  YourComponent: {
    category: "display",
    description: "Brief description",
    props: "Props documentation...",
    features: ["Feature 1", "Feature 2"],
    bestPractices: ["Practice 1", "Practice 2"],
    usage: "Basic usage example...",
    examples: {
      basic: "Basic example code...",
      variants: "Variants example code...",
      "with-icons": "Icon example code...",
      interactive: "Interactive example code...",
    },
  },
};
```

Then rebuild: `yarn build`

## License

MIT

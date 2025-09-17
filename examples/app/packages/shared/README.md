# shared

Shared library built with Idealyst Framework

## Getting Started

This is a shared component library built with the Idealyst Framework that can be used across React Native and React web applications. It exports source TypeScript files directly for seamless integration in monorepo setups.

### Prerequisites

- Node.js 18+
- Yarn

### Installation

Install dependencies:
```bash
yarn install
```

### Development

Run tests:
```bash
yarn test
```

Type checking:
```bash
yarn type-check
```

## Usage

Import the HelloWorld component in your React or React Native app:

```typescript
import { HelloWorld } from '@{{workspaceName}}/shared';

function App() {
  return <HelloWorld name="Developer" />;
}
```

## Component

### HelloWorld

A simple welcome component that works on both web and mobile platforms.

**Props:**
- `name?: string` - Name to display in the greeting (defaults to "World")

**Example:**
```typescript
<HelloWorld name="Alice" />
```

### Project Structure

```
shared/
├── src/
│   ├── components/    # Shared components
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript types
│   └── index.ts       # Main export file
├── dist/              # Built library (generated)
├── rollup.config.js   # Build configuration
└── tsconfig.json      # TypeScript configuration
```

### Features

- **Cross-platform**: Works on both React Native and React web
- **TypeScript**: Full type safety
- **Tree-shakeable**: Optimized for bundle size
- **Peer Dependencies**: Lightweight by design
- **Idealyst Theme Integration**: Compatible with the Idealyst theming system

### Usage

After building, you can import and use the library in your projects:

```tsx
import { SharedComponent, toTitleCase, ComponentProps } from '@test-select-demo/shared';

// Use the shared component
<SharedComponent 
  title="Hello World" 
  description="This works on both web and mobile!" 
/>

// Use utility functions
const formatted = toTitleCase('hello world'); // "Hello World"
```

### Building for Production

Build the library:
```bash
yarn build
```

This creates:
- `dist/index.js` - CommonJS build
- `dist/index.esm.js` - ES modules build
- `dist/index.d.ts` - TypeScript declarations

### Publishing

Before publishing, make sure to:

1. Update the version in `package.json`
2. Build the library: `yarn build`
3. Publish to npm: `npm publish`

### Development in Monorepo

If you're using this in a monorepo, you can reference it directly:

```json
{
  "dependencies": {
    "@test-select-demo/shared": "workspace:*"
  }
}
```

### Learn More

- [Idealyst Framework Documentation](https://github.com/your-username/idealyst-framework)
- [React Native Documentation](https://reactnative.dev/)
- [React Documentation](https://react.dev/)
- [Rollup Documentation](https://rollupjs.org/) 
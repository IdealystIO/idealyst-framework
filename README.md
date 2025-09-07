# Idealyst Framework

A cross-platform development framework for building React and React Native applications with shared components, theming, and navigation.

## Installation

```bash
# Install globally
npm install -g @idealyst/cli
# or
yarn global add @idealyst/cli

# Or use directly with npx
npx @idealyst/cli --help
```

## Quick Start

```bash
# Initialize a new workspace - includes database, api, mobile app, web app and shared structure.
idealyst init app-name
```

## Development

Out of the box, Idealyst provides a robust Development Dev Container configuration (compatible with VSCode). It also installs additional tools like Claude Caude and a Figma MCP server to easily hook in your designs.

The Database is managed by Prisma. Prisma model types are exported to the clients and api. Zod is used for validation. The API works with tRPC for a typed implementation between API and client.

Idealyst primitive components are cross compatible between React Native and React Web. If you need to create custom components for either, we recommend creating a folder for each component, and implementing the following structure.

```
MyComponent
  index.native.ts       (Export for the native component)
  index.web.ts          (Export the web component)
  index.ts              (Just re-export the web index, technically redundant but without it leads to issues)
  types.ts              (Props/other shared types)
  MyComponent.native.ts (React native implementation)
  MyComponent.web.ts    (React web implementation)
  MyComponent.styles.ts (Unistyles V3 Stylesheet)
```

The bundlers for web and native are configured to handle bundling each respective platform type.
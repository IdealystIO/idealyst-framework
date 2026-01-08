# Idealyst Documentation Site

Cross-platform documentation site for Idealyst framework, built with Idealyst components.

## Structure

```
docs/
├── packages/
│   ├── shared/     # Shared navigation, components, and pages
│   ├── web/        # Vite web app
│   └── mobile/     # Expo mobile app
└── package.json    # Workspace root
```

## Development

### Install Dependencies

```bash
cd examples/docs
yarn install
```

### Start Web Development

```bash
yarn web:dev
# Opens at http://localhost:3001
```

### Start Mobile Development

```bash
yarn mobile:start
```

## Pages

The documentation includes the following sections:

- **Getting Started**: Introduction, Installation, Quick Start
- **CLI**: Overview, Init Command
- **Theme**: Overview, Theme Builder, Style Definition, Style Extensions, Babel Plugin, $iterator Pattern
- **Components**: Overview and individual component documentation
- **Navigation**: Overview, Routes, Navigators, useNavigator hook
- **API**: Overview, tRPC, GraphQL, Database

## Architecture

- **Shared Package**: Contains all navigation, layouts, and page components
- **Web Package**: Vite-based web entry point using react-native-web
- **Mobile Package**: Expo-based mobile entry point

This architecture allows maximum code sharing between platforms while maintaining platform-specific optimizations.

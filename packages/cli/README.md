# @idealyst/cli

CLI tool for generating Idealyst Framework projects.

## Installation

Install globally:
```bash
npm install -g @idealyst/cli
# or
yarn global add @idealyst/cli
```

## Usage

### Create a new project

```bash
idealyst create <project-name> [options]
```

Options:
- `-t, --type <type>` - Project type: `native`, `web`, or `shared` (default: `native`)
- `-d, --directory <directory>` - Output directory (default: current directory)
- `--skip-install` - Skip installing dependencies

### Initialize a new workspace

```bash
idealyst init [options]
```

Options:
- `-d, --directory <directory>` - Output directory (default: current directory)
- `--skip-install` - Skip installing dependencies

## Examples

Create a React Native app:
```bash
idealyst create my-app --type native
```

Create a React web app:
```bash
idealyst create my-web-app --type web
```

Create a shared library:
```bash
idealyst create my-lib --type shared
```

Initialize a new workspace:
```bash
idealyst init
```

## Project Types

### Native (React Native)
- React Native 0.80.1
- Idealyst Components
- Idealyst Navigation
- Idealyst Theme
- TypeScript configuration
- Metro bundler configuration
- Babel configuration

### Web (React + Vite)
- React 19.1
- Vite build system
- Idealyst Components (web-compatible)
- Idealyst Navigation
- Idealyst Theme
- TypeScript configuration
- React Native Web support

### Shared Library
- Cross-platform components
- TypeScript definitions
- Rollup build system
- Peer dependencies for React/React Native
- Idealyst Theme integration

### Workspace
- Yarn workspace configuration
- Monorepo structure
- Version management scripts
- Build scripts for all packages

## Development

Build the CLI:
```bash
cd packages/cli
yarn build
```

Link for local development:
```bash
yarn link
```

## Learn More

- [Idealyst Framework Documentation](https://github.com/your-username/idealyst-framework)
- [React Native Documentation](https://reactnative.dev/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/) 
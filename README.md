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
# Initialize a new workspace
idealyst init my-workspace

# Create a React Native app
idealyst create mobile-app --type native --app-name "My Mobile App"

# Create a React web app  
idealyst create web-app --type web

# Create a shared library
idealyst create shared-utils --type shared
```

## Commands

### `idealyst init [project-name]`

Initialize a new Idealyst monorepo workspace.

**Options:**
- `project-name` - Name for the workspace (optional, will prompt if not provided)
- `-d, --directory <path>` - Output directory (default: current directory)
- `--skip-install` - Skip installing dependencies

**Examples:**
```bash
idealyst init                    # Prompts for workspace name
idealyst init my-workspace       # Creates workspace named "my-workspace"
idealyst init -d ./projects      # Creates workspace in ./projects directory
```

### `idealyst create [project-name]`

Create a new Idealyst project within a workspace.

**Options:**
- `project-name` - Name for the project (optional, will prompt if not provided)
- `-t, --type <type>` - Project type: `native`, `web`, or `shared` (optional, will prompt if not provided)
- `-a, --app-name <name>` - Display name for native apps (optional, will prompt for native projects)
- `-d, --directory <path>` - Output directory (default: current directory)
- `--skip-install` - Skip installing dependencies

**Examples:**
```bash
idealyst create                           # Interactive mode - prompts for all options
idealyst create my-app                    # Prompts for type, creates "my-app"
idealyst create mobile-app --type native # Creates React Native app, prompts for app name
idealyst create web-app --type web       # Creates React web app
idealyst create utils --type shared      # Creates shared library
idealyst create mobile-app --type native --app-name "My Mobile App"  # Full specification
```

## Project Types

| Type | Description | Technologies |
|------|-------------|-------------|
| **native** | React Native mobile app | React Native 0.80.1, Metro, Babel |
| **web** | React web application | React 19.1, Vite, TypeScript |
| **shared** | Cross-platform library | Rollup, TypeScript, peer dependencies |

## Development Workflow

### 1. Initialize Workspace
```bash
idealyst init my-project
cd my-project
```

### 2. Create Applications
```bash
# Mobile app
idealyst create mobile-app --type native --app-name "My App"

# Web app  
idealyst create web-app --type web

# Shared utilities
idealyst create shared-utils --type shared
```

### 3. Install Dependencies
```bash
yarn install  # Installs all workspace dependencies
```

### 4. Run Applications

**React Native:**
```bash
cd mobile-app
yarn start     # Start Metro bundler
yarn android   # Run on Android
yarn ios       # Run on iOS
```

**React Web:**
```bash
cd web-app
yarn dev       # Start development server
```

**Shared Library:**
```bash
cd shared-utils
yarn build     # Build the library
yarn dev       # Watch for changes
```

## Features

- 🏗️ **Monorepo Structure** - Organized workspace with shared dependencies
- 📱 **Cross-Platform** - Consistent components for web and mobile
- 🎨 **Theming System** - Unified design system across platforms
- 🧭 **Navigation** - Platform-specific navigation with shared logic
- 📦 **Component Library** - Pre-built, tested UI components
- ⚡ **Fast Setup** - Generate projects in seconds
- 🔧 **TypeScript** - Full type safety out of the box

## Learn More

- [Component Documentation](./packages/components/README.md)
- [Theme Documentation](./packages/theme/README.md) 
- [Navigation Documentation](./packages/navigation/README.md)
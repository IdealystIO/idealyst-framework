# {{projectName}}

{{description}}

## Getting Started

This workspace contains your Idealyst Framework packages and applications.

### Structure

```
{{projectName}}/
├── packages/           # Shared packages
│   ├── theme/         # Theme configuration
│   ├── components/    # UI components
│   └── utils/         # Shared utilities
├── mobile-app/        # React Native app (generated)
├── web-app/           # React web app (generated)
└── shared-lib/        # Shared library (generated)
```

### Development

Install dependencies:
```bash
yarn install
```

Build all packages:
```bash
yarn build:all
```

Test all packages:
```bash
yarn test:all
```

### Adding Applications

Generate a new React Native app:
```bash
idealyst create mobile-app --type native
```

Generate a new React web app:
```bash
idealyst create web-app --type web
```

Generate a new shared library:
```bash
idealyst create shared-lib --type shared
```

**Note:** The CLI will automatically add new projects to the workspace configuration when run from the workspace root.

### Publishing

Publish all packages:
```bash
yarn publish:all
```

### Version Management

Update patch version for all packages:
```bash
yarn version:patch
```

Update minor version for all packages:
```bash
yarn version:minor
```

Update major version for all packages:
```bash
yarn version:major
``` 
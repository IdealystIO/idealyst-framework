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

## Testing

This workspace is pre-configured with Jest testing framework across all packages. Each package includes sample tests and Jest configuration.

### Quick Start

```bash
# Run all tests across all packages
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage reports
yarn test:coverage

# Run tests in CI mode (for automated builds)
yarn test:ci

# Run tests for a specific package
node scripts/test-runner.js test:package <package-name>
```

### Test Structure

Each package contains:
- `jest.config.js` - Jest configuration tailored to the project type
- `__tests__/` - Directory for test files with comprehensive examples
- Sample tests demonstrating testing patterns specific to each template

### Package-Specific Testing

- **API packages**: Node.js environment, async/database testing patterns
- **Web packages**: React Testing Library, DOM testing, user interactions
- **Native packages**: React Native Testing Library, component rendering
- **Shared packages**: TypeScript utility testing patterns

### Adding Tests

1. Create test files in the `__tests__` directory or alongside your source files with `.test.ts` or `.spec.ts` extension
2. Tests are automatically discovered and run by Jest
3. Each template includes comprehensive sample tests as starting points
4. See the Component Testing Guide for detailed patterns and best practices

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

## Docker & Containerization

This workspace includes comprehensive Docker support for development, staging, and production environments.

### Quick Start with Docker

```bash
# Development environment
cp .env.example .env
./scripts/docker/deploy.sh development

# Production deployment
cp .env.production .env
# Edit .env with your settings
./scripts/docker/deploy.sh production
```

### VS Code Dev Container

Open this workspace in VS Code and select "Reopen in Container" for a fully configured development environment with:
- Node.js, TypeScript, and all development tools pre-installed
- PostgreSQL and Redis databases ready to use
- Automatic port forwarding and extension installation
- Hot reload and debugging support

### Services Available

- **Web App**: React application with hot reload
- **API Server**: Backend with database connections
- **PostgreSQL**: Database with initialization scripts
- **Redis**: Caching and session storage
- **Nginx**: Reverse proxy and load balancer (production)

### Management Scripts

```bash
# Deployment
./scripts/docker/deploy.sh [development|production|staging]

# Database management
./scripts/docker/db-backup.sh [backup|restore|list|clean]

# View status
./scripts/docker/deploy.sh status

# View logs
./scripts/docker/deploy.sh logs
``` 
# web

React web app built with Idealyst Framework

## Getting Started

This is a React web application built with the Idealyst Framework and Vite, with full-stack capabilities including database and API integration.

### Prerequisites

- Node.js 18+
- Yarn

### Installation

Install dependencies:
```bash
yarn install
```

### Database Setup

If your project includes a database, set it up:

```bash
# Navigate to the database package
cd packages/database

# Install dependencies
yarn install

# Generate Prisma client
yarn prisma:generate

# Run database migrations
yarn prisma:migrate

# Seed the database with sample data
yarn prisma:seed
```

### API Setup

If your project includes an API, start the API server:

```bash
# Navigate to the API package
cd packages/api

# Install dependencies
yarn install

# Start the API server (usually on port 3000)
yarn dev
```

### Development

Start the web development server:
```bash
yarn dev
```

The app will be available at `http://localhost:3000`

If you have both database and API packages, make sure to start them first before starting the web app for full functionality.

### Building for Production

Build the app:
```bash
yarn build
```

Preview the production build:
```bash
yarn preview
```

### Project Structure

```
web/
├── packages/
│   ├── database/      # Database schema and migrations (if included)
│   ├── api/          # tRPC API server (if included)
│   ├── shared/       # Shared components and utilities
│   └── web/          # React web application
├── src/
│   ├── App.tsx       # Main app component
│   ├── main.tsx      # App entry point
│   ├── components/   # React components
│   └── utils/        # Utility functions and tRPC client
├── index.html        # HTML template
├── vite.config.ts    # Vite configuration
└── tsconfig.json     # TypeScript configuration
```

### Features

- **Full-Stack Type Safety**: End-to-end TypeScript from database to frontend
- **tRPC Integration**: Type-safe API calls with automatic TypeScript inference
- **Database Integration**: Prisma ORM with SQLite for development
- **Idealyst Components**: Cross-platform UI components
- **Idealyst Navigation**: Consistent navigation system
- **Idealyst Theme**: Unified theming across platforms
- **React 19.1**: Latest React version
- **Vite**: Fast build tool and dev server
- **React Native Web**: Use React Native components on the web

### API Demo

If your project includes the API demo, you can access it at `/test-demo` to see:
- Real-time database queries
- CRUD operations (Create, Read, Update, Delete)
- Type-safe tRPC integration
- Form handling with validation

### Development

The app uses the Idealyst Framework for consistent UI and navigation that works across web and mobile platforms.

Edit `src/App.tsx` to start building your application.

### Learn More

- [Idealyst Framework Documentation](https://github.com/your-username/idealyst-framework)
- [tRPC Documentation](https://trpc.io/)
- [Prisma Documentation](https://prisma.io/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/) 
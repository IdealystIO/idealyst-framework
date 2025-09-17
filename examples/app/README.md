# test-select-demo

A full-stack application built with the Idealyst Framework.

## 🏗️ Architecture

This workspace contains a complete full-stack application with:

- **📱 Mobile App** (`packages/mobile`) - React Native app with Idealyst components
- **🌐 Web App** (`packages/web`) - React web app with Idealyst components  
- **🚀 API Server** (`packages/api`) - tRPC API server with Express
- **🗄️ Database** (`packages/database`) - Prisma database layer with PostgreSQL
- **📦 Shared** (`packages/shared`) - Cross-platform shared components and utilities

All packages are pre-integrated and work together seamlessly.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn 3+
- PostgreSQL (or use Docker)

### Setup
```bash
# Install dependencies
yarn install

# Set up environment variables
cp packages/api/.env.example packages/api/.env
cp packages/database/.env.example packages/database/.env
# Edit .env files with your database URL

# Generate database client
yarn db:generate

# Push database schema
yarn db:push

# Start all development servers
yarn dev
```

This will start:
- 🌐 Web app at http://localhost:5173
- 🚀 API server at http://localhost:3000
- 📱 Mobile app (Metro bundler)

### Individual Commands

```bash
# Web development
yarn web:dev           # Start web app
yarn web:build         # Build web app

# Mobile development  
yarn mobile:start      # Start Metro bundler
yarn mobile:android    # Run on Android
yarn mobile:ios        # Run on iOS

# API development
yarn api:dev           # Start API server
yarn api:build         # Build API server

# Database management
yarn db:generate       # Generate Prisma client
yarn db:push           # Push schema to database
yarn db:migrate        # Create migrations
yarn db:studio         # Open Prisma Studio

# Build all packages
yarn build             # Build everything
yarn build:packages    # Build shared packages only

# Testing
yarn test              # Run all tests
yarn type-check        # Type check all packages
```

## 📱 Demo Features

The generated application includes working demo features:

### User Management
- User registration and authentication
- User profiles with avatars
- User listings and search

### Real-time Features  
- Live chat/messaging
- Real-time notifications
- Live user presence

### Data Flow
- **Mobile/Web** → **API** → **Database**
- Shared types and validation across all layers
- Real-time updates via tRPC subscriptions

## 🔧 Development

### Adding New Features

1. **Database Changes**: Update `packages/database/prisma/schema.prisma`
2. **API Endpoints**: Add routes in `packages/api/src/routers/`
3. **Shared Types**: Add to `packages/shared/src/`
4. **UI Components**: Update `packages/web/src/` and `packages/mobile/src/`

### Package Structure

```
test-select-demo/
├── packages/
│   ├── api/           # tRPC API server
│   ├── database/      # Prisma database layer
│   ├── mobile/        # React Native app
│   ├── shared/        # Shared components/utils
│   └── web/           # React web app
├── package.json       # Workspace configuration
├── docker-compose.yml # Database services
└── README.md         # This file
```

## 🔗 Package Integration

All packages are properly integrated:

- **Database**: Exports typed Prisma client and schemas
- **API**: Imports database client, exports tRPC router
- **Shared**: Cross-platform components used by web/mobile
- **Web/Mobile**: Import shared components and API client

### Type Safety

Full end-to-end type safety:
- Database schema → Generated Prisma types
- API routes → Generated tRPC types  
- Frontend → Typed API client calls
- Shared components → Typed props

## 📚 Documentation

- [Idealyst Framework](https://github.com/IdealystIO/idealyst-framework)
- [Prisma Docs](https://www.prisma.io/docs)
- [tRPC Docs](https://trpc.io)
- [React Native Docs](https://reactnative.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

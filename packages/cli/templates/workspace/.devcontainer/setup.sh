#!/bin/bash

echo "🚀 Setting up Idealyst development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/idealyst_db
POSTGRES_DB=idealyst_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Redis Configuration
REDIS_URL=redis://redis:6379

# API Configuration
API_PORT=3000
JWT_SECRET=your-jwt-secret-here

# Web Configuration
WEB_PORT=3000

# Development Configuration
NODE_ENV=development
LOG_LEVEL=debug

# Project Configuration
PROJECT_NAME={{packageName}}
EOF
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until pg_isready -h postgres -p 5432 -U postgres; do
    echo "Database is unavailable - sleeping"
    sleep 1
done

echo "✅ Database is ready!"

# Run database migrations if they exist
if [ -d "packages" ]; then
    echo "🗄️ Setting up database..."
    
    # Check if any package has prisma
    for package_dir in packages/*/; do
        if [ -f "${package_dir}prisma/schema.prisma" ]; then
            echo "Running Prisma setup for $(basename "$package_dir")..."
            cd "$package_dir"
            npx prisma generate
            npx prisma db push
            cd /workspace
        fi
    done
fi

echo "Add Figma MCP to Claude Code"
claude mcp add -t sse figma-mcp http://figma-mcp:3333/sse

echo "✅ Development environment is ready!"
echo "🎉 You can now start developing your Idealyst application!"

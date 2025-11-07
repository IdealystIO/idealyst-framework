#!/bin/bash

echo "🚀 Setting up Idealyst development environment..."

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

echo "Add Figma MCP to Claude Code"
claude mcp add -t sse figma-mcp http://figma-mcp:3333/sse

echo "✅ Development environment is ready!"
echo "🎉 You can now start developing your Idealyst application!"

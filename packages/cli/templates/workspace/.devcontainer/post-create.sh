#!/bin/bash

# Post-create script for Idealyst dev container
echo "🚀 Setting up Idealyst development environment..."

# Set proper permissions
sudo chown -R devuser:devuser /app

# Install dependencies if not already installed
if [ ! -d "/app/node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
fi

# Set up git configuration (if not already set)
if [ -z "$(git config --global user.name)" ]; then
    echo "⚙️ Please configure git:"
    echo "  git config --global user.name \"Your Name\""
    echo "  git config --global user.email \"your.email@example.com\""
fi

# Create environment file if it doesn't exist
if [ ! -f "/app/.env" ]; then
    echo "📝 Creating .env file..."
    cat > /app/.env << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/idealyst_db
POSTGRES_DB=idealyst_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Redis Configuration
REDIS_URL=redis://redis:6379

# API Configuration
API_PORT=3001
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
if [ -d "/app/packages" ]; then
    echo "🗄️ Setting up database..."
    
    # Check if any package has prisma
    for package_dir in /app/packages/*/; do
        if [ -f "${package_dir}prisma/schema.prisma" ]; then
            echo "Running Prisma setup for $(basename "$package_dir")..."
            cd "$package_dir"
            npx prisma generate
            npx prisma db push
            cd /app
        fi
    done
fi

# Set up git hooks if husky is present
if [ -f "/app/package.json" ] && grep -q "husky" /app/package.json; then
    echo "🐕 Setting up git hooks..."
    yarn husky install
fi

# Create helpful aliases
echo "⚡ Setting up helpful aliases..."
cat >> ~/.bashrc << EOF

# Idealyst Development Aliases
alias dev-web='cd /app && yarn workspace web dev'
alias dev-api='cd /app && yarn workspace api dev'
alias test-all='cd /app && yarn test'
alias build-all='cd /app && yarn build:all'
alias lint-all='cd /app && yarn lint:all'

# Docker aliases
alias dc='docker-compose'
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcl='docker-compose logs'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'

echo "🎉 Idealyst development environment is ready!"
echo ""
echo "Available commands:"
echo "  dev-web     - Start web development server"
echo "  dev-api     - Start API development server"
echo "  test-all    - Run all tests"
echo "  build-all   - Build all packages"
echo "  lint-all    - Lint all packages"
echo ""
echo "Database: postgresql://postgres:postgres@postgres:5432/idealyst_db"
echo "Redis: redis://redis:6379"
echo ""
EOF

source ~/.bashrc

echo "🎉 Development environment setup complete!"
echo ""
echo "Quick start:"
echo "  1. Run 'dev-web' to start the web development server"
echo "  2. Run 'dev-api' to start the API server"
echo "  3. Open http://localhost:3000 to view your app"
echo ""
echo "Happy coding! 🚀"

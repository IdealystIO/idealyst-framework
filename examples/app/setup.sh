#!/bin/bash

# Idealyst Framework Workspace Setup Script
# This script sets up the development environment for your workspace

echo "🏗️ Setting up Idealyst Framework workspace..."

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Build all packages
echo "🔨 Building packages..."
yarn build:packages

# Set up git hooks (if using husky)
if [ -f "package.json" ] && grep -q "husky" package.json; then
  echo "🪝 Setting up git hooks..."
  yarn prepare
fi

echo "✅ Workspace setup complete!"
echo ""
echo "🚀 Quick start:"
echo "  • Run 'yarn dev' to start development mode"
echo "  • Run 'yarn build' to build all packages"
echo "  • Run 'yarn test' to run tests"
echo "  • Use 'idealyst create <type> <name>' to add new projects"
echo ""
echo "📚 Check README.md and DOCKER.md for more information."

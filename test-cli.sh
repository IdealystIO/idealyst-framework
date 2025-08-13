#!/bin/bash

# Test script for Idealyst CLI
# This script demonstrates creating a workspace and different types of packages

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}🔵 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Clean up function
cleanup() {
    print_step "Cleaning up test directory..."
    rm -rf ./test-workspace 2>/dev/null || true
    print_success "Cleanup complete"
}

# Trap to cleanup on script exit
trap cleanup EXIT

# Start fresh
cleanup

echo -e "${BLUE}🚀 Testing Idealyst CLI Framework${NC}"
echo "This script will test creating a workspace and different package types"
echo ""

# Build the CLI first
print_step "Building CLI package..."
cd packages/cli
yarn build
cd ../..
print_success "CLI built successfully"

# Make CLI globally available for testing
CLI_PATH="$(pwd)/packages/cli/dist/index.js"
print_step "Using CLI at: $CLI_PATH"

# Test 1: Create workspace
print_step "Test 1: Creating a new workspace 'test-workspace'"
node "$CLI_PATH" init test-workspace --skip-install
print_success "Workspace created successfully"

# Navigate to workspace
cd test-workspace

print_step "Workspace contents:"
ls -la

# Test 2: Create API package
print_step "Test 2: Creating API package 'backend-api'"
node "$CLI_PATH" create backend-api --type api --skip-install
print_success "API package created successfully"

# Test 3: Create Web package
print_step "Test 3: Creating Web package 'frontend-web'"
node "$CLI_PATH" create frontend-web --type web --skip-install
print_success "Web package created successfully"

# Test 4: Create Shared package
print_step "Test 4: Creating Shared package 'shared-utils'"
node "$CLI_PATH" create shared-utils --type shared --skip-install
print_success "Shared package created successfully"

# Test 5: Create Native package
print_step "Test 5: Creating Native package 'mobile-app'"
print_warning "Note: Native package creation requires React Native CLI and may take longer"
echo "Creating with app name 'My Test App'..."
node "$CLI_PATH" create mobile-app --type native --app-name "My Test App" --skip-install
print_success "Native package created successfully"

# Show final structure
print_step "Final workspace structure:"
echo ""
echo "📁 test-workspace/"
tree -L 3 -I 'node_modules|build|dist|.git' . 2>/dev/null || find . -type d -not -path './node_modules*' -not -path '*/.git*' -not -path './build*' -not -path './dist*' | head -20

echo ""
print_step "Package.json workspace configuration:"
cat package.json | grep -A 10 '"workspaces"'

echo ""
print_step "Created packages:"
ls -la packages/

echo ""
print_success "🎉 All tests completed successfully!"
echo ""
echo "You can now:"
echo "  1. cd test-workspace"
echo "  2. yarn install (to install all dependencies)"
echo "  3. yarn test (to run all tests)"
echo "  4. Explore the generated packages in packages/"
echo ""
echo "Package details:"
echo "  • backend-api: tRPC API server with Prisma"
echo "  • frontend-web: React web app with Vite"
echo "  • shared-utils: Shared TypeScript library"
echo "  • mobile-app: React Native mobile app"

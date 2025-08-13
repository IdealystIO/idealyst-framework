#!/bin/bash

# Setup script for local CLI development and testing
# This script builds and links the CLI for local testing

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

echo -e "${BLUE}🔧 Setting up Idealyst CLI for local development${NC}"
echo ""

# Navigate to CLI package
print_step "Building CLI package..."
cd /home/nicho/Development/idealyst-framework/packages/cli

# Build the CLI
yarn build
print_success "CLI built successfully"

# Link the CLI globally
print_step "Linking CLI globally..."
yarn link
print_success "CLI linked globally"

echo ""
print_success "🎉 Setup complete!"
echo ""
echo "The Idealyst CLI is now available globally as:"
echo "  • idealyst"
echo "  • idealyst-cli"
echo ""
echo "Test it with:"
echo "  idealyst --help"
echo "  idealyst init my-workspace"
echo "  cd my-workspace"
echo "  idealyst create my-app --type web"
echo ""
print_warning "To unlink later, run: yarn unlink -g @idealyst/cli"
echo ""

# Test the CLI
print_step "Testing CLI installation..."
if command -v idealyst &> /dev/null; then
    print_success "CLI is available in PATH"
    echo ""
    idealyst --help
else
    print_error "CLI not found in PATH. You may need to add yarn global bin to your PATH."
    echo "Add this to your ~/.bashrc or ~/.zshrc:"
    echo "export PATH=\"\$(yarn global bin):\$PATH\""
fi

#!/bin/bash

# Interactive CLI test script
# This script lets you test the CLI interactively

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

echo -e "${BLUE}🚀 Idealyst CLI Interactive Tester${NC}"
echo ""

# Build CLI first
print_step "Building CLI..."
cd /home/nicho/Development/idealyst-framework/packages/cli
yarn build
cd /home/nicho/Development/idealyst-framework

CLI_PATH="/home/nicho/Development/idealyst-framework/packages/cli/dist/index.js"
print_success "CLI built at: $CLI_PATH"

echo ""
echo "Available commands to test:"
echo ""
echo "1. Create workspace:"
echo "   node $CLI_PATH init my-workspace"
echo ""
echo "2. Create API package (from within workspace):"
echo "   node $CLI_PATH create my-api --type api"
echo ""
echo "3. Create Web package (from within workspace):"
echo "   node $CLI_PATH create my-web --type web"
echo ""
echo "4. Create Shared package (from within workspace):"
echo "   node $CLI_PATH create my-shared --type shared"
echo ""
echo "5. Create Native package (from within workspace):"
echo "   node $CLI_PATH create my-native --type native --app-name \"My App\""
echo ""
echo "Interactive prompts (omit options to be prompted):"
echo "   node $CLI_PATH init"
echo "   node $CLI_PATH create"
echo ""

print_warning "Remember: Individual packages must be created from within a workspace directory!"

echo ""
echo "Test workspace will be created in current directory."
read -p "Press Enter to start interactive testing or Ctrl+C to exit..."

echo ""
print_step "Starting interactive CLI..."
echo ""

# Create alias for easy testing
alias idealyst="node $CLI_PATH"

# Start an interactive shell with the CLI available
bash --rcfile <(echo "
alias idealyst='node $CLI_PATH'
echo '🎯 Idealyst CLI is now available as \"idealyst\"'
echo 'Try: idealyst init my-test-workspace'
echo 'Then: cd my-test-workspace && idealyst create my-app --type web'
echo 'Type \"exit\" to return to the original shell'
PS1='(idealyst-cli) \$ '
")

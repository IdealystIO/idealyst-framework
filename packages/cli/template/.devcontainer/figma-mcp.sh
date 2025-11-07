#!/bin/bash
set -e

echo "Starting Figma MCP Server..."

# Check if FIGMA_ACCESS_TOKEN is provided
if [ -z "$FIGMA_ACCESS_TOKEN" ]; then
    echo "❌ No FIGMA_ACCESS_TOKEN provided"
    echo "💡 Add your token to .devcontainer/.env to enable Figma integration"
    echo "   Example: echo 'FIGMA_ACCESS_TOKEN=fig_your_token_here' > .devcontainer/.env"
    echo ""
    echo "🔄 Keeping container alive (waiting for token)..."
    sleep infinity
    exit 0
fi

echo "✅ Figma token found, installing figma-developer-mcp..."

# Install figma-developer-mcp if not already installed
if ! command -v figma-developer-mcp &> /dev/null; then
    npm install -g figma-developer-mcp
    echo "📦 figma-developer-mcp installed successfully"
else
    echo "📦 figma-developer-mcp already installed"
fi

echo "🚀 Starting Figma MCP server on port 3333..."
echo "🎨 Figma designs will be available to AI tools like Claude"

# Start the MCP server with the correct environment variable
export FIGMA_API_KEY="$FIGMA_ACCESS_TOKEN"
exec npx figma-developer-mcp --port 3333

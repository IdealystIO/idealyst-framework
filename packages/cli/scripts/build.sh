#!/bin/bash

# CLI Build Script with Template Management
# Ensures templates are properly cleaned and recopied to avoid unintentional files

set -e  # Exit on any error

echo "🧹 Cleaning previous build..."
rm -rf dist

echo "🏗️  Building TypeScript..."
npx tsc

echo "🗑️  Cleaning any existing template in dist..."
rm -rf dist/template

echo "📁 Copying fresh template..."
cp -r template dist/

echo "🔍 Verifying template structure..."
if [ -d "dist/template" ]; then
    echo "✅ Template copied successfully"
    echo "   Template includes packages:"
    ls dist/template/packages/ | sed 's/^/   - /'
else
    echo "❌ Template copy failed!"
    exit 1
fi

echo "🎉 Build completed successfully!"

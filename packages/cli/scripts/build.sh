#!/bin/bash

# CLI Build Script with Template Management
# Ensures templates are properly cleaned and recopied to avoid unintentional files

set -e  # Exit on any error

echo "🧹 Cleaning previous build..."
rm -rf dist

echo "🏗️  Building TypeScript..."
npx tsc

echo "🗑️  Cleaning any existing templates in dist..."
rm -rf dist/templates

echo "📁 Copying fresh templates..."
cp -r templates dist/

echo "🔍 Verifying template structure..."
if [ -d "dist/templates" ]; then
    echo "✅ Templates copied successfully:"
    find dist/templates -type d -maxdepth 1 | grep -v "^dist/templates$" | sort
else
    echo "❌ Template copy failed!"
    exit 1
fi

echo "🎉 Build completed successfully!"

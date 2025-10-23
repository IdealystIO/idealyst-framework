#!/bin/bash

# Remove deepMerge import from all .styles.tsx files
find packages/components/src -name "*.styles.tsx" -type f -exec sed -i "/import.*deepMerge.*from.*'\.\.\/utils\/deepMerge'/d" {} \;

echo "Removed deepMerge imports from all .styles.tsx files"

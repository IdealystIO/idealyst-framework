#!/bin/bash

# This script inlines simple createXStyles functions (that don't return functions)
# directly into StyleSheet.create for the 5 specific files listed below

cd packages/components/src

# Process each file individually
for file in accordion.ts button.ts chip.ts menu-item.ts pressable.ts; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Add your sed commands here when ready
  fi
done

echo "Done!"

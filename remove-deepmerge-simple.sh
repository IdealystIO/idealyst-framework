#!/bin/bash

# Simple script to remove deepMerge import from files that don't have createXStylesheet

SIMPLE_FILES=(
    "ActivityIndicator/ActivityIndicator.styles.tsx"
    "Avatar/Avatar.styles.tsx"
    "Badge/Badge.styles.tsx"
    "Card/Card.styles.tsx"
    "Checkbox/Checkbox.styles.tsx"
    "Chip/Chip.styles.tsx"
    "Divider/Divider.styles.tsx"
    "Icon/Icon.styles.tsx"
    "Image/Image.styles.tsx"
    "Input/Input.styles.tsx"
    "Popover/Popover.styles.tsx"
    "Progress/Progress.styles.tsx"
    "RadioButton/RadioButton.styles.tsx"
    "SVGImage/SVGImage.styles.tsx"
    "Select/Select.styles.tsx"
    "Skeleton/Skeleton.styles.tsx"
    "Switch/Switch.styles.tsx"
    "Tooltip/Tooltip.styles.tsx"
    "Video/Video.styles.tsx"
    "View/View.styles.tsx"
)

cd packages/components/src

for file in "${SIMPLE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        sed -i "/import.*deepMerge.*from.*'\.\.\/utils\/deepMerge'/d" "$file"
        echo "  ✓ Removed deepMerge import"
    else
        echo "  ⚠ File not found: $file"
    fi
done

echo ""
echo "✓ All simple files processed!"

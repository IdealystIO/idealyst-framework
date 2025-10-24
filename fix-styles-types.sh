#!/bin/bash

# Script to add explicit type annotations to style files

COMPONENTS_DIR="/home/nicho/Development/idealyst-framework/packages/components/src"

# Find all .styles.tsx files
find "$COMPONENTS_DIR" -name "*.styles.tsx" | while read -r file; do
    echo "Processing: $file"

    # Extract component name from path (e.g., Alert from Alert/Alert.styles.tsx)
    component=$(basename "$(dirname "$file")")

    # Skip if already processed (Button, Accordion, Chip, Card, Input)
    if [[ "$component" == "Button" || "$component" == "Accordion" || "$component" == "Chip" || "$component" == "Card" || "$component" == "Input" ]]; then
        echo "  Skipping $component (already processed)"
        continue
    fi

    # Check if file has the pattern we need to fix
    if grep -q "@ts-ignore" "$file" 2>/dev/null; then
        # Add type annotation to StyleSheet.create
        sed -i "s/export const ${component,,}Styles = StyleSheet.create((theme: Theme) => {/export const ${component,,}Styles = StyleSheet.create((theme: Theme): ${component}Stylesheet => {/g" "$file"

        # Remove @ts-ignore comment
        sed -i "/@ts-ignore.*TS language server/d" "$file"

        # Find and fix create*Styles functions
        # This regex looks for: function create*Styles(theme: Theme) {
        # and adds: `: Expanded${component}Styles` before the {
        sed -i -E "s/^(function create[A-Za-z]*Styles\(theme: Theme\))/\1: Expanded${component}Styles/g" "$file"

        echo "  ✓ Fixed $component"
    else
        echo "  Skipping $component (no @ts-ignore found)"
    fi
done

echo "Done!"

#!/bin/bash

FILE="packages/components/src/Alert/Alert.styles.tsx"

echo "Fixing Alert.styles.tsx..."

# Remove expanded parameter and deepMerge from function signatures and bodies
sed -i '
s/, expanded: Partial<ExpandedAlertStyles>//g
s/, expanded)//g
s/deepMerge(\([^,]*\), expanded)/\1/g
s/expanded?.container || {}//g
s/expanded?.iconContainer || {}//g
s/expanded?.content || {}//g
s/expanded?.title || {}//g
s/expanded?.message || {}//g
s/expanded?.actions || {}//g
s/expanded?.closeButton || {}//g
s/expanded?.closeIcon || {}//g
s/expanded?: Partial<AlertStylesheet>//g
' "$FILE"

echo "Done!"

#!/usr/bin/env python3
"""
Refactor .styles.tsx files to remove unused createXStylesheet functions
"""

import re
import os
from pathlib import Path

def process_file(file_path):
    """Process a single .styles.tsx file"""
    print(f"Processing: {file_path}")

    with open(file_path, 'r') as f:
        content = f.read()

    original_content = content
    changes_made = []

    # Pattern to match the createXStylesheet function at the end of the file
    # This matches: function createXStylesheet(theme: Theme, ...) { ... }
    pattern = r'\n+function create\w+Stylesheet\([^)]+\)[^{]*\{[^}]*\{[^}]*\}[^}]*\}\s*$'

    if re.search(pattern, content):
        content = re.sub(pattern, '', content)
        changes_made.append("Removed createXStylesheet function")

    # Add missing buildSizeVariants import if it's used but not imported
    if 'buildSizeVariants' in content and "'../utils/buildSizeVariants'" not in content:
        # Find the first import line
        import_pattern = r"(import \{[^}]+\} from '@idealyst/theme';)"
        match = re.search(import_pattern, content)
        if match:
            # Add the import after the theme import
            insert_pos = match.end()
            new_import = "\nimport { buildSizeVariants } from '../utils/buildSizeVariants';"
            content = content[:insert_pos] + new_import + content[insert_pos:]
            changes_made.append("Added missing buildSizeVariants import")

    # Write back if changes were made
    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"  ✓ Updated: {', '.join(changes_made)}")
        return True
    else:
        print(f"  - No changes needed")
        return False

def main():
    # Find all .styles.tsx files
    base_path = Path('/home/nicho/Development/idealyst-framework/packages/components/src')
    style_files = list(base_path.glob('**/*.styles.tsx'))

    print(f"Found {len(style_files)} .styles.tsx files\n")

    updated_count = 0
    for file_path in sorted(style_files):
        if process_file(file_path):
            updated_count += 1

    print(f"\n✓ Done! Updated {updated_count} of {len(style_files)} files")

if __name__ == '__main__':
    main()

#!/usr/bin/env node

/**
 * Build script for cli-beta
 *
 * 1. Cleans dist directory
 * 2. Compiles TypeScript
 * 3. Copies templates to dist
 * 4. Renames dotfiles (.template suffix)
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const DIST_TEMPLATES_DIR = path.join(DIST_DIR, 'templates');

// Files/directories to ignore when copying templates
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.cache',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  '*.tmp',
  '*.bak',
];

/**
 * Check if a path matches any ignore patterns
 */
function shouldIgnore(basename) {
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      if (regex.test(basename)) {
        return true;
      }
    } else if (basename === pattern) {
      return true;
    }
  }
  return false;
}

/**
 * Copy directory recursively, handling dotfiles
 */
async function copyTemplateDir(source, dest) {
  await fs.ensureDir(dest);

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    let destName = entry.name;

    // Skip ignored files
    if (shouldIgnore(entry.name)) {
      continue;
    }

    // Rename dotfiles to .template suffix
    if (entry.name.startsWith('.') && !entry.name.endsWith('.template')) {
      destName = entry.name.slice(1) + '.template';
    }

    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      await copyTemplateDir(sourcePath, destPath);
    } else {
      await fs.copy(sourcePath, destPath);
    }
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('Building cli-beta...\n');

  // Step 1: Clean dist directory
  console.log('1. Cleaning dist directory...');
  await fs.remove(DIST_DIR);

  // Step 2: Compile TypeScript
  console.log('2. Compiling TypeScript...');
  try {
    execSync('npx tsc', { cwd: ROOT_DIR, stdio: 'inherit' });
  } catch (error) {
    console.error('TypeScript compilation failed');
    process.exit(1);
  }

  // Step 3: Copy templates
  console.log('3. Copying templates...');
  if (await fs.pathExists(TEMPLATES_DIR)) {
    await copyTemplateDir(TEMPLATES_DIR, DIST_TEMPLATES_DIR);

    // Count files
    const countFiles = async (dir) => {
      let count = 0;
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          count += await countFiles(path.join(dir, entry.name));
        } else {
          count++;
        }
      }
      return count;
    };

    const fileCount = await countFiles(DIST_TEMPLATES_DIR);
    console.log(`   Copied ${fileCount} template files`);
  } else {
    console.log('   No templates directory found (templates will be generated programmatically)');
  }

  // Step 4: Make CLI executable
  console.log('4. Making CLI executable...');
  const cliPath = path.join(DIST_DIR, 'index.js');
  if (await fs.pathExists(cliPath)) {
    // Add shebang if not present
    let content = await fs.readFile(cliPath, 'utf8');
    if (!content.startsWith('#!')) {
      content = '#!/usr/bin/env node\n' + content;
      await fs.writeFile(cliPath, content);
    }
    await fs.chmod(cliPath, 0o755);
  }

  // Done!
  console.log('\n✓ Build complete!\n');
  console.log('Output directory:', DIST_DIR);

  // List dist contents
  const distContents = await fs.readdir(DIST_DIR);
  console.log('\nDist contents:');
  for (const item of distContents) {
    const stat = await fs.stat(path.join(DIST_DIR, item));
    console.log(`  ${stat.isDirectory() ? '📁' : '📄'} ${item}`);
  }
}

// Run build
build().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});

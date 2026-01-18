#!/usr/bin/env node

/**
 * Build script for @idealyst/cli
 *
 * 1. Cleans dist directory
 * 2. Compiles TypeScript
 * 3. Copies static templates to dist
 * 4. Copies and transforms showcase files to templates
 * 5. Renames dotfiles (.template suffix)
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const MONOREPO_ROOT = path.resolve(ROOT_DIR, '../..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const DIST_TEMPLATES_DIR = path.join(DIST_DIR, 'templates');
const CONSTANTS_FILE = path.join(ROOT_DIR, 'src', 'constants.ts');
const COMPONENTS_PACKAGE = path.join(MONOREPO_ROOT, 'packages', 'components', 'package.json');
const SHOWCASE_DIR = path.join(MONOREPO_ROOT, 'examples', 'showcase');

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
 * Transform showcase content to use template variables
 * @param {string} content - File content
 * @param {string} filePath - Path to the file (for context)
 * @returns {string} Transformed content
 */
function transformShowcaseContent(content, filePath) {
  let result = content;

  // Replace package scope: @idealyst-showcase -> @{{workspaceScope}}
  result = result.replace(/@idealyst-showcase/g, '@{{workspaceScope}}');

  // Replace component names: Showcase* -> App*
  result = result.replace(/ShowcaseRouter/g, 'AppRouter');
  result = result.replace(/ShowcaseTabLayout/g, 'AppTabLayout');
  result = result.replace(/ShowcaseStackLayout/g, 'AppStackLayout');
  result = result.replace(/ShowcaseLayout/g, 'AppLayout');

  // Replace display text: "Idealyst Showcase" -> {{appDisplayName}}
  // Be careful to only replace in JSX text content, not in comments
  result = result.replace(/"Idealyst Showcase"/g, '"{{appDisplayName}}"');
  result = result.replace(/'Idealyst Showcase'/g, "'{{appDisplayName}}'");

  // In JSX: <Text ...>Idealyst Showcase</Text> -> <Text ...>{{appDisplayName}}</Text>
  // Handle multiline cases with whitespace
  result = result.replace(/>(\s*)Idealyst Showcase(\s*)</g, '>$1{{appDisplayName}}$2<');

  // Also handle standalone text that might not be in JSX tags
  result = result.replace(/Idealyst Showcase/g, '{{appDisplayName}}');

  // Replace hardcoded version with template variable in specific contexts
  result = result.replace(/Version 1\.0\.0/g, 'Version {{version}}');

  // Replace bundle identifiers in app.json context
  if (filePath.includes('app.json')) {
    result = result.replace(/"com\.idealyst\.showcase"/g, '"{{iosBundleId}}"');
    result = result.replace(/"idealyst-showcase"/g, '"{{projectName}}"');
  }

  // Replace Idealyst version references in package.json
  if (filePath.endsWith('package.json')) {
    // Match version patterns like "^1.2.30" for @idealyst packages
    result = result.replace(
      /("@idealyst\/[^"]+": *")(\^?\d+\.\d+\.\d+)(")/g,
      '$1^{{idealystVersion}}$3'
    );
  }

  return result;
}

/**
 * Copy and transform a showcase directory to templates
 * @param {string} sourceDir - Source directory in showcase
 * @param {string} destDir - Destination directory in templates
 * @param {Object} options - Options for transformation
 */
async function copyAndTransformShowcase(sourceDir, destDir, options = {}) {
  const { renameFiles = {}, excludeDirs = [], excludeFiles = [] } = options;

  await fs.ensureDir(destDir);

  if (!await fs.pathExists(sourceDir)) {
    console.log(`   Warning: Showcase directory not found: ${sourceDir}`);
    return 0;
  }

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  let fileCount = 0;

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);

    // Skip ignored files
    if (shouldIgnore(entry.name)) {
      continue;
    }

    // Skip excluded directories
    if (entry.isDirectory() && excludeDirs.includes(entry.name)) {
      continue;
    }

    // Skip excluded files
    if (!entry.isDirectory() && excludeFiles.includes(entry.name)) {
      continue;
    }

    // Apply file renaming (e.g., ShowcaseRouter.tsx -> AppRouter.tsx)
    let destName = renameFiles[entry.name] || entry.name;

    // Handle dotfiles
    if (destName.startsWith('.') && !destName.endsWith('.template')) {
      destName = destName.slice(1) + '.template';
    }

    const destPath = path.join(destDir, destName);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      fileCount += await copyAndTransformShowcase(sourcePath, destPath, options);
    } else {
      // Check if file should be transformed (text files)
      const ext = path.extname(entry.name).toLowerCase();
      const textExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.yml', '.yaml', '.html', '.prisma'];

      if (textExtensions.includes(ext)) {
        // Read, transform, and write
        const content = await fs.readFile(sourcePath, 'utf8');
        const transformed = transformShowcaseContent(content, sourcePath);
        await fs.writeFile(destPath, transformed);
      } else {
        // Binary file - copy directly
        await fs.copy(sourcePath, destPath);
      }
      fileCount++;
    }
  }

  return fileCount;
}

/**
 * Copy showcase source files to templates with transformations
 * Only copies src/ directories - configuration files (package.json, vite.config, etc.)
 * are generated programmatically by the CLI generators
 *
 * Note: API-dependent files (trpc/, graphql/, components/App.tsx) are excluded
 * from shared and generated conditionally by the CLI based on user selection.
 */
async function copyShowcaseToTemplates() {
  console.log('5. Copying and transforming showcase source to templates...');

  if (!await fs.pathExists(SHOWCASE_DIR)) {
    console.log('   Warning: Showcase directory not found, skipping');
    return;
  }

  let totalFiles = 0;

  // Copy shared/src - EXCLUDING API-dependent folders
  // trpc/, graphql/, components/, screens/, navigation/ are conditionally generated
  const sharedSrcCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'shared', 'src'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src'),
    {
      renameFiles: {
        'ShowcaseRouter.tsx': 'AppRouter.tsx',
        'ShowcaseLayout.tsx': 'AppLayout.tsx',
      },
      // Exclude API-dependent folders - these are conditionally generated
      // Also exclude layouts - it's copied separately for renaming
      excludeDirs: ['trpc', 'graphql', 'components', 'screens', 'navigation', 'layouts'],
    }
  );
  console.log(`   Shared src: ${sharedSrcCount} files (excluding API-dependent folders)`);
  totalFiles += sharedSrcCount;

  // Copy screens WITHOUT API demo screens (base screens only)
  const screensCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'shared', 'src', 'screens'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-screens'),
    {
      // Exclude API demo screens - these are conditionally added
      excludeFiles: ['TRPCDemoScreen.tsx', 'GraphQLDemoScreen.tsx', 'index.ts'],
    }
  );
  console.log(`   Shared screens (base): ${screensCount} files`);
  totalFiles += screensCount;

  // Copy tRPC demo screen separately
  const trpcScreenPath = path.join(SHOWCASE_DIR, 'packages', 'shared', 'src', 'screens', 'TRPCDemoScreen.tsx');
  if (await fs.pathExists(trpcScreenPath)) {
    const content = await fs.readFile(trpcScreenPath, 'utf8');
    const transformed = transformShowcaseContent(content, trpcScreenPath);
    await fs.ensureDir(path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-screens-trpc'));
    await fs.writeFile(
      path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-screens-trpc', 'TRPCDemoScreen.tsx'),
      transformed
    );
    totalFiles++;
    console.log(`   tRPC demo screen: 1 file`);
  }

  // Copy GraphQL demo screen separately
  const graphqlScreenPath = path.join(SHOWCASE_DIR, 'packages', 'shared', 'src', 'screens', 'GraphQLDemoScreen.tsx');
  if (await fs.pathExists(graphqlScreenPath)) {
    const content = await fs.readFile(graphqlScreenPath, 'utf8');
    const transformed = transformShowcaseContent(content, graphqlScreenPath);
    await fs.ensureDir(path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-screens-graphql'));
    await fs.writeFile(
      path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-screens-graphql', 'GraphQLDemoScreen.tsx'),
      transformed
    );
    totalFiles++;
    console.log(`   GraphQL demo screen: 1 file`);
  }

  // Copy navigation separately (contains API-dependent routes)
  const navigationCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'shared', 'src', 'navigation'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-navigation'),
    {
      renameFiles: {
        'ShowcaseRouter.tsx': 'AppRouter.tsx',
      },
    }
  );
  console.log(`   Shared navigation: ${navigationCount} files`);
  totalFiles += navigationCount;

  // Copy shared/src/components separately (contains App.tsx which is API-dependent)
  const componentsCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'shared', 'src', 'components'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-components'),
    {}
  );
  console.log(`   Shared components (App.tsx): ${componentsCount} files`);
  totalFiles += componentsCount;

  // Copy shared/src/layouts separately (for file renaming)
  const layoutsCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'shared', 'src', 'layouts'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-layouts'),
    {
      renameFiles: {
        'ShowcaseLayout.tsx': 'AppLayout.tsx',
      },
    }
  );
  console.log(`   Shared layouts: ${layoutsCount} files`);
  totalFiles += layoutsCount;

  // Copy shared/src/trpc separately (for tRPC-enabled projects)
  const trpcClientCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'shared', 'src', 'trpc'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-trpc'),
    {}
  );
  console.log(`   Shared trpc client: ${trpcClientCount} files`);
  totalFiles += trpcClientCount;

  // Copy shared/src/graphql separately (for GraphQL-enabled projects)
  const graphqlClientCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'shared', 'src', 'graphql'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'shared', 'src-graphql'),
    {}
  );
  console.log(`   Shared graphql client: ${graphqlClientCount} files`);
  totalFiles += graphqlClientCount;

  // Copy API package source files
  // tRPC files (router, trpc.ts, context.ts)
  const apiTrpcCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'api', 'src'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'api', 'src-trpc'),
    {
      excludeDirs: ['graphql'],
    }
  );
  console.log(`   API trpc src: ${apiTrpcCount} files`);
  totalFiles += apiTrpcCount;

  // GraphQL files (schema, builder)
  const apiGraphqlCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'api', 'src', 'graphql'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'api', 'src-graphql'),
    {}
  );
  console.log(`   API graphql src: ${apiGraphqlCount} files`);
  totalFiles += apiGraphqlCount;

  // Copy database Prisma schema only
  const dbSchemaPath = path.join(SHOWCASE_DIR, 'packages', 'database', 'schema.prisma');
  if (await fs.pathExists(dbSchemaPath)) {
    const content = await fs.readFile(dbSchemaPath, 'utf8');
    const transformed = transformShowcaseContent(content, dbSchemaPath);
    await fs.ensureDir(path.join(DIST_TEMPLATES_DIR, 'core', 'database'));
    await fs.writeFile(
      path.join(DIST_TEMPLATES_DIR, 'core', 'database', 'schema.prisma'),
      transformed
    );
    totalFiles++;
    console.log(`   Database schema.prisma: 1 file`);
  }

  // Copy web/src only (App.tsx, main.tsx)
  const webSrcCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'web', 'src'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'web', 'src'),
    {}
  );
  console.log(`   Web src: ${webSrcCount} files`);
  totalFiles += webSrcCount;

  // Copy web/index.html (entry point, needs app name)
  const webIndexHtml = path.join(SHOWCASE_DIR, 'packages', 'web', 'index.html');
  if (await fs.pathExists(webIndexHtml)) {
    const content = await fs.readFile(webIndexHtml, 'utf8');
    const transformed = transformShowcaseContent(content, webIndexHtml);
    await fs.ensureDir(path.join(DIST_TEMPLATES_DIR, 'core', 'web'));
    await fs.writeFile(path.join(DIST_TEMPLATES_DIR, 'core', 'web', 'index.html'), transformed);
    totalFiles++;
    console.log(`   Web index.html: 1 file`);
  }

  // Copy web/public (static assets like vite.svg)
  const webPublicDir = path.join(SHOWCASE_DIR, 'packages', 'web', 'public');
  if (await fs.pathExists(webPublicDir)) {
    const publicCount = await copyAndTransformShowcase(
      webPublicDir,
      path.join(DIST_TEMPLATES_DIR, 'core', 'web', 'public'),
      {}
    );
    console.log(`   Web public: ${publicCount} files`);
    totalFiles += publicCount;
  }

  // Copy mobile/src only (App.tsx)
  const mobileSrcCount = await copyAndTransformShowcase(
    path.join(SHOWCASE_DIR, 'packages', 'mobile', 'src'),
    path.join(DIST_TEMPLATES_DIR, 'core', 'mobile', 'src'),
    {}
  );
  console.log(`   Mobile src: ${mobileSrcCount} files`);
  totalFiles += mobileSrcCount;

  console.log(`   Total: ${totalFiles} showcase source files transformed`);
}

/**
 * Update IDEALYST_VERSION in constants.ts from packages/components/package.json
 */
async function updateIdealystVersion() {
  if (!await fs.pathExists(COMPONENTS_PACKAGE)) {
    console.log('   Warning: Could not find components package.json, using existing version');
    return;
  }

  const pkg = await fs.readJson(COMPONENTS_PACKAGE);
  const version = pkg.version;

  let constants = await fs.readFile(CONSTANTS_FILE, 'utf8');
  const versionRegex = /export const IDEALYST_VERSION = '[^']+';/;

  if (versionRegex.test(constants)) {
    constants = constants.replace(versionRegex, `export const IDEALYST_VERSION = '${version}';`);
    await fs.writeFile(CONSTANTS_FILE, constants);
    console.log(`   Updated IDEALYST_VERSION to ${version}`);
  } else {
    console.log('   Warning: Could not find IDEALYST_VERSION in constants.ts');
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('Building @idealyst/cli...\n');

  // Step 1: Clean dist directory
  console.log('1. Cleaning dist directory...');
  await fs.remove(DIST_DIR);

  // Step 2: Update Idealyst version from components package
  console.log('2. Updating Idealyst version...');
  await updateIdealystVersion();

  // Step 3: Compile TypeScript
  console.log('3. Compiling TypeScript...');
  try {
    // Use local tsc from node_modules
    const tscPath = path.join(MONOREPO_ROOT, 'node_modules', '.bin', 'tsc');
    execSync(tscPath, { cwd: ROOT_DIR, stdio: 'inherit' });
  } catch (error) {
    console.error('TypeScript compilation failed');
    process.exit(1);
  }

  // Step 4: Copy templates
  console.log('4. Copying templates...');
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

  // Step 5: Copy and transform showcase source files
  await copyShowcaseToTemplates();

  // Step 6: Make CLI executable
  console.log('6. Making CLI executable...');
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

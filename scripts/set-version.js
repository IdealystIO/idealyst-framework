#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get version from command line argument
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Usage: node scripts/set-version.js <version>');
  console.error('Example: node scripts/set-version.js 1.2.0');
  process.exit(1);
}

// Validate version format (basic semantic versioning)
const versionRegex = /^\d+\.\d+\.\d+(-[\w.-]+)?$/;
if (!versionRegex.test(newVersion)) {
  console.error('Invalid version format. Use semantic versioning (e.g., 1.2.0)');
  process.exit(1);
}

console.log(`Setting version to ${newVersion} across all packages...`);

// Update root package.json first
const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
rootPackageJson.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(rootPackageJson, null, 2) + '\n');
console.log('Updated root package.json');

// Paths to update
const packagePaths = [
  'packages/theme/package.json',
  'packages/components/package.json',
  'packages/navigation/package.json',
  'packages/cli/package.json',
  'packages/datagrid/package.json',
  'packages/datepicker/package.json',
  'packages/oauth-client/package.json',
  'packages/storage/package.json',
  'packages/mcp-server/package.json',
  'packages/translate/package.json',
  'packages/config/package.json',
  'packages/tooling/package.json',
  'packages/markdown/package.json',
  'packages/lottie/package.json',
  'packages/animate/package.json',
  "packages/blur/package.json",
  "packages/audio/package.json",
  "packages/svg/package.json",
  'examples/example-native/package.json',
  'examples/example-web/package.json',
  'examples/docs/package.json',
];

// Function to update version in package.json
function updatePackageVersion(packagePath) {
  if (!fs.existsSync(packagePath)) {
    console.log(`Skipping ${packagePath} - file not found`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Update the version
  packageJson.version = newVersion;
  
  // Update dependencies to use the new version
  const idealystPackages = ['@idealyst/theme', '@idealyst/components', '@idealyst/navigation', '@idealyst/cli', '@idealyst/markdown'];
  
  ['dependencies', 'peerDependencies', 'devDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      idealystPackages.forEach(pkg => {
        if (packageJson[depType][pkg]) {
          // Keep the caret prefix for external dependencies
          packageJson[depType][pkg] = `^${newVersion}`;
        }
      });
    }
  });
  
  // Write the updated package.json
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Updated ${packagePath}`);
}

// Update all packages
packagePaths.forEach(updatePackageVersion);

// Update CLI constants.ts with the new IDEALYST_VERSION
const cliConstantsPath = 'packages/cli/src/constants.ts';
if (fs.existsSync(cliConstantsPath)) {
  let constantsContent = fs.readFileSync(cliConstantsPath, 'utf8');
  const versionRegex = /export const IDEALYST_VERSION = '[^']+';/;

  if (versionRegex.test(constantsContent)) {
    constantsContent = constantsContent.replace(
      versionRegex,
      `export const IDEALYST_VERSION = '${newVersion}';`
    );
    fs.writeFileSync(cliConstantsPath, constantsContent);
    console.log(`Updated CLI IDEALYST_VERSION to ${newVersion}`);
  } else {
    console.log('Warning: Could not find IDEALYST_VERSION in CLI constants.ts');
  }
} else {
  console.log(`Skipping ${cliConstantsPath} - file not found`);
}

console.log(`\nVersion ${newVersion} set successfully across all packages!`);
console.log('You can now commit these changes and publish the packages.'); 
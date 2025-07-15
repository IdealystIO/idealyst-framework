#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the version from root package.json
const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = rootPackageJson.version;

console.log(`Syncing version ${version} to all packages...`);

// Paths to update
const packagePaths = [
  'packages/theme/package.json',
  'packages/components/package.json',
  'packages/navigation/package.json',
  'packages/cli/package.json',
  'examples/example-native/package.json',
  'examples/example-web/package.json'
];

// Function to update version in package.json
function updatePackageVersion(packagePath) {
  if (!fs.existsSync(packagePath)) {
    console.log(`Skipping ${packagePath} - file not found`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Update the version
  packageJson.version = version;
  
  // Update dependencies to use the new version
  const idealystPackages = ['@idealyst/theme', '@idealyst/components', '@idealyst/navigation', '@idealyst/cli'];
  
  ['dependencies', 'peerDependencies', 'devDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      idealystPackages.forEach(pkg => {
        if (packageJson[depType][pkg]) {
          // Keep the caret prefix for external dependencies
          packageJson[depType][pkg] = `^${version}`;
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

console.log('Version sync completed!'); 
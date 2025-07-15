#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📦 Version Status Across All Packages\n');

// Read the version from root package.json
const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(`Root version: ${rootPackageJson.version}`);
console.log('━'.repeat(50));

// Paths to check
const packagePaths = [
  'packages/theme/package.json',
  'packages/components/package.json',
  'packages/navigation/package.json',
  'packages/cli/package.json',
  'examples/example-native/package.json',
  'examples/example-web/package.json'
];

// Function to check version in package.json
function checkPackageVersion(packagePath) {
  if (!fs.existsSync(packagePath)) {
    console.log(`❌ ${packagePath} - file not found`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const packageName = packageJson.name;
  const packageVersion = packageJson.version;
  
  // Check if version matches root
  const isSync = packageVersion === rootPackageJson.version;
  const statusIcon = isSync ? '✅' : '⚠️';
  
  console.log(`${statusIcon} ${packageName}: ${packageVersion}`);
  
  // Check internal dependencies
  const idealystPackages = ['@idealyst/theme', '@idealyst/components', '@idealyst/navigation', '@idealyst/cli'];
  
  ['dependencies', 'peerDependencies', 'devDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      idealystPackages.forEach(pkg => {
        if (packageJson[depType][pkg]) {
          const depVersion = packageJson[depType][pkg];
          const expectedVersion = packagePath.includes('examples/') 
            ? `^${rootPackageJson.version}`
            : `workspace:^${rootPackageJson.version}`;
          
          const isDepSync = depVersion === expectedVersion;
          const depStatusIcon = isDepSync ? '  ✅' : '  ⚠️';
          
          console.log(`${depStatusIcon} ${pkg}: ${depVersion}`);
        }
      });
    }
  });
  
  console.log('');
}

// Check all packages
packagePaths.forEach(checkPackageVersion);

console.log('━'.repeat(50));
console.log('Legend: ✅ = Synchronized, ⚠️ = Needs sync');
console.log('Run "yarn version:sync" to synchronize all versions'); 
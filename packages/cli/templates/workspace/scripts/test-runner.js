#!/usr/bin/env node

/**
 * Test runner script for Idealyst workspace
 * Provides flexible test execution across all packages
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const command = args[0] || 'test';

// Available commands
const commands = {
  'test': 'Run tests in all packages',
  'test:watch': 'Run tests in watch mode',
  'test:coverage': 'Run tests with coverage',
  'test:ci': 'Run tests in CI mode',
  'test:package': 'Run tests for a specific package (usage: test:package <package-name>)',
};

function showHelp() {
  console.log('Idealyst Test Runner\n');
  console.log('Available commands:');
  Object.entries(commands).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(20)} ${desc}`);
  });
  console.log('\nExamples:');
  console.log('  npm run test');
  console.log('  npm run test:watch');
  console.log('  npm run test:coverage');
  console.log('  node scripts/test-runner.js test:package api');
}

function getPackages() {
  const packagesDir = path.join(process.cwd(), 'packages');
  if (!fs.existsSync(packagesDir)) {
    return [];
  }
  
  return fs.readdirSync(packagesDir)
    .filter(dir => {
      const packageJsonPath = path.join(packagesDir, dir, 'package.json');
      return fs.existsSync(packageJsonPath);
    });
}

function runCommand(cmd, options = {}) {
  try {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      ...options 
    });
  } catch (error) {
    console.error(`Command failed: ${cmd}`);
    process.exit(1);
  }
}

function runTestsForPackage(packageName) {
  const packages = getPackages();
  
  if (!packages.includes(packageName)) {
    console.error(`Package "${packageName}" not found.`);
    console.log('Available packages:', packages.join(', '));
    process.exit(1);
  }
  
  const packagePath = path.join('packages', packageName);
  console.log(`Running tests for package: ${packageName}`);
  runCommand(`yarn workspace @/* run test`, { cwd: packagePath });
}

// Main execution
switch (command) {
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
    
  case 'test':
    console.log('Running tests in all packages...');
    runCommand('yarn workspaces foreach --include "@/*" run test --passWithNoTests');
    break;
    
  case 'test:watch':
    console.log('Running tests in watch mode...');
    runCommand('yarn workspaces foreach --include "@/*" run test:watch');
    break;
    
  case 'test:coverage':
    console.log('Running tests with coverage...');
    runCommand('yarn workspaces foreach --include "@/*" run test:coverage');
    break;
    
  case 'test:ci':
    console.log('Running tests in CI mode...');
    runCommand('yarn workspaces foreach --include "@/*" --parallel run test --passWithNoTests --watchAll=false');
    break;
    
  case 'test:package':
    const packageName = args[1];
    if (!packageName) {
      console.error('Package name is required for test:package command');
      console.log('Usage: node scripts/test-runner.js test:package <package-name>');
      process.exit(1);
    }
    runTestsForPackage(packageName);
    break;
    
  default:
    console.error(`Unknown command: ${command}`);
    console.log('Run with "help" to see available commands');
    process.exit(1);
}

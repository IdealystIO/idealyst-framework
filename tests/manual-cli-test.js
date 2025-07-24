#!/usr/bin/env node

/**
 * Manual CLI Testing Script
 * 
 * This script provides comprehensive manual testing for the Idealyst CLI
 * since automated testing has ES module compatibility issues.
 * 
 * Run this script to test all CLI functionality manually.
 */

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const { tmpdir } = require('os');

// Test configuration
const TEST_DIR = path.join(tmpdir(), 'idealyst-manual-tests');
const CLI_PATH = path.resolve(__dirname, '../packages/cli/dist/index.js');
const COMMAND_TIMEOUT = 30000; // 30 seconds timeout for CLI commands

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCLI(args, cwd = TEST_DIR, timeout = COMMAND_TIMEOUT) {
  return new Promise((resolve) => {
    log(`  Running: node ${CLI_PATH} ${args.join(' ')}`, 'blue');
    
    const child = spawn('node', [CLI_PATH, ...args], {
      cwd,
      stdio: 'pipe',
      timeout: timeout
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      timedOut = true;
      log(`  ⏰ Command timed out after ${timeout/1000}s`, 'yellow');
      child.kill('SIGTERM');
      
      // Force kill if SIGTERM doesn't work
      setTimeout(() => {
        if (!child.killed) {
          child.kill('SIGKILL');
        }
      }, 5000);
    }, timeout);

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (exitCode) => {
      clearTimeout(timeoutId);
      resolve({ 
        stdout, 
        stderr, 
        exitCode: exitCode || 0,
        timedOut
      });
    });

    child.on('error', (error) => {
      clearTimeout(timeoutId);
      resolve({
        stdout,
        stderr: stderr + '\n' + error.message,
        exitCode: 1,
        timedOut,
        error: error.message
      });
    });
  });
}

async function cleanupTestDir() {
  if (await fs.pathExists(TEST_DIR)) {
    await fs.remove(TEST_DIR);
  }
  await fs.ensureDir(TEST_DIR);
}

async function checkFileExists(filePath, description) {
  const exists = await fs.pathExists(filePath);
  if (exists) {
    log(`✅ ${description}`, 'green');
  } else {
    log(`❌ ${description}`, 'red');
  }
  return exists;
}

async function checkFileContent(filePath, expectedContent, description) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const matches = expectedContent.every(expected => content.includes(expected));
    if (matches) {
      log(`✅ ${description}`, 'green');
    } else {
      log(`❌ ${description}`, 'red');
      log(`   Expected to contain: ${expectedContent.join(', ')}`, 'yellow');
    }
    return matches;
  } catch (error) {
    log(`❌ ${description} (file not readable)`, 'red');
    return false;
  }
}

async function safeRunCLI(args, cwd = TEST_DIR, description = '') {
  try {
    const result = await runCLI(args, cwd);
    
    if (result.timedOut) {
      log(`⏰ ${description} timed out`, 'yellow');
      return { ...result, success: false };
    }
    
    if (result.error) {
      log(`💥 ${description} failed with error: ${result.error}`, 'red');
      return { ...result, success: false };
    }
    
    return { ...result, success: result.exitCode === 0 };
  } catch (error) {
    log(`💥 ${description} failed with exception: ${error.message}`, 'red');
    return { success: false, exitCode: 1, stdout: '', stderr: error.message };
  }
}

async function testWorkspaceGeneration() {
  log('\n📁 Testing Workspace Generation', 'bold');
  
  const result = await safeRunCLI([
    'init', 'test-workspace',
    '--skip-install'
  ], TEST_DIR, 'Workspace generation');

  log(`Exit code: ${result.exitCode}`, result.success ? 'green' : 'red');
  
  if (result.stderr && !result.success) {
    log(`Stderr: ${result.stderr}`, 'red');
  }

  if (!result.success) {
    log('❌ Workspace generation failed, skipping file checks', 'red');
    return null;
  }

  const workspacePath = path.join(TEST_DIR, 'test-workspace');
  
  // Check workspace structure
  await checkFileExists(workspacePath, 'Workspace directory created');
  await checkFileExists(path.join(workspacePath, 'package.json'), 'package.json created');
  await checkFileExists(path.join(workspacePath, 'README.md'), 'README.md created');
  await checkFileExists(path.join(workspacePath, '.yarnrc.yml'), '.yarnrc.yml created');

  // Check package.json content
  if (await fs.pathExists(path.join(workspacePath, 'package.json'))) {
    const packageJson = await fs.readJSON(path.join(workspacePath, 'package.json'));
    if (packageJson.name === 'test-workspace' && packageJson.private === true) {
      log('✅ package.json has correct name and private flag', 'green');
    } else {
      log('❌ package.json content incorrect', 'red');
    }

    if (Array.isArray(packageJson.workspaces)) {
      log('✅ workspaces array defined', 'green');
    } else {
      log('❌ workspaces array not defined', 'red');
    }
  }

  return workspacePath;
}

async function testProjectsWithinWorkspace() {
  log('\n🏗️ Testing Projects Within Workspace (Proper Workflow)', 'bold');
  
  // First create a workspace
  log('  Creating main workspace...', 'blue');
  const workspaceResult = await safeRunCLI([
    'init', 'main-workspace',
    '--skip-install'
  ], TEST_DIR, 'Main workspace creation');

  if (!workspaceResult.success) {
    log('❌ Failed to create main workspace, skipping project tests', 'red');
    return false;
  }

  const workspacePath = path.join(TEST_DIR, 'main-workspace');
  log('✅ Main workspace created successfully', 'green');

  // Now test creating projects within the workspace
  const projectTests = [
    {
      name: 'testnativeapp',
      type: 'native',
      appName: 'Test Native App',
      description: 'Native project generation within workspace'
    },
    {
      name: 'test-web',
      type: 'web',
      description: 'Web project generation within workspace'
    },
    {
      name: 'test-shared',
      type: 'shared',
      description: 'Shared library generation within workspace'
    }
  ];

  const results = {};

  for (const project of projectTests) {
    log(`\n📱 Testing ${project.type.toUpperCase()} Project: ${project.name}`, 'bold');
    
    const args = ['create', project.name, '--type', project.type, '--skip-install'];
    if (project.appName) {
      args.push('--app-name', project.appName);
    }

    const result = await safeRunCLI(args, workspacePath, project.description);
    
    log(`Exit code: ${result.exitCode}`, result.success ? 'green' : 'red');
    
    if (result.stderr) {
      log(`Stderr: ${result.stderr}`, result.success ? 'yellow' : 'red');
    }

    if (!result.success) {
      log(`❌ ${project.type} project generation failed`, 'red');
      if (result.stderr.includes('only be created within a workspace')) {
        log('   This might be expected if workspace validation is working', 'yellow');
      }
      results[project.type] = { success: false, path: null };
      continue;
    }

    const projectPath = path.join(workspacePath, 'packages', project.name);
    results[project.type] = { success: true, path: projectPath };

    // Check project structure based on type
    await checkProjectStructure(project.type, projectPath, project.appName);
  }

  // Check workspace was updated correctly
  await checkWorkspaceIntegration(workspacePath, results);

  return results;
}

async function checkProjectStructure(projectType, projectPath, appName) {
  await checkFileExists(projectPath, `${projectType} project directory created`);
  await checkFileExists(path.join(projectPath, 'package.json'), 'package.json created');

  switch (projectType) {
    case 'native':
      await checkFileExists(path.join(projectPath, 'app.json'), 'app.json created');
      await checkFileExists(path.join(projectPath, 'App.tsx'), 'App.tsx created');
      await checkFileExists(path.join(projectPath, 'index.js'), 'index.js created');
      await checkFileExists(path.join(projectPath, 'metro.config.js'), 'metro.config.js created');
      await checkFileExists(path.join(projectPath, 'babel.config.js'), 'babel.config.js created');

      // Check app.json content
      if (await fs.pathExists(path.join(projectPath, 'app.json'))) {
        const appJson = await fs.readJSON(path.join(projectPath, 'app.json'));
        if (appName && appJson.name === appName && appJson.displayName === appName) {
          log('✅ app.json has correct app name', 'green');
        } else if (!appName) {
          log('✅ app.json created with default name', 'green');
        } else {
          log('❌ app.json app name incorrect', 'red');
        }
      }
      break;

    case 'web':
      await checkFileExists(path.join(projectPath, 'index.html'), 'index.html created');
      await checkFileExists(path.join(projectPath, 'vite.config.ts'), 'vite.config.ts created');
      await checkFileExists(path.join(projectPath, 'src'), 'src directory created');
      await checkFileExists(path.join(projectPath, 'src', 'App.tsx'), 'App.tsx created');
      await checkFileExists(path.join(projectPath, 'src', 'main.tsx'), 'main.tsx created');

      // Check vite config
      await checkFileContent(
        path.join(projectPath, 'vite.config.ts'),
        ['defineConfig', '@vitejs/plugin-react'],
        'vite.config.ts has correct content'
      );
      break;

    case 'shared':
      await checkFileExists(path.join(projectPath, 'tsconfig.json'), 'tsconfig.json created');
      await checkFileExists(path.join(projectPath, 'README.md'), 'README.md created');
      await checkFileExists(path.join(projectPath, 'src'), 'src directory created');
      await checkFileExists(path.join(projectPath, 'src', 'index.ts'), 'index.ts created');

      // Check TypeScript config
      if (await fs.pathExists(path.join(projectPath, 'tsconfig.json'))) {
        const tsconfig = await fs.readJSON(path.join(projectPath, 'tsconfig.json'));
        if (tsconfig.compilerOptions && tsconfig.compilerOptions.declaration === true) {
          log('✅ tsconfig.json has declaration flag', 'green');
        } else {
          log('❌ tsconfig.json missing declaration flag', 'red');
        }
      }
      break;
  }
}

async function checkWorkspaceIntegration(workspacePath, results) {
  log('\n🔗 Checking Workspace Integration', 'bold');

  if (await fs.pathExists(path.join(workspacePath, 'package.json'))) {
    const packageJson = await fs.readJSON(path.join(workspacePath, 'package.json'));
    
    if (packageJson.workspaces) {
      const hasPackagesWildcard = packageJson.workspaces.includes('packages/*');
      const successfulProjects = Object.values(results).filter(r => r.success).length;
      
      if (hasPackagesWildcard) {
        log('✅ Workspace package.json has packages/* wildcard configuration', 'green');
      } else {
        log('❌ Workspace package.json missing packages/* configuration', 'red');
      }

      if (successfulProjects > 0) {
        log(`✅ Successfully created ${successfulProjects} projects within workspace`, 'green');
      }
    } else {
      log('❌ Workspace package.json missing workspaces configuration', 'red');
    }
  }
}

async function testOutsideWorkspaceValidation() {
  log('\n🚫 Testing Outside-Workspace Validation (All Project Types)', 'bold');
  
  // Test all project types to ensure NONE can be created outside a workspace
  const projectTypes = [
    { type: 'native', name: 'test-native-fail', extraArgs: ['--app-name', 'Should Fail App'] },
    { type: 'web', name: 'test-web-fail', extraArgs: [] },
    { type: 'shared', name: 'test-shared-fail', extraArgs: [] }
  ];

  let allTestsPassed = true;

  for (const project of projectTypes) {
    log(`\n  Testing ${project.type.toUpperCase()} project outside workspace...`, 'blue');
    
    const args = ['create', project.name, '--type', project.type, '--skip-install', ...project.extraArgs];
    const result = await safeRunCLI(args, TEST_DIR, `${project.type} project creation outside workspace (should fail)`);

    if (!result.success && result.stderr.includes('only be created within a workspace')) {
      log(`  ✅ Correctly prevents ${project.type} project creation outside workspace`, 'green');
    } else if (result.success) {
      log(`  ❌ Should have prevented ${project.type} project creation outside workspace`, 'red');
      allTestsPassed = false;
    } else {
      log(`  ❌ ${project.type} project failed for unexpected reason`, 'red');
      log(`     Error: ${result.stderr}`, 'yellow');
      allTestsPassed = false;
    }
  }

  // Additional test: Try to create in a random non-workspace directory
  log('\n  Testing in completely random directory...', 'blue');
  const randomDir = path.join(TEST_DIR, 'random-non-workspace-dir');
  await fs.ensureDir(randomDir);
  
  const randomResult = await safeRunCLI([
    'create', 'should-definitely-fail',
    '--type', 'web',
    '--skip-install'
  ], randomDir, 'Project creation in random directory (should fail)');

  if (!randomResult.success && randomResult.stderr.includes('only be created within a workspace')) {
    log('  ✅ Correctly prevents project creation in random directory', 'green');
  } else {
    log('  ❌ Should have prevented project creation in random directory', 'red');
    allTestsPassed = false;
  }

  // Summary
  if (allTestsPassed) {
    log('\n✅ All outside-workspace validation tests passed!', 'green');
  } else {
    log('\n❌ Some outside-workspace validation tests failed!', 'red');
  }

  return allTestsPassed;
}

async function testEdgeCaseValidation() {
  log('\n🕵️ Testing Edge Cases & Potential Workarounds', 'bold');
  
  let allTestsPassed = true;

  // Test 1: Try to create in a subdirectory of a non-workspace
  log('\n  Testing in subdirectory of non-workspace...', 'blue');
  const nonWorkspaceDir = path.join(TEST_DIR, 'not-a-workspace');
  const subDir = path.join(nonWorkspaceDir, 'some', 'deep', 'path');
  await fs.ensureDir(subDir);
  
  const subDirResult = await safeRunCLI([
    'create', 'sneaky-attempt',
    '--type', 'web',
    '--skip-install'
  ], subDir, 'Project creation in subdirectory (should fail)');

  if (!subDirResult.success && subDirResult.stderr.includes('only be created within a workspace')) {
    log('  ✅ Correctly prevents project creation in subdirectory of non-workspace', 'green');
  } else {
    log('  ❌ Should have prevented project creation in subdirectory', 'red');
    allTestsPassed = false;
  }

  // Test 2: Try to create in a directory that has package.json but no workspaces property
  log('\n  Testing in directory with package.json but no workspaces...', 'blue');
  const fakeWorkspaceDir = path.join(TEST_DIR, 'fake-workspace');
  await fs.ensureDir(fakeWorkspaceDir);
  await fs.writeJSON(path.join(fakeWorkspaceDir, 'package.json'), {
    name: 'fake-workspace',
    version: '1.0.0',
    // Note: no workspaces property
  });

  const fakeWorkspaceResult = await safeRunCLI([
    'create', 'fake-workspace-test',
    '--type', 'web',
    '--skip-install'
  ], fakeWorkspaceDir, 'Project creation in fake workspace (should fail)');

  if (!fakeWorkspaceResult.success && fakeWorkspaceResult.stderr.includes('only be created within a workspace')) {
    log('  ✅ Correctly rejects directory with package.json but no workspaces', 'green');
  } else {
    log('  ❌ Should have rejected fake workspace directory', 'red');
    allTestsPassed = false;
  }

  // Test 3: Try to create in a directory with malformed package.json
  log('\n  Testing in directory with malformed package.json...', 'blue');
  const malformedDir = path.join(TEST_DIR, 'malformed-workspace');
  await fs.ensureDir(malformedDir);
  await fs.writeFile(path.join(malformedDir, 'package.json'), '{ invalid json }');

  const malformedResult = await safeRunCLI([
    'create', 'malformed-test',
    '--type', 'web',
    '--skip-install'
  ], malformedDir, 'Project creation with malformed package.json (should fail)');

  if (!malformedResult.success && malformedResult.stderr.includes('only be created within a workspace')) {
    log('  ✅ Correctly handles malformed package.json', 'green');
  } else {
    log('  ❌ Should have rejected directory with malformed package.json', 'red');
    allTestsPassed = false;
  }

  // Test 4: Try all project types with various invalid names outside workspace
  log('\n  Testing various invalid scenarios...', 'blue');
  const invalidTests = [
    { args: ['create', 'test-with-spaces in name', '--type', 'web'], description: 'invalid name outside workspace' },
    { args: ['create', '', '--type', 'native'], description: 'empty name outside workspace' },
    { args: ['create', 'valid-name', '--type', 'invalid-type'], description: 'invalid type outside workspace' }
  ];

  for (const test of invalidTests) {
    const result = await safeRunCLI([...test.args, '--skip-install'], TEST_DIR, test.description);
    if (!result.success) {
      log(`  ✅ Correctly rejected: ${test.description}`, 'green');
    } else {
      log(`  ❌ Should have rejected: ${test.description}`, 'red');
      allTestsPassed = false;
    }
  }

  // Summary
  if (allTestsPassed) {
    log('\n✅ All edge case validation tests passed!', 'green');
  } else {
    log('\n❌ Some edge case validation tests failed!', 'red');
  }

  return allTestsPassed;
}

async function testErrorHandling() {
  log('\n❌ Testing Error Handling', 'bold');
  
  // First create a workspace for valid error testing
  await safeRunCLI(['init', 'error-test-workspace', '--skip-install'], TEST_DIR, 'Error test workspace');
  const workspacePath = path.join(TEST_DIR, 'error-test-workspace');
  
  // Test invalid project type
  const invalidTypeResult = await safeRunCLI([
    'create', 'test-invalid',
    '--type', 'invalid'
  ], workspacePath, 'Invalid project type test');

  if (!invalidTypeResult.success && invalidTypeResult.stderr.includes('Invalid project type')) {
    log('✅ Invalid project type error handled correctly', 'green');
  } else {
    log('❌ Invalid project type error not handled correctly', 'red');
  }

  // Test invalid project name
  const invalidNameResult = await safeRunCLI([
    'create', 'Invalid Project Name',
    '--type', 'web'
  ], workspacePath, 'Invalid project name test');

  if (!invalidNameResult.success && invalidNameResult.stderr.includes('Invalid project name')) {
    log('✅ Invalid project name error handled correctly', 'green');
  } else {
    log('❌ Invalid project name error not handled correctly', 'red');
  }
}

async function testHelpAndVersion() {
  log('\n❓ Testing Help and Version', 'bold');
  
  // Test version
  const versionResult = await safeRunCLI(['--version'], TEST_DIR, 'Version command');
  if (versionResult.success && /\d+\.\d+\.\d+/.test(versionResult.stdout)) {
    log('✅ Version command works', 'green');
  } else {
    log('❌ Version command failed', 'red');
  }

  // Test help
  const helpResult = await safeRunCLI(['--help'], TEST_DIR, 'Help command');
  if (helpResult.success && helpResult.stdout.includes('CLI tool for generating Idealyst Framework projects')) {
    log('✅ Help command works', 'green');
  } else {
    log('❌ Help command failed', 'red');
  }
}

async function main() {
  log('🧪 Idealyst CLI Manual Testing Suite', 'bold');
  log('=====================================\n', 'bold');

  try {
    // Check if CLI is built
    if (!await fs.pathExists(CLI_PATH)) {
      log('❌ CLI not built. Run "cd packages/cli && yarn build" first.', 'red');
      process.exit(1);
    }

    log(`📁 Test directory: ${TEST_DIR}`, 'blue');
    log(`⚙️ CLI path: ${CLI_PATH}`, 'blue');
    log(`⏱️ Command timeout: ${COMMAND_TIMEOUT/1000}s`, 'blue');
    log('🏗️ Testing proper monorepo workflow: workspace-first approach', 'blue');
    
    // Clean up and prepare test directory
    await cleanupTestDir();
    
    // Run all tests with individual error handling
    try {
      await testWorkspaceGeneration();
    } catch (error) {
      log(`💥 Workspace generation test failed: ${error.message}`, 'red');
    }
    
    try {
      await testProjectsWithinWorkspace();
    } catch (error) {
      log(`💥 Projects within workspace test failed: ${error.message}`, 'red');
    }
    
    try {
      await testOutsideWorkspaceValidation();
    } catch (error) {
      log(`💥 Outside workspace validation test failed: ${error.message}`, 'red');
    }
    
    try {
      await testEdgeCaseValidation();
    } catch (error) {
      log(`💥 Edge case validation test failed: ${error.message}`, 'red');
    }
    
    try {
      await testErrorHandling();
    } catch (error) {
      log(`💥 Error handling test failed: ${error.message}`, 'red');
    }
    
    try {
      await testHelpAndVersion();
    } catch (error) {
      log(`💥 Help and version test failed: ${error.message}`, 'red');
    }
    
    log('\n🎉 Manual testing complete!', 'green');
    log(`📁 Check generated files in: ${TEST_DIR}`, 'blue');
    log('💡 New workflow: Create workspace first, then add projects within it', 'yellow');
    
  } catch (error) {
    log(`\n💥 Test suite failed with error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  log('\n⚠️ Test interrupted by user', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n⚠️ Test terminated', 'yellow');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runCLI,
  safeRunCLI,
  checkFileExists,
  checkFileContent,
  TEST_DIR,
  CLI_PATH
}; 
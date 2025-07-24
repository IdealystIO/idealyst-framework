#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const { tmpdir } = require('os');

const TEST_DIR = path.join(tmpdir(), 'idealyst-trpc-integration-test');
const CLI_PATH = path.resolve(__dirname, '../packages/cli/dist/index.js');

console.log('🧪 tRPC Integration Test Suite');
console.log('===============================');
console.log(`📁 Test directory: ${TEST_DIR}`);
console.log(`⚙️ CLI path: ${CLI_PATH}`);

async function cleanup() {
  if (await fs.pathExists(TEST_DIR)) {
    await fs.remove(TEST_DIR);
  }
}

function runCommand(args, cwd = TEST_DIR, input = null) {
  return new Promise((resolve) => {
    console.log(`  Running: node ${CLI_PATH} ${args.join(' ')}`);
    
    const stdio = input !== null || args.includes('--help') ? 'pipe' : 'inherit';
    const child = spawn('node', [CLI_PATH, ...args], {
      cwd,
      stdio,
    });

    let stdout = '';
    let stderr = '';

    if (stdio === 'pipe') {
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
      
      if (input) {
        child.stdin?.write(input);
        child.stdin?.end();
      }
    }

    child.on('close', (exitCode) => {
      resolve({ exitCode, stdout, stderr });
    });
  });
}

async function testTrpcWebProject() {
  console.log('\n🌐 Testing Web Project with tRPC Flag');
  
  const workspaceDir = path.join(TEST_DIR, 'test-workspace');
  const { exitCode } = await runCommand([
    'create', 'test-web-trpc',
    '--type', 'web',
    '--with-trpc',
    '--skip-install'
  ], workspaceDir);

  if (exitCode !== 0) {
    console.log('❌ Failed to create web project with tRPC');
    return false;
  }

  const projectPath = path.join(workspaceDir, 'packages', 'test-web-trpc');
  
  // Check tRPC utilities exist
  const trpcUtilsPath = path.join(projectPath, 'src', 'utils', 'trpc.ts');
  if (!await fs.pathExists(trpcUtilsPath)) {
    console.log('❌ tRPC utilities file not found');
    return false;
  }

  // Check tRPC utils content
  const trpcContent = await fs.readFile(trpcUtilsPath, 'utf8');
  if (!trpcContent.includes('createTRPCReact') || !trpcContent.includes('httpBatchLink')) {
    console.log('❌ tRPC utilities content incorrect');
    return false;
  }

  // Check App component has tRPC setup
  const appPath = path.join(projectPath, 'src', 'App.tsx');
  const appContent = await fs.readFile(appPath, 'utf8');
  if (!appContent.includes('trpc.Provider') || !appContent.includes('QueryClientProvider')) {
    console.log('❌ App component not properly configured for tRPC');
    return false;
  }

  // Check package.json has tRPC dependencies
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await fs.readJSON(packageJsonPath);
  const requiredDeps = ['@trpc/client', '@trpc/react-query', '@tanstack/react-query'];
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep]) {
      console.log(`❌ Missing dependency: ${dep}`);
      return false;
    }
  }

  console.log('✅ Web project with tRPC created successfully');
  return true;
}

async function testWebProjectWithoutTrpc() {
  console.log('\n🌐 Testing Web Project without tRPC (using stdin input)');
  
  const workspaceDir = path.join(TEST_DIR, 'test-workspace');
  // Send explicit "no" to the prompt
  const { exitCode, stdout } = await runCommand([
    'create', 'test-web-no-trpc',
    '--type', 'web',
    '--skip-install'
  ], workspaceDir, 'n\n');

  console.log('  Command output snippet:', stdout.substring(0, 200) + '...');

  if (exitCode !== 0) {
    console.log('❌ Failed to create web project without tRPC');
    return false;
  }

  const projectPath = path.join(workspaceDir, 'packages', 'test-web-no-trpc');
  
  // Check tRPC utilities DON'T exist
  const trpcUtilsPath = path.join(projectPath, 'src', 'utils', 'trpc.ts');
  if (await fs.pathExists(trpcUtilsPath)) {
    console.log('❌ tRPC utilities should not exist');
    console.log(`  Found file at: ${trpcUtilsPath}`);
    return false;
  }

  // Check App component doesn't have tRPC setup
  const appPath = path.join(projectPath, 'src', 'App.tsx');
  const appContent = await fs.readFile(appPath, 'utf8');
  if (appContent.includes('trpc.Provider')) {
    console.log('❌ App component should not have tRPC setup');
    return false;
  }

  // Check package.json doesn't have tRPC dependencies
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await fs.readJSON(packageJsonPath);
  const trpcDeps = ['@trpc/client', '@trpc/react-query', '@tanstack/react-query'];
  for (const dep of trpcDeps) {
    if (packageJson.dependencies[dep]) {
      console.log(`❌ Should not have dependency: ${dep}`);
      return false;
    }
  }

  console.log('✅ Web project without tRPC created successfully');
  return true;
}

async function testApiProject() {
  console.log('\n🚀 Testing API Project');
  
  const workspaceDir = path.join(TEST_DIR, 'test-workspace');
  const { exitCode } = await runCommand([
    'create', 'test-api',
    '--type', 'api',
    '--skip-install'
  ], workspaceDir);

  if (exitCode !== 0) {
    console.log('❌ Failed to create API project');
    return false;
  }

  const projectPath = path.join(workspaceDir, 'packages', 'test-api');
  
  // Check exports file exists with proper exports
  const indexPath = path.join(projectPath, 'src', 'index.ts');
  if (!await fs.pathExists(indexPath)) {
    console.log('❌ API exports file not found');
    return false;
  }

  const indexContent = await fs.readFile(indexPath, 'utf8');
  if (!indexContent.includes('export { appRouter }') || !indexContent.includes('export type { AppRouter }')) {
    console.log('❌ API exports not properly configured');
    return false;
  }

  // Check server file exists
  const serverPath = path.join(projectPath, 'src', 'server.ts');
  if (!await fs.pathExists(serverPath)) {
    console.log('❌ API server file not found');
    return false;
  }

  console.log('✅ API project created successfully');
  return true;
}

async function testHelpFlags() {
  console.log('\n❓ Testing Help and Flags');
  
  const { exitCode, stdout } = await runCommand(['create', '--help'], TEST_DIR, '');
  
  if (exitCode !== 0) {
    console.log('❌ Help command failed');
    return false;
  }

  if (!stdout.includes('--with-trpc') && !stdout.includes('Include tRPC boilerplate')) {
    console.log('❌ Help does not show --with-trpc flag');
    console.log('Help output:', stdout);
    return false;
  }

  console.log('✅ Help shows tRPC flag correctly');
  return true;
}

async function runTests() {
  let allPassed = true;

  try {
    // Setup
    await cleanup();
    await fs.ensureDir(TEST_DIR);

    // Create workspace first
    console.log('\n🏗️ Creating test workspace');
    const { exitCode } = await runCommand(['init', 'test-workspace', '--skip-install']);
    if (exitCode !== 0) {
      console.log('❌ Failed to create workspace');
      return;
    }
    console.log('✅ Workspace created');

    // Run tests
    allPassed &= await testTrpcWebProject();
    allPassed &= await testWebProjectWithoutTrpc();
    allPassed &= await testApiProject();
    allPassed &= await testHelpFlags();

    // Summary
    console.log('\n🎉 Test Summary');
    console.log('================');
    if (allPassed) {
      console.log('✅ All tRPC integration tests passed!');
    } else {
      console.log('❌ Some tests failed');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Test suite error:', error);
    process.exit(1);
  } finally {
    await cleanup();
  }
}

// Run tests
runTests().catch(console.error); 
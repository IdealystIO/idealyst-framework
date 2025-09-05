#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Load ignore patterns from .templateignore file
function loadIgnorePatterns() {
  const ignoreFile = path.join(__dirname, '..', '.templateignore');
  
  try {
    const content = fs.readFileSync(ignoreFile, 'utf8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(pattern => pattern.replace(/\/$/, '')); // Remove trailing slashes
  } catch (error) {
    console.log('⚠️  No .templateignore file found, using default patterns');
    return [
      '.DS_Store',
      'Thumbs.db',
      '*.tmp',
      '*.temp',
      '*.log',
      'node_modules/',
      '.git/',
      '.vscode/',
      '.idea/',
      'dist/',
      'build/',
      '*.swp',
      '*.swo',
      '*~'
    ];
  }
}

function shouldExclude(filePath, patterns) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(process.cwd(), filePath);
  
  return patterns.some(pattern => {
    // Handle glob patterns
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\//g, '\\/'));
      return regex.test(fileName) || regex.test(relativePath);
    }
    
    // Handle directory patterns - check if the file is inside the directory
    if (pattern.endsWith('/')) {
      const dirPattern = pattern.slice(0, -1); // Remove trailing slash
      // Check if any part of the path contains this directory
      const pathParts = relativePath.split(path.sep);
      return pathParts.includes(dirPattern);
    }
    
    if (pattern === '.git') {
      // Special case: .git directory, but allow .gitignore files
      return relativePath.includes('.git' + path.sep) && !fileName.includes('.gitignore');
    }
    
    if (pattern === 'node_modules') {
      // Special case: node_modules directory
      const pathParts = relativePath.split(path.sep);
      return pathParts.includes('node_modules');
    }
    
    // Handle exact matches
    return fileName === pattern || relativePath === pattern;
  });
}

async function copyTemplatesWithFilter(source, target, patterns) {
  await fs.ensureDir(target);
  
  const items = await fs.readdir(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    if (shouldExclude(sourcePath, patterns)) {
      console.log(`   ⚠️  Excluding: ${path.relative(source, sourcePath)}`);
      continue;
    }
    
    const stat = await fs.stat(sourcePath);
    
    if (stat.isDirectory()) {
      await copyTemplatesWithFilter(sourcePath, targetPath, patterns);
    } else {
      await fs.copy(sourcePath, targetPath);
    }
  }
}

async function build() {
  console.log('🧹 Cleaning previous build...');
  
  // Clean dist directory completely
  await fs.remove('dist');
  
  console.log('🏗️  Building TypeScript...');
  
  try {
    execSync('npx tsc', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ TypeScript build failed!');
    process.exit(1);
  }
  
  console.log('📁 Loading ignore patterns...');
  const ignorePatterns = loadIgnorePatterns();
  console.log(`   Found ${ignorePatterns.length} ignore patterns`);
  
  console.log('📁 Copying fresh templates (with filtering)...');
  
  const templatesSource = path.join(__dirname, '..', 'templates');
  const templatesTarget = path.join(__dirname, '..', 'dist', 'templates');
  
  // Copy docs directory if it exists
  const docsSource = path.join(__dirname, '..', 'docs');
  const docsTarget = path.join(__dirname, '..', 'dist', 'docs');
  
  // Ensure target directories don't exist before copying
  await fs.remove(templatesTarget);
  await fs.remove(docsTarget);
  
  try {
    await copyTemplatesWithFilter(templatesSource, templatesTarget, ignorePatterns);
    
    // Copy docs if they exist
    if (await fs.pathExists(docsSource)) {
      await fs.copy(docsSource, docsTarget);
      console.log('   📚 Copied documentation files');
    }
  } catch (error) {
    console.error('❌ Template copy failed:', error.message);
    process.exit(1);
  }
  
  console.log('🔍 Verifying template structure...');
  
  try {
    const templateDirs = await fs.readdir(templatesTarget);
    console.log('✅ Templates copied successfully:');
    templateDirs.sort().forEach(dir => {
      console.log(`   📂 ${dir}`);
    });
    
    // Count total files copied
    const totalFiles = await countFiles(templatesTarget);
    console.log(`   📄 Total files: ${totalFiles}`);
    
  } catch (error) {
    console.error('❌ Template verification failed!');
    process.exit(1);
  }
  
  console.log('🎉 Build completed successfully!');
}

async function countFiles(dir) {
  let count = 0;
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = await fs.stat(itemPath);
    
    if (stat.isDirectory()) {
      count += await countFiles(itemPath);
    } else {
      count++;
    }
  }
  
  return count;
}

build().catch(error => {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
});

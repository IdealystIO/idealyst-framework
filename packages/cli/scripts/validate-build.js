#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

async function validateBuild() {
  console.log('🔍 Validating CLI build...');
  
  const distPath = path.join(__dirname, '..', 'dist');
  const templatesPath = path.join(distPath, 'templates');
  
  // Check if dist directory exists
  if (!await fs.pathExists(distPath)) {
    console.error('❌ Dist directory not found! Run npm run build first.');
    process.exit(1);
  }
  
  // Check if main CLI file exists
  const mainFile = path.join(distPath, 'index.js');
  if (!await fs.pathExists(mainFile)) {
    console.error('❌ Main CLI file (index.js) not found!');
    process.exit(1);
  }
  
  // Check if templates directory exists
  if (!await fs.pathExists(templatesPath)) {
    console.error('❌ Templates directory not found!');
    process.exit(1);
  }
  
  // Check for required template directories
  const requiredTemplates = ['api', 'database', 'native', 'shared', 'web', 'workspace'];
  const existingTemplates = await fs.readdir(templatesPath);
  
  const missingTemplates = requiredTemplates.filter(template => 
    !existingTemplates.includes(template)
  );
  
  if (missingTemplates.length > 0) {
    console.error(`❌ Missing template directories: ${missingTemplates.join(', ')}`);
    process.exit(1);
  }
  
  // Check for unwanted files in templates
  const unwantedPatterns = ['.DS_Store', 'node_modules', '.git', '.vscode'];
  let foundUnwanted = false;
  
  for (const template of existingTemplates) {
    const templatePath = path.join(templatesPath, template);
    const files = await getAllFiles(templatePath);
    
    for (const file of files) {
      const relativePath = path.relative(templatePath, file);
      if (unwantedPatterns.some(pattern => relativePath.includes(pattern))) {
        console.error(`❌ Unwanted file found: ${template}/${relativePath}`);
        foundUnwanted = true;
      }
    }
  }
  
  if (foundUnwanted) {
    console.error('❌ Build validation failed due to unwanted files!');
    process.exit(1);
  }
  
  console.log('✅ Build validation passed!');
  console.log(`   📂 Found ${existingTemplates.length} template directories`);
  
  // Count total files
  const totalFiles = await countAllFiles(templatesPath);
  console.log(`   📄 Total template files: ${totalFiles}`);
  
  console.log('🎉 CLI build is ready for distribution!');
}

async function getAllFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = await fs.stat(itemPath);
    
    if (stat.isDirectory()) {
      const subFiles = await getAllFiles(itemPath);
      files.push(...subFiles);
    } else {
      files.push(itemPath);
    }
  }
  
  return files;
}

async function countAllFiles(dir) {
  const files = await getAllFiles(dir);
  return files.length;
}

validateBuild().catch(error => {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
});

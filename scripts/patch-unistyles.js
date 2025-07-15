#!/usr/bin/env node

/**
 * patch-unistyles.js
 * Patches react-native-unistyles plugin to fix the map/concat order issue
 * Usage: node scripts/patch-unistyles.js [directory]
 * If no directory is provided, searches from current directory
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function findUnistylesPlugins(searchDir) {
  const plugins = [];
  
  function searchRecursively(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Check if this is the exact path we're looking for
          if (fullPath.endsWith(path.join('node_modules', 'react-native-unistyles', 'plugin'))) {
            const indexPath = path.join(fullPath, 'index.js');
            if (fs.existsSync(indexPath)) {
              plugins.push(indexPath);
            }
          } else if (entry.name !== 'node_modules' || !fullPath.includes('node_modules')) {
            // Continue searching, but avoid nested node_modules
            searchRecursively(fullPath);
          } else if (entry.name === 'node_modules') {
            // Only search one level deep in node_modules
            try {
              const nodeModulesEntries = fs.readdirSync(fullPath, { withFileTypes: true });
              for (const nmEntry of nodeModulesEntries) {
                if (nmEntry.name === 'react-native-unistyles' && nmEntry.isDirectory()) {
                  const pluginPath = path.join(fullPath, 'react-native-unistyles', 'plugin', 'index.js');
                  if (fs.existsSync(pluginPath)) {
                    plugins.push(pluginPath);
                  }
                }
              }
            } catch (error) {
              // Skip if we can't read the node_modules directory
            }
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  searchRecursively(searchDir);
  return plugins;
}

function patchPluginFile(pluginPath) {
  log(colors.green, `📦 Found react-native-unistyles plugin at: ${pluginPath}`);
  
  try {
    let content = fs.readFileSync(pluginPath, 'utf8');
    
    // The problematic line pattern (old version)
    const oldPattern = /REPLACE_WITH_UNISTYLES_PATHS\.map\(toPlatformPath\)\.concat\(state\.opts\.autoProcessPaths \?\? \[\]\)/g;
    
    // The fixed version  
    const newPattern = 'REPLACE_WITH_UNISTYLES_PATHS.concat(state.opts.autoProcessPaths ?? []).map(toPlatformPath)';

    if (oldPattern.test(content)) {
      log(colors.blue, `🔧 Applying patch to: ${pluginPath}`);
      
      // Create backup
      const backupPath = `${pluginPath}.backup`;
      fs.writeFileSync(backupPath, content, 'utf8');
      log(colors.blue, `📁 Created backup at: ${backupPath}`);
      
      // Reset regex lastIndex and apply patch
      oldPattern.lastIndex = 0;
      content = content.replace(oldPattern, newPattern);
      
      // Write the patched content back
      fs.writeFileSync(pluginPath, content, 'utf8');
      log(colors.green, `✅ Successfully patched: ${pluginPath}`);
      return true;
    } else {
      log(colors.yellow, `ℹ️  Already patched or different version: ${pluginPath}`);
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ Error patching ${pluginPath}: ${error.message}`);
    return false;
  }
}

function main() {
  log(colors.blue, '🔧 React Native Unistyles Patcher');
  
  // Set search directory (default to current directory)
  const searchDir = process.argv[2] || '.';
  const absoluteSearchDir = path.resolve(searchDir);
  
  if (!fs.existsSync(absoluteSearchDir)) {
    log(colors.red, `❌ Directory '${searchDir}' does not exist`);
    process.exit(1);
  }
  
  if (!fs.statSync(absoluteSearchDir).isDirectory()) {
    log(colors.red, `❌ '${searchDir}' is not a directory`);
    process.exit(1);
  }
  
  log(colors.blue, `🔍 Searching for react-native-unistyles installations in: ${absoluteSearchDir}`);
  
  // Find all plugin files
  const pluginFiles = findUnistylesPlugins(absoluteSearchDir);
  
  if (pluginFiles.length === 0) {
    log(colors.yellow, `⚠️  No react-native-unistyles installations found in ${absoluteSearchDir}`);
    process.exit(0);
  }
  
  log(colors.blue, `📋 Found ${pluginFiles.length} react-native-unistyles installation(s)`);
  
  // Patch each plugin file
  let patchedCount = 0;
  for (const pluginPath of pluginFiles) {
    console.log('');
    if (patchPluginFile(pluginPath)) {
      patchedCount++;
    }
  }
  
  console.log('');
  log(colors.green, '🎉 Patch process completed!');
  log(colors.green, `   Patched ${patchedCount} out of ${pluginFiles.length} installations`);
  
  if (patchedCount > 0) {
    log(colors.blue, '💡 What was fixed:');
    log(colors.blue, '   Changed: REPLACE_WITH_UNISTYLES_PATHS.map(toPlatformPath).concat(...)');
    log(colors.blue, '   To:      REPLACE_WITH_UNISTYLES_PATHS.concat(...).map(toPlatformPath)');
  }
}

// Run the patcher
main(); 
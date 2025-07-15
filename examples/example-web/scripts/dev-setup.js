const fs = require('fs');
const path = require('path');

// Create lib directory structure for development
// This works around the babel plugin's isInsideNodeModules limitation
function createDevStructure() {
  const libDir = path.join(__dirname, '../lib/@idealyst');
  const nodeModulesDir = path.join(__dirname, '../node_modules/@idealyst');
  
  // Clean up existing lib directory
  if (fs.existsSync(libDir)) {
    fs.rmSync(libDir, { recursive: true, force: true });
  }
  
  // Create lib directory
  fs.mkdirSync(libDir, { recursive: true });
  
  // Create symbolic links for each package
  const packages = ['components', 'navigation', 'theme'];
  
  packages.forEach(pkg => {
    const srcPath = path.join(nodeModulesDir, pkg);
    const linkPath = path.join(libDir, pkg);
    
    if (fs.existsSync(srcPath)) {
      try {
        // Try to create a symbolic link
        fs.symlinkSync(srcPath, linkPath, 'junction');
        console.log(`✅ Created symbolic link: lib/@idealyst/${pkg} -> node_modules/@idealyst/${pkg}`);
      } catch (error) {
        console.warn(`⚠️  Could not create symbolic link for ${pkg}, copying instead...`);
        // Fallback to copying if symbolic link fails
        copyDir(srcPath, linkPath);
        console.log(`✅ Copied: lib/@idealyst/${pkg}`);
      }
    } else {
      console.warn(`⚠️  Package not found: node_modules/@idealyst/${pkg}`);
    }
  });
  
  console.log('\n🎉 Development structure created! You can now use the npm packages with babel processing.');
  console.log('💡 The lib folder is for development only and should not be committed to git.');
}

// Helper function to copy directory
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Run the setup
createDevStructure(); 
/**
 * Template file copying utilities
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData } from '../types';
import { processTemplateContent } from './processor';
import { IGNORE_PATTERNS, TEMPLATE_EXTENSIONS } from '../constants';

/**
 * Check if a path matches any ignore patterns
 */
function shouldIgnore(filePath: string): boolean {
  const basename = path.basename(filePath);

  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.includes('*')) {
      // Simple glob matching for *.ext patterns
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      if (regex.test(basename)) {
        return true;
      }
    } else if (basename === pattern) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a file should have template variables processed
 */
function shouldProcessTemplate(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return TEMPLATE_EXTENSIONS.includes(ext as typeof TEMPLATE_EXTENSIONS[number]);
}

/**
 * Copy a template directory with variable replacement
 */
export async function copyTemplateDirectory(
  sourceDir: string,
  destDir: string,
  data: TemplateData
): Promise<void> {
  // Ensure destination exists
  await fs.ensureDir(destDir);

  // Check if source exists
  if (!await fs.pathExists(sourceDir)) {
    throw new Error(`Template directory not found: ${sourceDir}`);
  }

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    let destName = entry.name;

    // Handle .template suffix (for dotfiles)
    if (destName.endsWith('.template')) {
      destName = '.' + destName.replace('.template', '');
    }

    const destPath = path.join(destDir, destName);

    // Skip ignored files/directories
    if (shouldIgnore(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      // Recursively copy directory
      await copyTemplateDirectory(sourcePath, destPath, data);
    } else {
      // Copy file
      if (shouldProcessTemplate(sourcePath)) {
        // Read, process, and write
        const content = await fs.readFile(sourcePath, 'utf8');
        const processed = processTemplateContent(content, data);
        await fs.writeFile(destPath, processed);
      } else {
        // Binary file - copy directly
        await fs.copy(sourcePath, destPath);
      }
    }
  }
}

/**
 * Copy a single template file with variable replacement
 */
export async function copyTemplateFile(
  sourceFile: string,
  destFile: string,
  data: TemplateData
): Promise<void> {
  await fs.ensureDir(path.dirname(destFile));

  if (shouldProcessTemplate(sourceFile)) {
    const content = await fs.readFile(sourceFile, 'utf8');
    const processed = processTemplateContent(content, data);
    await fs.writeFile(destFile, processed);
  } else {
    await fs.copy(sourceFile, destFile);
  }
}

/**
 * Get the path to a template directory
 */
export function getTemplatePath(...segments: string[]): string {
  // In production, templates are in dist/templates
  // In development, they're in templates/
  const distPath = path.resolve(__dirname, '..', '..', 'templates', ...segments);
  const devPath = path.resolve(__dirname, '..', '..', '..', 'templates', ...segments);

  if (fs.existsSync(distPath)) {
    return distPath;
  }
  return devPath;
}

/**
 * Check if a template exists and has content
 */
export async function templateExists(...segments: string[]): Promise<boolean> {
  const templatePath = getTemplatePath(...segments);
  if (!await fs.pathExists(templatePath)) {
    return false;
  }

  // Check if directory has any files
  const entries = await fs.readdir(templatePath);
  return entries.length > 0;
}

/**
 * Check if a template has content (non-empty directory)
 */
export async function templateHasContent(templatePath: string): Promise<boolean> {
  if (!await fs.pathExists(templatePath)) {
    return false;
  }

  const entries = await fs.readdir(templatePath);
  return entries.length > 0;
}

/**
 * File system utilities for template copying and file operations
 */

import fs from 'fs-extra';
import path from 'path';
import { IGNORE_PATTERNS, TEMPLATE_EXTENSIONS } from '../constants';
import { TemplateData } from '../types';

/**
 * Check if a path matches any ignore patterns
 */
export function shouldIgnore(filePath: string): boolean {
  const basename = path.basename(filePath);

  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.includes('*')) {
      // Simple glob matching for *.ext patterns
      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
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
export function shouldProcessTemplate(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return TEMPLATE_EXTENSIONS.includes(ext as typeof TEMPLATE_EXTENSIONS[number]);
}

/**
 * Replace template variables in content
 */
export function processTemplateContent(content: string, data: TemplateData): string {
  let result = content;

  // Replace all {{variable}} patterns
  result = result.replace(/\{\{projectName\}\}/g, data.projectName);
  result = result.replace(/\{\{packageName\}\}/g, data.packageName);
  result = result.replace(/\{\{workspaceScope\}\}/g, data.workspaceScope);
  result = result.replace(/\{\{version\}\}/g, data.version);
  result = result.replace(/\{\{description\}\}/g, data.description);
  result = result.replace(/\{\{appDisplayName\}\}/g, data.appDisplayName);
  result = result.replace(/\{\{iosBundleId\}\}/g, data.iosBundleId);
  result = result.replace(/\{\{androidPackageName\}\}/g, data.androidPackageName);
  result = result.replace(/\{\{idealystVersion\}\}/g, data.idealystVersion);

  // Boolean flags for conditional content
  result = result.replace(/\{\{hasApi\}\}/g, String(data.hasApi));
  result = result.replace(/\{\{hasPrisma\}\}/g, String(data.hasPrisma));
  result = result.replace(/\{\{hasTrpc\}\}/g, String(data.hasTrpc));
  result = result.replace(/\{\{hasGraphql\}\}/g, String(data.hasGraphql));

  return result;
}

/**
 * Copy a template directory with variable replacement
 */
export async function copyTemplate(
  sourceDir: string,
  destDir: string,
  data: TemplateData
): Promise<void> {
  // Ensure destination exists
  await fs.ensureDir(destDir);

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
      await copyTemplate(sourcePath, destPath, data);
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
 * Ensure a directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

/**
 * Check if a path exists
 */
export async function pathExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

/**
 * Read a JSON file
 */
export async function readJson<T = unknown>(filePath: string): Promise<T> {
  return fs.readJson(filePath);
}

/**
 * Write a JSON file
 */
export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await fs.writeJson(filePath, data, { spaces: 2 });
}

/**
 * Read a text file
 */
export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf8');
}

/**
 * Write a text file
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf8');
}

/**
 * Copy a file
 */
export async function copyFile(source: string, dest: string): Promise<void> {
  await fs.copy(source, dest);
}

/**
 * Remove a file or directory
 */
export async function remove(filePath: string): Promise<void> {
  await fs.remove(filePath);
}

/**
 * Get the template path for cli-beta
 */
export function getTemplatePath(templateName: string): string {
  // In development, templates are in ../templates relative to dist
  // In production, they're in the same dist folder
  const distPath = path.resolve(__dirname, '..', '..', 'templates', templateName);
  const srcPath = path.resolve(__dirname, '..', '..', '..', 'templates', templateName);

  // Check dist first (production), then src (development)
  if (fs.existsSync(distPath)) {
    return distPath;
  }
  return srcPath;
}

/**
 * Package.json merging utilities
 */

import fs from 'fs-extra';

/**
 * Deep merge two objects, with source taking precedence
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    const sourceValue = source[key as keyof T];
    const targetValue = target[key as keyof T];

    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // Recursively merge nested objects
      output[key as keyof T] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[keyof T];
    } else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
      // Merge arrays by concatenating unique values
      output[key as keyof T] = [
        ...new Set([...targetValue, ...sourceValue])
      ] as T[keyof T];
    } else {
      // Override with source value
      output[key as keyof T] = sourceValue as T[keyof T];
    }
  }

  return output;
}

/**
 * Package.json structure
 */
export interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  main?: string;
  types?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  workspaces?: string[];
  [key: string]: unknown;
}

/**
 * Merge additional configuration into a package.json file
 */
export async function mergePackageJson(
  filePath: string,
  additions: Partial<PackageJson>
): Promise<void> {
  const existing = await fs.readJson(filePath) as PackageJson;
  const merged = deepMerge(existing, additions);
  await fs.writeJson(filePath, merged, { spaces: 2 });
}

/**
 * Add dependencies to a package.json file
 */
export async function addDependencies(
  filePath: string,
  dependencies: Record<string, string>,
  type: 'dependencies' | 'devDependencies' | 'peerDependencies' = 'dependencies'
): Promise<void> {
  const packageJson = await fs.readJson(filePath) as PackageJson;

  if (!packageJson[type]) {
    packageJson[type] = {};
  }

  packageJson[type] = {
    ...packageJson[type],
    ...dependencies,
  };

  // Sort dependencies alphabetically
  packageJson[type] = Object.keys(packageJson[type]!)
    .sort()
    .reduce((acc, key) => {
      acc[key] = packageJson[type]![key];
      return acc;
    }, {} as Record<string, string>);

  await fs.writeJson(filePath, packageJson, { spaces: 2 });
}

/**
 * Remove dependencies from a package.json file
 */
export async function removeDependencies(
  filePath: string,
  dependencyNames: string[],
  type: 'dependencies' | 'devDependencies' | 'peerDependencies' = 'dependencies'
): Promise<void> {
  const packageJson = await fs.readJson(filePath) as PackageJson;

  if (!packageJson[type]) {
    return;
  }

  for (const name of dependencyNames) {
    delete packageJson[type]![name];
  }

  await fs.writeJson(filePath, packageJson, { spaces: 2 });
}

/**
 * Add scripts to a package.json file
 */
export async function addScripts(
  filePath: string,
  scripts: Record<string, string>
): Promise<void> {
  const packageJson = await fs.readJson(filePath) as PackageJson;

  packageJson.scripts = {
    ...packageJson.scripts,
    ...scripts,
  };

  await fs.writeJson(filePath, packageJson, { spaces: 2 });
}

/**
 * Update workspace configuration in root package.json
 */
export async function addToWorkspaces(
  filePath: string,
  packagePath: string
): Promise<void> {
  const packageJson = await fs.readJson(filePath) as PackageJson;

  if (!packageJson.workspaces) {
    packageJson.workspaces = [];
  }

  if (!packageJson.workspaces.includes(packagePath)) {
    packageJson.workspaces.push(packagePath);
    packageJson.workspaces.sort();
  }

  await fs.writeJson(filePath, packageJson, { spaces: 2 });
}

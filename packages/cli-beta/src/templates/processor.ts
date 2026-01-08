/**
 * Template variable processor
 */

import { TemplateData } from '../types';

/**
 * All template variables and their patterns
 */
const TEMPLATE_VARIABLES = [
  'projectName',
  'packageName',
  'workspaceScope',
  'version',
  'description',
  'appDisplayName',
  'iosBundleId',
  'androidPackageName',
  'idealystVersion',
  'hasApi',
  'hasPrisma',
  'hasTrpc',
  'hasGraphql',
] as const;

/**
 * Process template content and replace all variables
 */
export function processTemplate(content: string, data: TemplateData): string {
  let result = content;

  for (const variable of TEMPLATE_VARIABLES) {
    const pattern = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
    const value = String(data[variable as keyof TemplateData]);
    result = result.replace(pattern, value);
  }

  return result;
}

/**
 * Process conditional blocks in templates
 * Supports: {{#if hasApi}}...{{/if}} and {{#unless hasApi}}...{{/unless}}
 */
export function processConditionals(content: string, data: TemplateData): string {
  let result = content;

  // Process {{#if variable}}...{{/if}} blocks
  const ifPattern = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  result = result.replace(ifPattern, (match, variable, block) => {
    const value = data[variable as keyof TemplateData];
    return value ? block : '';
  });

  // Process {{#unless variable}}...{{/unless}} blocks
  const unlessPattern = /\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g;
  result = result.replace(unlessPattern, (match, variable, block) => {
    const value = data[variable as keyof TemplateData];
    return !value ? block : '';
  });

  return result;
}

/**
 * Full template processing (variables + conditionals)
 */
export function processTemplateContent(content: string, data: TemplateData): string {
  let result = content;

  // First process conditionals
  result = processConditionals(result, data);

  // Then process variables
  result = processTemplate(result, data);

  return result;
}

/**
 * Build TemplateData from ProjectConfig and additional info
 */
export function buildTemplateData(config: {
  projectName: string;
  appDisplayName: string;
  iosBundleId: string;
  androidPackageName: string;
  extensions: {
    api: boolean;
    prisma: boolean;
    trpc: boolean;
    graphql: boolean;
  };
}, idealystVersion: string): TemplateData {
  return {
    projectName: config.projectName,
    packageName: `@${config.projectName}`,
    workspaceScope: config.projectName,
    version: '0.1.0',
    description: `${config.appDisplayName} - Built with Idealyst Framework`,
    appDisplayName: config.appDisplayName,
    iosBundleId: config.iosBundleId,
    androidPackageName: config.androidPackageName,
    idealystVersion,
    hasApi: config.extensions.api,
    hasPrisma: config.extensions.prisma,
    hasTrpc: config.extensions.trpc,
    hasGraphql: config.extensions.graphql,
  };
}

#!/usr/bin/env tsx

/**
 * Validate Examples Script
 *
 * Validates all example TypeScript files against the actual component types
 * to ensure they are type-correct and will compile.
 */

import { Project, Diagnostic } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationResult {
  file: string;
  success: boolean;
  errors: string[];
}

async function main() {
  console.log('🔍 Validating TypeScript examples...\n');

  const project = new Project({
    tsConfigFilePath: path.join(__dirname, '../tsconfig.examples.json'),
  });

  const examplesDir = path.join(__dirname, '../examples');

  if (!fs.existsSync(examplesDir)) {
    console.log(chalk.yellow('⚠️  No examples directory found. Skipping validation.'));
    process.exit(0);
  }

  // Find all example files
  const exampleFiles = findExampleFiles(examplesDir);

  if (exampleFiles.length === 0) {
    console.log(chalk.yellow('⚠️  No example files found. Skipping validation.'));
    process.exit(0);
  }

  console.log(`Found ${exampleFiles.length} example files\n`);

  // Add all example files to the project
  for (const filePath of exampleFiles) {
    project.addSourceFileAtPath(filePath);
  }

  // Get diagnostics (type errors)
  const diagnostics = project.getPreEmitDiagnostics();

  const results: ValidationResult[] = [];

  // Group diagnostics by file
  const diagnosticsByFile = new Map<string, Diagnostic[]>();
  for (const diagnostic of diagnostics) {
    const sourceFile = diagnostic.getSourceFile();
    if (sourceFile) {
      const filePath = sourceFile.getFilePath();
      if (!diagnosticsByFile.has(filePath)) {
        diagnosticsByFile.set(filePath, []);
      }
      diagnosticsByFile.get(filePath)!.push(diagnostic);
    }
  }

  // Create results for each file
  for (const filePath of exampleFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const fileDiagnostics = diagnosticsByFile.get(filePath) || [];

    const errors = fileDiagnostics.map(diagnostic => {
      const message = diagnostic.getMessageText();
      const line = diagnostic.getLineNumber();
      return `Line ${line}: ${typeof message === 'string' ? message : message.getMessageText()}`;
    });

    results.push({
      file: relativePath,
      success: errors.length === 0,
      errors,
    });
  }

  // Print results
  let hasErrors = false;

  for (const result of results) {
    if (result.success) {
      console.log(chalk.green('✅'), result.file);
    } else {
      hasErrors = true;
      console.log(chalk.red('❌'), result.file);
      for (const error of result.errors) {
        console.log(chalk.red('   '), error);
      }
      console.log();
    }
  }

  console.log('\n📊 Summary:');
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log(`   ${chalk.green('✅ Passed:')} ${successCount}`);
  console.log(`   ${chalk.red('❌ Failed:')} ${failCount}`);

  if (hasErrors) {
    console.log(chalk.red('\n❌ Validation failed. Please fix the type errors above.'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n✅ All examples are type-correct!'));
  }
}

function findExampleFiles(dir: string): string[] {
  const files: string[] = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findExampleFiles(fullPath));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

main().catch(error => {
  console.error(chalk.red('❌ Validation script failed:'), error);
  process.exit(1);
});

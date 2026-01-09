import * as ts from 'typescript';
import { ImportInfo, Platform } from '../types';
import { REACT_NATIVE_SOURCES, REACT_DOM_SOURCES } from '../rules';

/**
 * Options for import parsing
 */
export interface ImportParserOptions {
  /** Additional sources to treat as React Native */
  additionalNativeSources?: string[];
  /** Additional sources to treat as React DOM */
  additionalDomSources?: string[];
}

/**
 * Determines the platform for a given import source
 */
export function getPlatformForSource(
  source: string,
  options?: ImportParserOptions
): Platform {
  const nativeSources = new Set([
    ...REACT_NATIVE_SOURCES,
    ...(options?.additionalNativeSources ?? []),
  ]);

  const domSources = new Set([
    ...REACT_DOM_SOURCES,
    ...(options?.additionalDomSources ?? []),
  ]);

  // Check for exact matches first
  if (nativeSources.has(source)) return 'react-native';
  if (domSources.has(source)) return 'react-dom';

  // Check for prefix matches (e.g., 'react-native-xxx')
  if (source.startsWith('react-native')) return 'react-native';
  if (source.startsWith('react-dom')) return 'react-dom';

  return 'neutral';
}

/**
 * Parses import statements from TypeScript/JavaScript source code
 *
 * @param sourceCode - The source code to parse
 * @param filePath - Optional file path for better error messages
 * @param options - Parser options
 * @returns Array of import information
 */
export function parseImports(
  sourceCode: string,
  filePath: string = 'unknown.tsx',
  options?: ImportParserOptions
): ImportInfo[] {
  const imports: ImportInfo[] = [];

  // Create a source file from the code
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') || filePath.endsWith('.jsx')
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS
  );

  // Walk the AST to find import declarations
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node)) {
      const importInfo = parseImportDeclaration(node, sourceFile, options);
      imports.push(...importInfo);
    }

    // Also check for require() calls
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'require' &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      const source = node.arguments[0].text;
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(
        node.getStart()
      );

      imports.push({
        name: 'require',
        source,
        platform: getPlatformForSource(source, options),
        line: line + 1,
        column: character + 1,
        isDefault: false,
        isNamespace: true,
        isTypeOnly: false,
      });
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return imports;
}

/**
 * Parses a single import declaration into ImportInfo objects
 */
function parseImportDeclaration(
  node: ts.ImportDeclaration,
  sourceFile: ts.SourceFile,
  options?: ImportParserOptions
): ImportInfo[] {
  const imports: ImportInfo[] = [];

  // Get the module specifier (the source)
  if (!ts.isStringLiteral(node.moduleSpecifier)) {
    return imports;
  }

  const source = node.moduleSpecifier.text;
  const platform = getPlatformForSource(source, options);
  const isTypeOnly = node.importClause?.isTypeOnly ?? false;

  const importClause = node.importClause;
  if (!importClause) {
    // Side-effect import: import 'module'
    return imports;
  }

  // Default import: import X from 'module'
  if (importClause.name) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(
      importClause.name.getStart()
    );

    imports.push({
      name: importClause.name.text,
      source,
      platform,
      line: line + 1,
      column: character + 1,
      isDefault: true,
      isNamespace: false,
      isTypeOnly,
    });
  }

  // Named and namespace imports
  const namedBindings = importClause.namedBindings;
  if (namedBindings) {
    if (ts.isNamespaceImport(namedBindings)) {
      // Namespace import: import * as X from 'module'
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(
        namedBindings.name.getStart()
      );

      imports.push({
        name: namedBindings.name.text,
        source,
        platform,
        line: line + 1,
        column: character + 1,
        isDefault: false,
        isNamespace: true,
        isTypeOnly,
      });
    } else if (ts.isNamedImports(namedBindings)) {
      // Named imports: import { X, Y as Z } from 'module'
      for (const element of namedBindings.elements) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(
          element.name.getStart()
        );

        const importedName = element.propertyName?.text ?? element.name.text;
        const localName = element.name.text;

        imports.push({
          name: localName,
          originalName: element.propertyName ? importedName : undefined,
          source,
          platform,
          line: line + 1,
          column: character + 1,
          isDefault: false,
          isNamespace: false,
          isTypeOnly: isTypeOnly || element.isTypeOnly,
        });
      }
    }
  }

  return imports;
}

/**
 * Filters imports to only those from platform-specific sources
 */
export function filterPlatformImports(
  imports: ImportInfo[],
  platform?: Platform
): ImportInfo[] {
  return imports.filter((imp) => {
    if (imp.platform === 'neutral') return false;
    if (platform && imp.platform !== platform) return false;
    return true;
  });
}

/**
 * Gets all unique import sources from a list of imports
 */
export function getUniqueSources(imports: ImportInfo[]): string[] {
  return [...new Set(imports.map((imp) => imp.source))];
}

/**
 * Groups imports by their source module
 */
export function groupImportsBySource(
  imports: ImportInfo[]
): Map<string, ImportInfo[]> {
  const grouped = new Map<string, ImportInfo[]>();

  for (const imp of imports) {
    const existing = grouped.get(imp.source) ?? [];
    existing.push(imp);
    grouped.set(imp.source, existing);
  }

  return grouped;
}

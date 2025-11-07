/**
 * Type Extractor Utility
 *
 * Uses TypeScript Compiler API (via ts-morph) to extract type information
 * from @idealyst packages at build time.
 */

import { Project, SourceFile, InterfaceDeclaration, TypeAliasDeclaration, EnumDeclaration } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  default?: string;
}

export interface ComponentTypeInfo {
  name: string;
  propsInterface: string;
  props: PropInfo[];
  typeDefinition: string;
  relatedTypes: Record<string, string>;
}

export interface ThemeTypeInfo {
  name: string;
  definition: string;
  values?: string[];
}

export class TypeExtractor {
  private project: Project;
  private componentsPath: string;
  private themePath: string;
  private navigationPath: string;

  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
      skipAddingFilesFromTsConfig: true,
    });

    // Resolve paths to the actual packages in the monorepo
    const monorepoRoot = path.resolve(__dirname, '../../..');
    this.componentsPath = path.join(monorepoRoot, 'packages/components/src');
    this.themePath = path.join(monorepoRoot, 'packages/theme/src');
    this.navigationPath = path.join(monorepoRoot, 'packages/navigation/src');
  }

  /**
   * Extract component type information
   */
  extractComponentTypes(componentName: string): ComponentTypeInfo | null {
    const typesFilePath = path.join(
      this.componentsPath,
      componentName,
      'types.ts'
    );

    if (!fs.existsSync(typesFilePath)) {
      console.warn(`Types file not found for ${componentName}: ${typesFilePath}`);
      return null;
    }

    const sourceFile = this.project.addSourceFileAtPath(typesFilePath);

    // Find the main props interface (e.g., ButtonProps)
    const propsInterfaceName = `${componentName}Props`;
    const propsInterface = sourceFile.getInterface(propsInterfaceName);

    if (!propsInterface) {
      console.warn(`Props interface not found: ${propsInterfaceName}`);
      return null;
    }

    const props = this.extractPropsFromInterface(propsInterface);
    const relatedTypes = this.extractRelatedTypes(sourceFile);

    return {
      name: componentName,
      propsInterface: propsInterfaceName,
      props,
      typeDefinition: propsInterface.getText(),
      relatedTypes,
    };
  }

  /**
   * Extract props from an interface
   */
  private extractPropsFromInterface(interfaceDecl: InterfaceDeclaration): PropInfo[] {
    const props: PropInfo[] = [];

    for (const prop of interfaceDecl.getProperties()) {
      const name = prop.getName();
      const type = prop.getType().getText();
      const required = !prop.hasQuestionToken();

      // Extract JSDoc comments for description
      const jsDocs = prop.getJsDocs();
      const description = jsDocs.length > 0
        ? jsDocs[0].getDescription().trim()
        : undefined;

      props.push({
        name,
        type,
        required,
        description,
      });
    }

    return props;
  }

  /**
   * Extract related type definitions from a source file
   */
  private extractRelatedTypes(sourceFile: SourceFile): Record<string, string> {
    const types: Record<string, string> = {};

    // Extract type aliases
    for (const typeAlias of sourceFile.getTypeAliases()) {
      const name = typeAlias.getName();
      const definition = typeAlias.getText();
      types[name] = definition;
    }

    // Extract enums
    for (const enumDecl of sourceFile.getEnums()) {
      const name = enumDecl.getName();
      const definition = enumDecl.getText();
      types[name] = definition;
    }

    // Extract other interfaces
    for (const interfaceDecl of sourceFile.getInterfaces()) {
      const name = interfaceDecl.getName();
      if (!name.endsWith('Props')) {
        const definition = interfaceDecl.getText();
        types[name] = definition;
      }
    }

    return types;
  }

  /**
   * Extract theme types (Size, Intent, Color, etc.)
   */
  extractThemeTypes(): Record<string, ThemeTypeInfo> {
    const themeTypes: Record<string, ThemeTypeInfo> = {};

    // Extract Size type
    const sizeFile = path.join(this.themePath, 'theme/size.ts');
    if (fs.existsSync(sizeFile)) {
      const sourceFile = this.project.addSourceFileAtPath(sizeFile);
      const sizeType = sourceFile.getTypeAlias('Size');
      if (sizeType) {
        const definition = sizeType.getText();
        const values = this.extractUnionValues(sizeType);
        themeTypes.Size = { name: 'Size', definition, values };
      }
    }

    // Extract Intent type
    const intentFile = path.join(this.themePath, 'theme/intent.ts');
    if (fs.existsSync(intentFile)) {
      const sourceFile = this.project.addSourceFileAtPath(intentFile);
      const intentType = sourceFile.getTypeAlias('Intent');
      if (intentType) {
        const definition = intentType.getText();
        const values = this.extractUnionValues(intentType);
        themeTypes.Intent = { name: 'Intent', definition, values };
      }
    }

    // Extract Color types
    const colorFile = path.join(this.themePath, 'theme/color.ts');
    if (fs.existsSync(colorFile)) {
      const sourceFile = this.project.addSourceFileAtPath(colorFile);

      const palletType = sourceFile.getTypeAlias('Pallet');
      if (palletType) {
        const definition = palletType.getText();
        const values = this.extractUnionValues(palletType);
        themeTypes.Pallet = { name: 'Pallet', definition, values };
      }

      const shadeType = sourceFile.getTypeAlias('Shade');
      if (shadeType) {
        const definition = shadeType.getText();
        const values = this.extractUnionValues(shadeType);
        themeTypes.Shade = { name: 'Shade', definition, values };
      }

      const colorType = sourceFile.getTypeAlias('Color');
      if (colorType) {
        const definition = colorType.getText();
        themeTypes.Color = { name: 'Color', definition };
      }
    }

    return themeTypes;
  }

  /**
   * Extract values from a union type
   */
  private extractUnionValues(typeAlias: TypeAliasDeclaration): string[] {
    const type = typeAlias.getType();
    if (type.isUnion()) {
      return type.getUnionTypes().map(t => {
        const text = t.getText();
        // Remove quotes from string literals
        return text.replace(/^["']|["']$/g, '');
      });
    }
    return [];
  }

  /**
   * Extract navigation types
   */
  extractNavigationTypes(): Record<string, string> {
    const navTypes: Record<string, string> = {};

    const typesFile = path.join(this.navigationPath, 'routing/types.ts');
    if (fs.existsSync(typesFile)) {
      const sourceFile = this.project.addSourceFileAtPath(typesFile);

      // Extract all type aliases and interfaces
      for (const typeAlias of sourceFile.getTypeAliases()) {
        navTypes[typeAlias.getName()] = typeAlias.getText();
      }

      for (const interfaceDecl of sourceFile.getInterfaces()) {
        navTypes[interfaceDecl.getName()] = interfaceDecl.getText();
      }
    }

    return navTypes;
  }

  /**
   * Get all available components
   */
  getAvailableComponents(): string[] {
    if (!fs.existsSync(this.componentsPath)) {
      return [];
    }

    const entries = fs.readdirSync(this.componentsPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .filter(entry => {
        const typesFile = path.join(this.componentsPath, entry.name, 'types.ts');
        return fs.existsSync(typesFile);
      })
      .map(entry => entry.name);
  }

  /**
   * Extract all component types
   */
  extractAllComponents(): Record<string, ComponentTypeInfo> {
    const components = this.getAvailableComponents();
    const result: Record<string, ComponentTypeInfo> = {};

    for (const componentName of components) {
      const typeInfo = this.extractComponentTypes(componentName);
      if (typeInfo) {
        result[componentName] = typeInfo;
      }
    }

    return result;
  }
}

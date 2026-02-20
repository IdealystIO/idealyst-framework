/**
 * Constants and default values for the CLI
 */

// Package version - updated during build
export const VERSION = '0.1.0';

// Current Idealyst framework version to use in templates
export const IDEALYST_VERSION = '1.2.105';

// React Native version
export const REACT_NATIVE_VERSION = '0.83.0';

// React version
export const REACT_VERSION = '19.1.0';

// Default timeout for shell commands (5 minutes)
export const DEFAULT_TIMEOUT = 300000;

// Extended timeout for React Native CLI (10 minutes)
export const RN_TIMEOUT = 600000;

// Validation patterns
export const PATTERNS = {
  // Project name: lowercase, alphanumeric, hyphens allowed, must start with letter
  PROJECT_NAME: /^[a-z][a-z0-9-]*$/,

  // Organization domain: dot-separated segments, each starting with letter
  ORG_DOMAIN: /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/,

  // iOS bundle ID: allows hyphens
  IOS_BUNDLE_ID: /^[a-zA-Z][a-zA-Z0-9.-]*$/,

  // Android package name: no hyphens, lowercase only
  ANDROID_PACKAGE: /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/,
} as const;

// Java reserved keywords (cannot be used in Android package name segments)
export const JAVA_RESERVED_KEYWORDS = [
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch',
  'char', 'class', 'const', 'continue', 'default', 'do', 'double',
  'else', 'enum', 'extends', 'final', 'finally', 'float', 'for',
  'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface',
  'long', 'native', 'new', 'package', 'private', 'protected', 'public',
  'return', 'short', 'static', 'strictfp', 'super', 'switch',
  'synchronized', 'this', 'throw', 'throws', 'transient', 'try',
  'void', 'volatile', 'while',
] as const;

// File extensions that should have template variables processed
export const TEMPLATE_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt',
  '.yml', '.yaml', '.env', '.sh', '.conf', '.sql',
] as const;

// Files/directories to always ignore when copying templates
export const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.cache',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  '*.tmp',
  '*.bak',
  '~*',
] as const;

// Default dependencies for different package types
export const DEPENDENCIES = {
  core: {
    '@idealyst/components': `^${IDEALYST_VERSION}`,
    '@idealyst/theme': `^${IDEALYST_VERSION}`,
    '@idealyst/navigation': `^${IDEALYST_VERSION}`,
    '@idealyst/config': `^${IDEALYST_VERSION}`,
  },
  web: {
    '@mdi/js': '^7.4.47',
    '@mdi/react': '^1.6.1',
    'react': `^${REACT_VERSION}`,
    'react-dom': `^${REACT_VERSION}`,
    'react-native': `^${REACT_NATIVE_VERSION}`,
    'react-native-unistyles': '^3.0.0',
    'react-native-web': '^0.19.12',
    'react-router': '^7.6.0',
    'react-router-dom': '^7.6.0',
  },
  mobile: {
    'react': `^${REACT_VERSION}`,
    'react-native': `^${REACT_NATIVE_VERSION}`,
    'react-native-nitro-modules': '^0.32.0',
    'react-native-unistyles': '^3.0.21',
    '@react-navigation/native': '^7.0.0',
    '@react-navigation/native-stack': '^7.0.0',
    '@react-navigation/bottom-tabs': '^7.0.0',
    '@react-navigation/drawer': '^7.0.0',
    'react-native-safe-area-context': '^5.6.0',
    'react-native-screens': '^4.4.0',
    'react-native-svg': '^15.11.0',
    'react-native-gesture-handler': '^2.20.0',
    'react-native-reanimated': '^4.2.0',
    'react-native-worklets': '^0.7.0',
    '@react-native-vector-icons/material-design-icons': '^12.0.0',
  },
  trpc: {
    '@trpc/client': '^11.5.0',
    '@trpc/react-query': '^11.5.0',
    '@tanstack/react-query': '^5.83.0',
  },
  trpcServer: {
    '@trpc/server': '^11.5.0',
  },
  graphql: {
    '@apollo/client': '^3.11.0',
    '@tanstack/react-query': '^5.62.0',
    'graphql': '^16.9.0',
  },
  graphqlServer: {
    '@pothos/core': '^4.3.0',
    'graphql-yoga': '^5.10.0',
  },
  graphqlServerPrisma: {
    '@pothos/plugin-prisma': '^4.3.0',
  },
  prisma: {
    '@prisma/client': '^7.1.0',
  },
  prismaDev: {
    'prisma': '^7.1.0',
  },
  tooling: {
    '@idealyst/tooling': `^${IDEALYST_VERSION}`,
  },
  api: {
    'express': '^4.21.0',
    'cors': '^2.8.5',
    'dotenv': '^16.4.0',
    'zod': '^3.22.0',
  },
} as const;

/**
 * API extension generator
 */

import fs from 'fs-extra';
import path from 'path';
import { TemplateData, PackageGeneratorResult } from '../../types';
import { copyTemplateDirectory, getTemplatePath, templateHasContent } from '../../templates/copier';
import { addScripts } from '../../templates/merger';
import { DEPENDENCIES } from '../../constants';
import { logger } from '../../utils/logger';

/**
 * Apply API extension to a workspace
 */
export async function applyApiExtension(
  projectPath: string,
  data: TemplateData
): Promise<PackageGeneratorResult> {
  const apiDir = path.join(projectPath, 'packages', 'api');

  logger.info('Creating API package...');

  await fs.ensureDir(apiDir);

  // Try to use template first, or generate programmatically
  const templatePath = getTemplatePath('extensions', 'api');

  if (await templateHasContent(templatePath)) {
    await copyTemplateDirectory(templatePath, apiDir, data);
  } else {
    // Generate programmatically
    await generateApiFiles(apiDir, data);
  }

  // Add API scripts to root package.json
  await addScripts(path.join(projectPath, 'package.json'), {
    'api:dev': `yarn workspace @${data.workspaceScope}/api dev`,
    'api:build': `yarn workspace @${data.workspaceScope}/api build`,
  });

  return { success: true };
}

/**
 * Generate API package files programmatically
 */
async function generateApiFiles(
  apiDir: string,
  data: TemplateData
): Promise<void> {
  // Create directory structure
  await fs.ensureDir(path.join(apiDir, 'src', 'routes'));

  // Create package.json
  await fs.writeJson(
    path.join(apiDir, 'package.json'),
    createApiPackageJson(data),
    { spaces: 2 }
  );

  // Create tsconfig.json
  await fs.writeJson(
    path.join(apiDir, 'tsconfig.json'),
    createApiTsConfig(),
    { spaces: 2 }
  );

  // Create src/index.ts
  await fs.writeFile(
    path.join(apiDir, 'src', 'index.ts'),
    createApiIndex(data)
  );

  // Create src/server.ts
  await fs.writeFile(
    path.join(apiDir, 'src', 'server.ts'),
    createApiServer(data)
  );

  // Create .env.example
  await fs.writeFile(
    path.join(apiDir, '.env.example'),
    createEnvExample()
  );
}

/**
 * Create API package.json
 */
function createApiPackageJson(data: TemplateData): Record<string, unknown> {
  const dependencies: Record<string, string> = {
    ...DEPENDENCIES.api,
  };

  // Add tRPC server if enabled
  if (data.hasTrpc) {
    Object.assign(dependencies, DEPENDENCIES.trpcServer);
  }

  // Add GraphQL server if enabled
  if (data.hasGraphql) {
    Object.assign(dependencies, DEPENDENCIES.graphqlServer);
  }

  // Add Prisma client if enabled
  if (data.hasPrisma) {
    dependencies[`@${data.workspaceScope}/database`] = 'workspace:*';
  }

  return {
    name: `@${data.workspaceScope}/api`,
    version: data.version,
    type: 'module',
    main: 'dist/index.js',
    scripts: {
      'dev': 'tsx watch src/server.ts',
      'build': 'tsc',
      'start': 'node dist/server.js',
      'test': 'jest',
    },
    dependencies,
    devDependencies: {
      '@types/cors': '^2.8.0',
      '@types/express': '^4.17.0',
      '@types/node': '^20.0.0',
      'tsx': '^4.7.0',
      'typescript': '^5.0.0',
    },
  };
}

/**
 * Create API tsconfig.json
 */
function createApiTsConfig(): Record<string, unknown> {
  return {
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'bundler',
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      outDir: './dist',
      rootDir: './src',
      declaration: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };
}

/**
 * Create API index.ts
 */
function createApiIndex(data: TemplateData): string {
  let exports = `/**
 * API package exports
 */

export { app, startServer } from './server';
`;

  if (data.hasTrpc) {
    exports += `export { appRouter, type AppRouter } from './trpc/router';
`;
  }

  return exports;
}

/**
 * Create API server.ts
 */
function createApiServer(data: TemplateData): string {
  let imports = `import express from 'express';
import cors from 'cors';
import 'dotenv/config';
`;

  let middleware = '';
  let routes = '';

  if (data.hasTrpc) {
    imports += `import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createContext } from './trpc/router';
`;
    middleware += `
// tRPC middleware
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
`;
  }

  if (data.hasGraphql) {
    imports += `import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';
`;
    middleware += `
// GraphQL middleware
const yoga = createYoga({ schema });
app.use('/graphql', yoga);
`;
  }

  routes = `
// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    name: '${data.appDisplayName} API',
    version: '${data.version}',
    endpoints: {
      health: '/health',${data.hasTrpc ? `
      trpc: '/trpc',` : ''}${data.hasGraphql ? `
      graphql: '/graphql',` : ''}
    },
  });
});
`;

  return `${imports}

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
${middleware}
${routes}
// Start server
const PORT = process.env.PORT || 3000;

export function startServer() {
  app.listen(PORT, () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}

// Start if run directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  startServer();
}
`;
}

/**
 * Create .env.example
 */
function createEnvExample(): string {
  return `# Server
PORT=3000

# Database (if using Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Add your environment variables here
`;
}

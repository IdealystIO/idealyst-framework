import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../components/CodeBlock';

export function CLIGuidePage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          CLI Guide
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          The Idealyst CLI helps you create and manage cross-platform projects.
          It provides an interactive wizard for project setup and commands for
          adding new packages to existing workspaces.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          title="Install globally (optional)"
          code={`npm install -g @idealyst/cli

# Or use npx directly
npx @idealyst/cli init my-app`}
        />

        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Commands
        </Text>

        {/* Init Command */}
        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          idealyst init
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Initialize a new Idealyst workspace. Runs an interactive wizard by default
          to configure your project.
        </Text>

        <CodeBlock
          title="Basic usage"
          code={`# Interactive wizard
idealyst init my-app

# Initialize in current directory
idealyst init my-app --current-dir

# Skip dependency installation
idealyst init my-app --skip-install`}
        />

        <Text weight="semibold" typography="h5" style={{ marginBottom: 12, marginTop: 24 }}>
          Init Options
        </Text>

        <View style={{ gap: 8, marginBottom: 24 }}>
          <OptionRow name="--directory, -d" type="string" description="Output directory (default: current)" />
          <OptionRow name="--org-domain" type="string" description="Organization domain (e.g., com.company)" />
          <OptionRow name="--app-name" type="string" description="Mobile app display name" />
          <OptionRow name="--with-api" type="flag" description="Enable API server" />
          <OptionRow name="--with-prisma" type="flag" description="Enable Prisma database (requires --with-api)" />
          <OptionRow name="--with-trpc" type="flag" description="Enable tRPC (requires --with-api)" />
          <OptionRow name="--with-graphql" type="flag" description="Enable GraphQL (requires --with-api)" />
          <OptionRow name="--with-devcontainer" type="flag" description="Enable devcontainer (Docker, PostgreSQL, Redis)" />
          <OptionRow name="--current-dir" type="flag" description="Initialize in current directory" />
          <OptionRow name="--no-interactive" type="flag" description="Disable wizard (requires all options)" />
          <OptionRow name="--skip-install" type="flag" description="Skip yarn install" />
        </View>

        <CodeBlock
          title="Non-interactive example"
          code={`idealyst init my-app \\
  --org-domain com.mycompany \\
  --app-name "My App" \\
  --with-api \\
  --with-prisma \\
  --with-trpc \\
  --no-interactive`}
        />

        {/* Add Command */}
        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 40 }}>
          idealyst add
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Add a new project to an existing Idealyst workspace. Must be run from
          within a workspace directory.
        </Text>

        <CodeBlock
          title="Usage"
          code={`# Add a web project
idealyst add my-dashboard --type web

# Add a mobile app
idealyst add my-mobile --type mobile --app-name "My Mobile App"

# Add an API server with tRPC
idealyst add backend --type api --with-trpc

# Add a shared library
idealyst add utils --type shared`}
        />

        <Text weight="semibold" typography="h5" style={{ marginBottom: 12, marginTop: 24 }}>
          Project Types
        </Text>

        <View style={{ gap: 16, marginBottom: 24 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>web</Text>
            <Text typography="body2" color="tertiary">
              React web application with Vite. Includes routing, theme system,
              and Idealyst components configured for web.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>mobile</Text>
            <Text typography="body2" color="tertiary">
              React Native application with Expo. Configured with navigation,
              theme system, and native components.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>api</Text>
            <Text typography="body2" color="tertiary">
              Node.js API server. Can be configured with tRPC or GraphQL.
              Includes CORS, environment handling, and health checks.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>shared</Text>
            <Text typography="body2" color="tertiary">
              Shared TypeScript library for code reused across web, mobile,
              and API projects. Includes types, utilities, and validation.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h5" style={{ marginBottom: 12 }}>
          Add Options
        </Text>

        <View style={{ gap: 8, marginBottom: 24 }}>
          <OptionRow name="--type, -t" type="string" description="Project type: web, mobile, api, shared (required)" />
          <OptionRow name="--app-name" type="string" description="Mobile app display name (for mobile type)" />
          <OptionRow name="--with-trpc" type="flag" description="Include tRPC setup" />
          <OptionRow name="--with-graphql" type="flag" description="Include GraphQL setup" />
          <OptionRow name="--skip-install" type="flag" description="Skip dependency installation" />
        </View>

        {/* Info Command */}
        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 40 }}>
          idealyst info
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Display CLI information, version, and usage reference.
        </Text>

        <CodeBlock
          title="Usage"
          code={`# Display info in text format
idealyst info

# JSON format (for tooling)
idealyst info --format json

# Markdown format
idealyst info --format markdown

# LLM-friendly quick reference
idealyst llm-help`}
        />

        {/* Generated Structure */}
        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Generated Project Structure
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          When you run <Text weight="semibold">idealyst init</Text> with all features enabled,
          you get the following monorepo structure:
        </Text>

        <CodeBlock
          title="Full workspace structure"
          code={`my-app/
├── .devcontainer/           # VS Code devcontainer config
│   ├── devcontainer.json
│   └── docker-compose.yml
├── packages/
│   ├── web/                 # React web app (Vite)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── styles.ts    # Theme configuration
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── mobile/              # React Native app (Expo)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   └── styles.ts
│   │   ├── app.json
│   │   └── package.json
│   ├── api/                 # Node.js API server
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── router.ts    # tRPC router
│   │   │   └── context.ts
│   │   └── package.json
│   ├── database/            # Prisma database layer
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   └── client.ts
│   │   └── package.json
│   └── shared/              # Shared code library
│       ├── src/
│       │   ├── types/
│       │   ├── utils/
│       │   └── index.ts
│       └── package.json
├── package.json             # Workspace root
├── tsconfig.json            # Shared TypeScript config
└── yarn.lock`}
        />

        {/* Devcontainer */}
        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          Devcontainer Support
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          The <Text weight="semibold">--with-devcontainer</Text> flag generates a complete
          development environment with Docker:
        </Text>

        <View style={{ gap: 12, marginBottom: 24 }}>
          <FeatureRow name="PostgreSQL" description="Database with automatic migrations" />
          <FeatureRow name="Redis" description="Caching and session storage" />
          <FeatureRow name="Headless Chrome" description="For Playwright browser testing" />
          <FeatureRow name="Claude Code" description="AI assistant with MCP servers configured" />
        </View>

        <CodeBlock
          title="MCP Servers included"
          code={`# Available MCP servers for Claude Code:
- Idealyst      # Component documentation and examples
- Serena        # Code navigation and semantic search
- Playwright    # Browser automation (requires Chrome)
- PostgreSQL    # Database queries (requires PostgreSQL)`}
        />

        {/* LLM Usage */}
        <Text weight="semibold" typography="h3" style={{ marginBottom: 16, marginTop: 40 }}>
          LLM / Automation Usage
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          For non-interactive usage (CI/CD, scripts, LLMs), always provide all
          required options to avoid prompts:
        </Text>

        <CodeBlock
          title="Safe commands for automation"
          code={`# Initialize workspace (all required args)
idealyst init my-app \\
  --org-domain com.company \\
  --app-name "My App" \\
  --no-interactive

# Add projects (type is required)
idealyst add web-app --type web
idealyst add mobile-app --type mobile --app-name "Mobile App"
idealyst add backend --type api
idealyst add utils --type shared

# With extensions
idealyst add api-server --type api --with-trpc
idealyst add web-client --type web --with-trpc`}
        />

        <Card variant="outlined" intent="warning" style={{ padding: 16, marginTop: 24 }}>
          <Text weight="semibold" style={{ marginBottom: 8 }}>
            Important for LLMs
          </Text>
          <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
            Mobile projects require --app-name. Web and mobile projects with API
            integration require --with-trpc or --with-graphql. Use --no-interactive
            to prevent the CLI from waiting for user input.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

function OptionRow({
  name,
  type,
  description,
}: {
  name: string;
  type: string;
  description: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}
    >
      <View style={{ width: 180 }}>
        <Text weight="semibold" style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {name}
        </Text>
      </View>
      <View style={{ width: 80 }}>
        <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
          {type}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text typography="body2" color="tertiary">
          {description}
        </Text>
      </View>
    </View>
  );
}

function FeatureRow({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#22c55e',
        }}
      />
      <Text weight="semibold" style={{ width: 140 }}>{name}</Text>
      <Text typography="body2" color="tertiary">{description}</Text>
    </View>
  );
}

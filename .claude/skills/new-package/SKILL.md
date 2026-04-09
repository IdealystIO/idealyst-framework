---
name: new-package
description: Use when creating a new @idealyst/* package in the idealyst-framework monorepo. Scaffolds a cross-platform package with single-API abstraction over web and React Native, adds MCP server documentation, and registers the package with the set-version and publish-all scripts.
---

# New Idealyst Package

Use this skill to add a new cross-platform package to the `@idealyst/*` monorepo. The framework convention is a **single unified API** that works identically on web and React Native, with platform-specific implementations resolved through separate entry files.

## Prerequisites

- You are in `/home/nicho/Development/idealyst-framework` (verify with `pwd`)
- You know the package name (kebab-case, e.g., `camera`, `oauth-client`)
- You know which underlying library powers native (e.g., `react-native-vision-camera`) and web (e.g., native browser APIs, a web SDK)

If the package name or underlying libraries are unclear, ask the user before proceeding.

## Step 1: Scaffold the package with single-API abstraction

Create the directory `packages/<name>/` with this structure:

```
packages/<name>/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts          # Default/shared entry - re-exports types and public API
    ├── index.web.ts      # Web entry - re-exports from *.web files
    ├── index.native.ts   # Native entry - re-exports from *.native files
    ├── types.ts          # Shared TypeScript interfaces (the single API contract)
    ├── <name>.web.ts     # Web implementation (browser APIs or web SDK)
    ├── <name>.native.ts  # Native implementation (react-native-* library)
    └── examples/
        └── index.ts
```

### Key rules for single-API abstraction

1. **`types.ts` defines the contract** — a single interface (e.g., `ICamera`, `IStorage`) that both platforms implement. All consumers import types from here only.
2. **Platform files expose the same `createX()` factory** — `camera.web.ts` and `camera.native.ts` both export `createCamera(): ICamera`.
3. **Three barrel files required**: `index.ts`, `index.web.ts`, `index.native.ts`. Metro/React Native resolves `*.native.ts`, bundlers/webpack resolve `*.web.ts`, and `index.ts` is the default fallback (usually mirroring web or exporting just types).
4. **Lazy-load native-only deps** — in `*.native.ts`, wrap `react-native-*` imports in `let mod = null; async function get() { if (!mod) mod = await import('react-native-X'); return mod; }` so the package can be consumed on web without the native dep installed.
5. **Never import from `react-native`** in `index.ts` or shared code. Only in `*.native.ts`.

### package.json template

Use this as the starting point. Replace `<name>`, `<description>`, `<native-lib>`, and keywords. Pull the current version from `packages/components/package.json` to match.

```json
{
  "name": "@idealyst/<name>",
  "version": "<match-monorepo-version>",
  "description": "<description>",
  "documentation": "https://github.com/IdealystIO/idealyst-framework/tree/main/packages/<name>#readme",
  "readme": "README.md",
  "main": "src/index.ts",
  "module": "src/index.ts",
  "types": "src/index.ts",
  "react-native": "src/index.native.ts",
  "repository": {
    "type": "git",
    "url": "https://github.com/IdealystIO/idealyst-framework.git",
    "directory": "packages/<name>"
  },
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": {
      "react-native": "./src/index.native.ts",
      "browser": "./src/index.web.ts",
      "import": "./src/index.ts",
      "require": "./src/index.ts",
      "types": "./src/index.ts"
    },
    "./examples": {
      "import": "./src/examples/index.ts",
      "require": "./src/examples/index.ts",
      "types": "./src/examples/index.ts"
    }
  },
  "scripts": {
    "prepublishOnly": "echo 'Publishing TypeScript source directly'",
    "publish:npm": "npm publish"
  },
  "peerDependencies": {
    "@idealyst/components": ">=1.0.0",
    "react": ">=16.8.0",
    "react-native": ">=0.60.0",
    "<native-lib>": ">=X.0.0"
  },
  "peerDependenciesMeta": {
    "@idealyst/components": { "optional": true },
    "react-native": { "optional": true },
    "<native-lib>": { "optional": true }
  },
  "devDependencies": {
    "@types/react": "^19.1.0",
    "@types/react-native": "^0.73.0",
    "react-native": "^0.80.0",
    "<native-lib>": "^X.0.0",
    "typescript": "^5.0.0"
  },
  "files": ["src", "README.md"],
  "keywords": ["react", "react-native", "<name>", "cross-platform"]
}
```

### tsconfig.json template

Copy the pattern from an existing sibling package (e.g., `packages/camera/tsconfig.json`) — do not invent one. Use the Read tool to grab it verbatim.

### Verification after scaffolding

- [ ] `packages/<name>/src/types.ts` declares a single interface all platforms implement
- [ ] `*.web.ts` and `*.native.ts` both export the same named factory function
- [ ] `index.ts`, `index.web.ts`, `index.native.ts` all exist and re-export the public surface
- [ ] Native deps are lazy-loaded, not top-level imported

## Step 2: Add MCP server documentation

The MCP server (`packages/mcp-server/`) exposes package docs to LLM consumers. You must add **4 touch points**:

### 2a. Create `packages/mcp-server/src/data/<name>-guides.ts`

Follow the exact shape of an existing guide file. Read `packages/mcp-server/src/data/camera-guides.ts` first as the reference. Export a single `Record<string, string>`:

```typescript
export const <name>Guides: Record<string, string> = {
  "idealyst://<name>/overview": `# @idealyst/<name>\n\n...`,
  "idealyst://<name>/api": `# API Reference\n\n...`,
  "idealyst://<name>/examples": `# Examples\n\n...`,
};
```

Each guide string should document:
- **overview**: Install, platform support table, key exports, common mistakes, quick start
- **api**: Full type signatures for the public API (the single-API interface)
- **examples**: 2-3 copy-pasteable usage examples

### 2b. Add package to `packages/mcp-server/src/data/packages.ts`

Add a new entry in the `packages` record (this powers `list_packages`, `search_packages`, `get_package_docs`). Match the existing `camera` entry's shape:

```typescript
<name>: {
  name: "<Display Name>",
  npmName: "@idealyst/<name>",
  description: "...",
  category: "ui" | "media" | "data" | "auth" | "utility" | "core" | "tooling",
  platforms: ["web", "native"],
  documentationStatus: "full",
  installation: "yarn add @idealyst/<name> <native-lib>",
  peerDependencies: ["<native-lib> (native)"],
  features: [...],
  quickStart: `...`,
  apiHighlights: [...],
  relatedPackages: [...],
},
```

### 2c. Add tool definition in `packages/mcp-server/src/tools/definitions.ts`

Two edits:
1. Add a `get<Name>GuideDefinition` export matching the shape of `getCameraGuideDefinition` (search for it).
2. Append it to the exported tool list at the bottom of the file (find `getCameraGuideDefinition,` in the tools array).

### 2d. Wire up the handler in `packages/mcp-server/src/tools/handlers.ts`

Three edits:
1. `import { <name>Guides } from "../data/<name>-guides.js";` near the top with other guide imports
2. Import `Get<Name>GuideArgs` from the types module (check how camera does it)
3. Add a `get<Name>Guide` handler function mirroring `getCameraGuide`
4. Register it in the handlers map at the bottom: `get_<name>_guide: get<Name>Guide,`

### 2e. (Optional) Install guide

If the package has native deps requiring Info.plist / AndroidManifest.xml / Podfile changes, also add an entry to `packages/mcp-server/src/data/install-guides.ts` following the `camera` example.

### 2f. Rebuild the MCP server

```bash
cd packages/mcp-server && yarn build
```

This is **required** — agents use `dist/index.js`, not source.

## Step 3: Add package to `scripts/set-version.js`

Edit [scripts/set-version.js](scripts/set-version.js). Append `'packages/<name>/package.json'` to the `packagePaths` array (near the bottom of the existing list, before the `examples/` entries).

**Do not** add the package to the `idealystPackages` array inside `updatePackageVersion` unless other `@idealyst/*` packages should start depending on it — that list controls which deps get version-bumped when referenced elsewhere.

## Step 4: Add package to `scripts/publish-all.sh`

Edit [scripts/publish-all.sh](scripts/publish-all.sh). Append `"<name>"` to the `PACKAGES=(...)` array.

## Step 5: Verify

Run these checks:

```bash
# Type-check the new package
cd packages/<name> && yarn tsc --noEmit

# Rebuild MCP server and verify docs load
cd packages/mcp-server && yarn build

# Dry-run set-version (inspect output, do NOT commit version bump)
node scripts/set-version.js <current-version>
```

Final checklist:
- [ ] `packages/<name>/` exists with all 3 index files, types.ts, and both platform impls
- [ ] Platform impls share the same factory signature (single API)
- [ ] `<name>-guides.ts` created with overview/api/examples
- [ ] `packages.ts` has new entry
- [ ] `definitions.ts` has new tool definition + array entry
- [ ] `handlers.ts` has import + handler function + handler map entry
- [ ] MCP server rebuilt (`dist/index.js` updated)
- [ ] `set-version.js` `packagePaths` includes new package
- [ ] `publish-all.sh` `PACKAGES` array includes new package
- [ ] Package type-checks cleanly

## Common mistakes to avoid

- **Forgetting to rebuild the MCP server** — changes to `src/` have no effect on agents until `yarn build`
- **Top-level importing `react-native` in shared code** — only `*.native.ts` may do this, and native-only libs must be lazy-loaded
- **Skipping one of the 3 index barrel files** — all three are required for cross-platform resolution
- **Copying a different package's `tsconfig.json` from memory** — always Read a sibling package's tsconfig verbatim
- **Adding to `idealystPackages` in set-version.js** — that array is for cross-package dep updates, not for listing packages to version

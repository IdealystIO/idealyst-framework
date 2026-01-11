/**
 * @idealyst/config Babel plugin
 *
 * Injects config values at compile time from .env files.
 *
 * Usage in babel.config.js:
 * ```js
 * module.exports = {
 *   plugins: [
 *     ['@idealyst/config/plugin', {
 *       extends: ['../shared/.env'],
 *       envPath: '.env',
 *       required: ['API_URL', 'AUTH_SECRET'],  // Warn if missing
 *       errorOnMissing: true                    // Fail build if missing
 *     }]
 *   ]
 * }
 * ```
 */

const fs = require('fs')
const path = require('path')

// Track if we've already validated (to avoid duplicate warnings)
let hasValidated = false

/**
 * Parse a .env file and extract key-value pairs.
 */
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const config = {}

  for (const line of content.split('\n')) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const equalsIndex = trimmed.indexOf('=')
    if (equalsIndex === -1) {
      continue
    }

    let key = trimmed.substring(0, equalsIndex).trim()
    let value = trimmed.substring(equalsIndex + 1).trim()

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    // Strip VITE_ prefix to normalize
    if (key.startsWith('VITE_')) {
      key = key.substring(5)
    }

    config[key] = value
  }

  return config
}

/**
 * Find .env file in directory.
 */
function findEnvFile(directory) {
  const candidates = ['.env.local', '.env.development', '.env']
  for (const candidate of candidates) {
    const envPath = path.join(directory, candidate)
    if (fs.existsSync(envPath)) {
      return envPath
    }
  }
  return null
}

/**
 * Look for shared .env in common monorepo locations.
 */
function findSharedEnv(directory) {
  const patterns = [
    '../shared/.env',
    '../../shared/.env',
    '../../packages/shared/.env',
  ]
  for (const pattern of patterns) {
    const sharedPath = path.resolve(directory, pattern)
    if (fs.existsSync(sharedPath)) {
      return sharedPath
    }
  }
  return null
}

/**
 * Load and merge config from .env files.
 */
function loadConfig(options, projectRoot) {
  const configs = []
  const sources = []

  // Load inherited configs first (lowest priority)
  if (options.extends) {
    for (const extendPath of options.extends) {
      const resolvedPath = path.isAbsolute(extendPath)
        ? extendPath
        : path.resolve(projectRoot, extendPath)

      if (fs.existsSync(resolvedPath)) {
        configs.push(parseEnvFile(resolvedPath))
        sources.push(resolvedPath)
      }
    }
  } else {
    // Auto-detect shared env
    const sharedEnv = findSharedEnv(projectRoot)
    if (sharedEnv) {
      configs.push(parseEnvFile(sharedEnv))
      sources.push(sharedEnv)
    }
  }

  // Load main env file (highest priority)
  let envPath = null
  if (options.envPath) {
    envPath = path.isAbsolute(options.envPath)
      ? options.envPath
      : path.resolve(projectRoot, options.envPath)
  } else {
    envPath = findEnvFile(projectRoot)
  }

  if (envPath && fs.existsSync(envPath)) {
    configs.push(parseEnvFile(envPath))
    sources.push(envPath)
  }

  // Merge configs (later configs override earlier ones)
  return {
    config: Object.assign({}, ...configs),
    sources
  }
}

/**
 * Validate required config keys and emit warnings/errors.
 */
function validateConfig(configValues, options, projectRoot) {
  if (hasValidated) return true
  hasValidated = true

  const required = options.required || []
  if (required.length === 0) return true

  const missing = required.filter(key => !(key in configValues))

  if (missing.length === 0) return true

  const errorOnMissing = options.errorOnMissing ?? false
  const message = `@idealyst/config: Missing required config keys: ${missing.join(', ')}`

  if (errorOnMissing) {
    console.error('\n\x1b[31m✖ ' + message + '\x1b[0m')
    console.error('\x1b[90m  Add these keys to your .env file or check your plugin configuration.\x1b[0m\n')
    throw new Error(message)
  } else {
    console.warn('\n\x1b[33m⚠ ' + message + '\x1b[0m')
    console.warn('\x1b[90m  Add these keys to your .env file to suppress this warning.\x1b[0m')
    console.warn('\x1b[90m  Set errorOnMissing: true to fail the build instead.\x1b[0m\n')
  }

  return false
}

/**
 * Babel plugin that injects config values at compile time.
 */
module.exports = function babelPluginIdealystConfig(babel) {
  const { types: t } = babel

  // Cache config per project root
  const configCache = new Map()

  // Reset validation state on new compilation
  hasValidated = false

  return {
    name: '@idealyst/config',

    visitor: {
      Program: {
        enter(programPath, state) {
          const opts = state.opts || {}
          const projectRoot = opts.root || state.cwd || process.cwd()

          // Load config (cached per project root)
          let configValues
          if (!configCache.has(projectRoot)) {
            const { config, sources } = loadConfig(opts, projectRoot)
            configCache.set(projectRoot, config)
            configValues = config

            // Validate required keys (only once per build)
            validateConfig(config, opts, projectRoot)

            // Log loaded sources in verbose mode
            if (opts.verbose && sources.length > 0) {
              console.log('\x1b[36m@idealyst/config loaded:\x1b[0m')
              sources.forEach(s => console.log('  ← ' + path.relative(projectRoot, s)))
              console.log('  Keys:', Object.keys(config).join(', '))
            }
          } else {
            configValues = configCache.get(projectRoot)
          }

          // Track if this file imports from @idealyst/config
          let hasConfigImport = false
          let configImportPath = null

          // Find imports from @idealyst/config
          programPath.traverse({
            ImportDeclaration(importPath) {
              if (importPath.node.source.value === '@idealyst/config') {
                hasConfigImport = true
                configImportPath = importPath
              }
            }
          })

          if (!hasConfigImport || !configImportPath) {
            return
          }

          // Check if setConfig is already imported
          let hasSetConfigImport = false
          let setConfigLocalName = '__idealyst_setConfig'

          for (const specifier of configImportPath.node.specifiers) {
            if (t.isImportSpecifier(specifier) &&
                t.isIdentifier(specifier.imported) &&
                specifier.imported.name === 'setConfig') {
              hasSetConfigImport = true
              setConfigLocalName = specifier.local.name
              break
            }
          }

          // Add setConfig to imports if not already present
          if (!hasSetConfigImport) {
            configImportPath.node.specifiers.push(
              t.importSpecifier(
                t.identifier('__idealyst_setConfig'),
                t.identifier('setConfig')
              )
            )
          }

          // Create the config object literal
          const configProperties = Object.entries(configValues).map(([key, value]) =>
            t.objectProperty(t.identifier(key), t.stringLiteral(value))
          )
          const configObject = t.objectExpression(configProperties)

          // Create setConfig call
          const setConfigCall = t.expressionStatement(
            t.callExpression(
              t.identifier(setConfigLocalName),
              [configObject]
            )
          )

          // Insert after the import statement
          const importIndex = programPath.node.body.indexOf(configImportPath.node)
          programPath.node.body.splice(importIndex + 1, 0, setConfigCall)
        }
      }
    }
  }
}

// Export utilities for direct use
module.exports.parseEnvFile = parseEnvFile
module.exports.loadConfig = loadConfig
module.exports.findEnvFile = findEnvFile
module.exports.findSharedEnv = findSharedEnv
module.exports.validateConfig = validateConfig

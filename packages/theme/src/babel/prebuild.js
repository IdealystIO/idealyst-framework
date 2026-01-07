#!/usr/bin/env node
/**
 * Idealyst Styles Prebuild Script
 *
 * Executes style files at build time with a proxy theme to capture
 * which theme values are used. The results are cached for the Babel plugin.
 *
 * How it works:
 * 1. Mocks StyleSheet.create to capture the callback function
 * 2. Executes each callback with a proxy theme that tags accessed values
 * 3. Serializes results to JSON with theme references as { __themeRef: "path" }
 * 4. Babel plugin reads this cache and transforms the AST accordingly
 *
 * Usage:
 *   node prebuild.js --theme ./src/theme.ts --styles "src/**\/*.styles.tsx" --output .cache/styles.json
 */

const fs = require('fs');
const path = require('path');
const Module = require('module');

// ============================================================================
// Theme Proxy System
// ============================================================================

const THEME_REF_PATH = Symbol.for('idealyst.themeRefPath');

function createThemeProxy(theme, basePath = '') {
    if (theme === null || theme === undefined) return theme;

    if (typeof theme !== 'object') {
        return createTaggedValue(theme, basePath);
    }

    if (Array.isArray(theme)) {
        return theme.map((item, i) =>
            createThemeProxy(item, basePath ? `${basePath}[${i}]` : `[${i}]`)
        );
    }

    return new Proxy(theme, {
        get(target, prop) {
            if (prop === Symbol.toPrimitive) return () => '[ThemeProxy]';
            if (prop === 'valueOf' || prop === 'toString' || prop === 'toJSON') return () => target;
            if (typeof prop === 'symbol') return target[prop];
            if (prop === '__isThemeProxy') return true;
            if (prop === '__rawValue') return target;
            if (prop === '__path') return basePath;

            const value = target[prop];
            const currentPath = basePath ? `${basePath}.${String(prop)}` : String(prop);

            if (value === null || value === undefined) return value;
            if (typeof value === 'function') return value.bind(target);
            if (typeof value === 'object') return createThemeProxy(value, currentPath);

            return createTaggedValue(value, currentPath);
        },
        has: (target, prop) => prop in target,
        ownKeys: (target) => Reflect.ownKeys(target),
        getOwnPropertyDescriptor: (target, prop) => Object.getOwnPropertyDescriptor(target, prop),
    });
}

function createTaggedValue(value, themePath) {
    const wrapper = {
        [THEME_REF_PATH]: themePath,
        _value: value,
        _isThemeRef: true,
        valueOf() { return value; },
        toString() { return String(value); },
        toJSON() { return { __themeRef: themePath }; },
        [Symbol.toPrimitive](hint) {
            if (hint === 'string') return String(value);
            return value;
        },
    };
    return wrapper;
}

function isTaggedValue(value) {
    return value?._isThemeRef === true;
}

function getTaggedPath(value) {
    return value?.[THEME_REF_PATH];
}

// ============================================================================
// Serialization
// ============================================================================

function serializeValue(value, proxyTheme, depth = 0) {
    if (depth > 100) {
        console.warn('[prebuild] Max depth reached');
        return null;
    }

    // Tagged theme reference
    if (isTaggedValue(value)) {
        return { __themeRef: getTaggedPath(value) };
    }

    if (value === null) return null;
    if (value === undefined) return { __undefined: true };
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value;

    if (Array.isArray(value)) {
        return value.map(v => serializeValue(v, proxyTheme, depth + 1));
    }

    if (typeof value === 'function') {
        // For functions that take props, we need to preserve the function
        // Execute with a proxy props to detect which props are accessed
        try {
            const propsAccessed = [];
            const propsProxy = new Proxy({}, {
                get(target, prop) {
                    propsAccessed.push(String(prop));
                    // Return a placeholder that won't break theme lookups
                    return 'default';
                }
            });

            const result = value(propsProxy);

            // If no props were accessed, it's essentially a static function
            // Otherwise, we need to preserve the function structure
            if (propsAccessed.length === 0) {
                return {
                    __fn: true,
                    static: true,
                    result: serializeValue(result, proxyTheme, depth + 1),
                };
            } else {
                // Dynamic function - serialize the result but mark it as needing props
                return {
                    __fn: true,
                    static: false,
                    propsAccessed: [...new Set(propsAccessed)],
                    result: serializeValue(result, proxyTheme, depth + 1),
                };
            }
        } catch (err) {
            return { __fn: true, error: err.message };
        }
    }

    if (typeof value === 'object') {
        if (value.__isThemeProxy) {
            value = value.__rawValue;
        }

        const result = {};
        for (const key of Object.keys(value)) {
            // Keep _web, skip other underscore props
            if (key.startsWith('_') && key !== '_web') continue;
            result[key] = serializeValue(value[key], proxyTheme, depth + 1);
        }
        return result;
    }

    return value;
}

// ============================================================================
// StyleSheet Mock
// ============================================================================

/**
 * Create a mock StyleSheet that captures callbacks
 */
function createStyleSheetMock(proxyTheme, capturedStyles) {
    return {
        create(callback) {
            if (typeof callback === 'function') {
                // Execute the callback with our proxy theme
                try {
                    const styles = callback(proxyTheme);
                    const serialized = serializeValue(styles, proxyTheme);
                    capturedStyles.push({ type: 'callback', styles: serialized });

                    // Return a proxy that mimics the stylesheet for any subsequent usage
                    return new Proxy(styles, {
                        get(target, prop) {
                            return target[prop];
                        }
                    });
                } catch (err) {
                    console.warn(`[prebuild] Error executing StyleSheet.create callback: ${err.message}`);
                    capturedStyles.push({ type: 'error', error: err.message });
                    return {};
                }
            } else {
                // Static styles object
                const serialized = serializeValue(callback, proxyTheme);
                capturedStyles.push({ type: 'static', styles: serialized });
                return callback;
            }
        },
        configure() {},
        useInitialTheme() {},
    };
}

// ============================================================================
// Module Hooking
// ============================================================================

/**
 * Register TypeScript compilation
 */
function registerTsCompiler() {
    const compilers = [
        ['esbuild-register/dist/node', (m) => m.register()],
        ['@esbuild-kit/cjs-loader', () => {}],
        ['tsx/cjs', () => {}],
        ['ts-node', (m) => m.register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } })],
        ['@swc-node/register', () => {}],
    ];

    for (const [name, setup] of compilers) {
        try {
            const mod = require(name);
            setup(mod);
            return name;
        } catch (e) {}
    }

    console.warn('[prebuild] No TypeScript compiler found');
    return null;
}

/**
 * Hook into require to mock react-native-unistyles
 */
function hookRequire(proxyTheme, fileCaptures) {
    const originalRequire = Module.prototype.require;

    Module.prototype.require = function(id) {
        // Mock react-native-unistyles
        if (id === 'react-native-unistyles') {
            const capturedStyles = [];
            fileCaptures.set(this.filename, capturedStyles);

            return {
                StyleSheet: createStyleSheetMock(proxyTheme, capturedStyles),
                UnistylesRuntime: {
                    setTheme: () => {},
                    updateTheme: () => {},
                    getTheme: () => proxyTheme,
                },
            };
        }

        // Mock @idealyst/theme to return proxy theme
        if (id === '@idealyst/theme' || id.startsWith('@idealyst/theme/')) {
            const real = originalRequire.call(this, id);
            return {
                ...real,
                // Override any theme exports with our proxy
            };
        }

        return originalRequire.call(this, id);
    };

    return () => {
        Module.prototype.require = originalRequire;
    };
}

// ============================================================================
// Main
// ============================================================================

async function prebuildStyles(options) {
    const {
        themePath,
        styleGlobs = [],
        outputPath = '.cache/idealyst-styles.json',
        rootDir = process.cwd(),
    } = options;

    console.log('[prebuild] Starting...');

    // Register TS compiler
    const compiler = registerTsCompiler();
    if (compiler) {
        console.log(`[prebuild] Using ${compiler}`);
    }

    // Load theme
    const resolvedThemePath = path.resolve(rootDir, themePath);
    console.log(`[prebuild] Loading theme from ${resolvedThemePath}`);

    let theme;
    try {
        delete require.cache[require.resolve(resolvedThemePath)];
        const themeModule = require(resolvedThemePath);
        theme = themeModule.lightTheme || themeModule.default || themeModule;
    } catch (err) {
        throw new Error(`Failed to load theme: ${err.message}`);
    }

    const proxyTheme = createThemeProxy(theme);
    console.log('[prebuild] Theme loaded');

    // Find style files
    let styleFiles = [];
    try {
        const { glob } = require('glob');
        for (const pattern of styleGlobs) {
            const matches = await glob(pattern, { cwd: rootDir, absolute: true });
            styleFiles.push(...matches);
        }
    } catch (err) {
        // Fallback: simple pattern matching
        const { readdirSync, statSync } = require('fs');
        function findFiles(dir, pattern) {
            const files = [];
            try {
                for (const entry of readdirSync(dir)) {
                    const full = path.join(dir, entry);
                    const stat = statSync(full);
                    if (stat.isDirectory()) {
                        files.push(...findFiles(full, pattern));
                    } else if (entry.endsWith('.styles.tsx') || entry.endsWith('.styles.ts')) {
                        files.push(full);
                    }
                }
            } catch (e) {}
            return files;
        }
        styleFiles = findFiles(rootDir, '*.styles.tsx');
    }

    console.log(`[prebuild] Found ${styleFiles.length} style files`);

    // Hook require
    const fileCaptures = new Map();
    const unhook = hookRequire(proxyTheme, fileCaptures);

    const cache = {};

    try {
        for (const styleFile of styleFiles) {
            const relativePath = path.relative(rootDir, styleFile);
            console.log(`[prebuild] Processing ${relativePath}`);

            try {
                // Clear caches
                delete require.cache[require.resolve(styleFile)];

                // This will trigger our mocked StyleSheet.create
                require(styleFile);

                // Get captured styles
                const captured = fileCaptures.get(styleFile);
                if (captured && captured.length > 0) {
                    cache[relativePath] = captured;
                }
            } catch (err) {
                console.warn(`[prebuild] Error: ${err.message}`);
            }
        }
    } finally {
        unhook();
    }

    // Write cache
    const outputDir = path.dirname(path.resolve(rootDir, outputPath));
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const output = {
        version: 1,
        generatedAt: new Date().toISOString(),
        files: cache,
    };

    fs.writeFileSync(
        path.resolve(rootDir, outputPath),
        JSON.stringify(output, null, 2),
        'utf-8'
    );

    console.log(`[prebuild] Wrote ${Object.keys(cache).length} files to ${outputPath}`);
    return output;
}

// CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = { styleGlobs: [] };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--theme') options.themePath = args[++i];
        else if (args[i] === '--styles') options.styleGlobs.push(args[++i]);
        else if (args[i] === '--output') options.outputPath = args[++i];
        else if (args[i] === '--root') options.rootDir = args[++i];
    }

    if (!options.themePath) {
        console.error('Usage: prebuild.js --theme <path> --styles <glob> [--output <path>]');
        process.exit(1);
    }

    prebuildStyles(options).catch(err => {
        console.error('[prebuild] Failed:', err);
        process.exit(1);
    });
}

module.exports = { prebuildStyles, createThemeProxy, serializeValue };

/**
 * Babel plugin and runtime for Idealyst theme extensions.
 *
 * The plugin transforms applyExtensions calls into Unistyles-compatible code,
 * enabling theme reactivity for extended styles.
 */

export { __withExtension } from './runtime';
export { default as plugin } from './plugin';

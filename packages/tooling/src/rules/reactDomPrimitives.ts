import { PrimitiveRule, PrimitiveRuleSet } from '../types';

/**
 * Module sources that indicate React DOM platform
 */
export const REACT_DOM_SOURCES = [
  'react-dom',
  'react-dom/client',
  'react-dom/server',
] as const;

/**
 * React DOM API primitives
 * These are functions/components that are React DOM specific
 */
const DOM_API_PRIMITIVES: PrimitiveRule[] = [
  {
    name: 'createPortal',
    source: 'react-dom',
    platform: 'react-dom',
    description: 'Render children into a different DOM node',
  },
  {
    name: 'flushSync',
    source: 'react-dom',
    platform: 'react-dom',
    description: 'Force synchronous DOM updates',
  },
  {
    name: 'createRoot',
    source: 'react-dom/client',
    platform: 'react-dom',
    description: 'Create a React root for rendering',
  },
  {
    name: 'hydrateRoot',
    source: 'react-dom/client',
    platform: 'react-dom',
    description: 'Hydrate server-rendered content',
  },
  {
    name: 'render',
    source: 'react-dom',
    platform: 'react-dom',
    description: 'Legacy render function (deprecated)',
  },
  {
    name: 'hydrate',
    source: 'react-dom',
    platform: 'react-dom',
    description: 'Legacy hydrate function (deprecated)',
  },
  {
    name: 'unmountComponentAtNode',
    source: 'react-dom',
    platform: 'react-dom',
    description: 'Legacy unmount function (deprecated)',
  },
  {
    name: 'findDOMNode',
    source: 'react-dom',
    platform: 'react-dom',
    description: 'Find DOM node (deprecated)',
  },
];

/**
 * Intrinsic HTML elements that indicate web-only code
 * These are JSX intrinsic elements that only exist in DOM
 *
 * Note: These are detected via JSX usage, not imports
 * This list is for reference and specialized detection
 */
export const HTML_INTRINSIC_ELEMENTS = [
  // Document structure
  'html',
  'head',
  'body',
  'main',
  'header',
  'footer',
  'nav',
  'aside',
  'article',
  'section',

  // Content sectioning
  'div',
  'span',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',

  // Text content
  'a',
  'strong',
  'em',
  'code',
  'pre',
  'blockquote',
  'br',
  'hr',

  // Lists
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',

  // Tables
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'caption',
  'colgroup',
  'col',

  // Forms
  'form',
  'input',
  'textarea',
  'select',
  'option',
  'optgroup',
  'button',
  'label',
  'fieldset',
  'legend',
  'datalist',
  'output',
  'progress',
  'meter',

  // Media
  'img',
  'video',
  'audio',
  'source',
  'track',
  'picture',
  'figure',
  'figcaption',
  'canvas',
  'svg',
  'iframe',
  'embed',
  'object',

  // Interactive
  'details',
  'summary',
  'dialog',
  'menu',

  // Scripting
  'script',
  'noscript',
  'template',
  'slot',
] as const;

/**
 * All React DOM primitives (API functions)
 */
export const REACT_DOM_PRIMITIVES: PrimitiveRule[] = [...DOM_API_PRIMITIVES];

/**
 * Set of primitive names for quick lookup
 */
export const REACT_DOM_PRIMITIVE_NAMES = new Set(
  REACT_DOM_PRIMITIVES.map((p) => p.name)
);

/**
 * Set of HTML intrinsic element names for quick lookup
 */
export const HTML_ELEMENT_NAMES: Set<string> = new Set(HTML_INTRINSIC_ELEMENTS);

/**
 * Complete rule set for React DOM
 */
export const REACT_DOM_RULE_SET: PrimitiveRuleSet = {
  platform: 'react-dom',
  primitives: REACT_DOM_PRIMITIVES,
  sources: [...REACT_DOM_SOURCES],
};

/**
 * Check if a name is a React DOM primitive (API function)
 */
export function isReactDomPrimitive(name: string): boolean {
  return REACT_DOM_PRIMITIVE_NAMES.has(name);
}

/**
 * Check if a name is an HTML intrinsic element
 */
export function isHtmlElement(name: string): boolean {
  return HTML_ELEMENT_NAMES.has(name);
}

/**
 * Get primitive info by name
 */
export function getReactDomPrimitive(name: string): PrimitiveRule | undefined {
  return REACT_DOM_PRIMITIVES.find((p) => p.name === name);
}

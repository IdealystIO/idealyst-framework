/**
 * Shared portal container management.
 *
 * Provides a single portal container element that all overlay components
 * (Popover, Menu, Tooltip, Dialog, Select) render into via createPortal.
 *
 * The container mirrors the active Unistyles theme by:
 *
 * 1. Applying `color-scheme` so browser-native UI elements (scrollbars,
 *    select dropdowns, focus outlines) match the active light/dark theme.
 *
 * 2. Copying the theme class name from :root so that CSS rules scoped to
 *    the theme class apply within the portal subtree.
 *
 * Unistyles v3 on web defines CSS custom properties on :root.{themeName}.
 * Those variables cascade to all descendants of :root (including this
 * container, which is appended to document.body). This module adds the
 * class-based scoping as a defense-in-depth measure and, more importantly,
 * sets `color-scheme` which does NOT cascade through the DOM by default.
 */

import { useEffect } from 'react';

let sharedContainer: HTMLDivElement | null = null;
let observer: MutationObserver | null = null;
let refCount = 0;

/**
 * Synchronise the portal container with the current theme class on :root.
 */
function syncTheme(container: HTMLDivElement): void {
  const root = document.documentElement;
  // Unistyles sets the active theme name as a class on :root.
  // Copy it to the portal container for any CSS rules that match on the class.
  const themeClass = root.className;
  container.className = themeClass
    ? `idealyst-portal ${themeClass}`
    : 'idealyst-portal';

  // Derive color-scheme from the theme class.  Unistyles uses 'light' and
  // 'dark' as default theme names. For non-standard names we fall back to
  // 'light' to avoid browser-default dark backgrounds.
  const isDark = themeClass.split(/\s+/).includes('dark');
  container.style.colorScheme = isDark ? 'dark' : 'light';
}

/**
 * Create (or reuse) the shared portal container element.
 * Idempotent: calling multiple times returns the same element.
 */
function ensureContainer(): HTMLDivElement {
  if (sharedContainer) {
    return sharedContainer;
  }

  const el = document.createElement('div');
  el.setAttribute('data-idealyst-portal', '');
  // The container itself should never affect layout.
  // Do NOT set pointer-events: none here -- it is an inherited CSS property
  // and would cascade to portal children (e.g. Dialog backdrop) unless every
  // child explicitly overrides it.  The zero dimensions already prevent the
  // container from intercepting any events.
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.width = '0';
  el.style.height = '0';
  el.style.overflow = 'visible';
  el.style.zIndex = '0';

  document.body.appendChild(el);
  sharedContainer = el;

  // Initial theme sync
  syncTheme(el);

  // Watch for theme class changes on :root
  observer = new MutationObserver(() => {
    if (sharedContainer) {
      syncTheme(sharedContainer);
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  return el;
}

/**
 * Tear down the shared container when nothing references it any more.
 */
function teardownContainer(): void {
  if (sharedContainer) {
    observer?.disconnect();
    observer = null;
    sharedContainer.parentNode?.removeChild(sharedContainer);
    sharedContainer = null;
  }
}

/**
 * React hook that returns a theme-aware portal container element.
 *
 * Every caller shares the same underlying DOM node. The node is created
 * lazily on first use and removed when no component references it.
 *
 * Returns the container element to pass to `createPortal`, falling back
 * to `document.body` when running on the server.
 */
export function usePortalContainer(): HTMLElement {
  // Ensure the container exists.  This call is idempotent; all callers
  // receive the same singleton element.  Calling during render is safe
  // because ensureContainer has no side-effects visible to React -- it
  // only appends a zero-size div to document.body and starts observing
  // :root class changes.
  if (typeof document !== 'undefined') {
    ensureContainer();
  }

  useEffect(() => {
    refCount++;
    return () => {
      refCount = Math.max(0, refCount - 1);
      if (refCount === 0) {
        teardownContainer();
      }
    };
  }, []);

  // Always read from the module singleton so the value is never stale
  // (e.g. after strict-mode teardown/remount).
  return sharedContainer ?? (typeof document !== 'undefined' ? document.body : (null as unknown as HTMLElement));
}

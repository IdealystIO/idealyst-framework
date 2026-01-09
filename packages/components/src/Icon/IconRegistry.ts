/**
 * Icon Registry for web platform
 *
 * This registry stores SVG paths for icons that are populated at build time
 * by the Babel plugin. At runtime, components look up icon paths by their
 * canonical name (e.g., "home", "account-circle").
 *
 * The registry is populated by:
 * 1. Static analysis - Babel plugin scans for icon names in JSX
 * 2. Config icons - User specifies additional icons in babel config
 *
 * This approach:
 * - Enables dynamic/variable icon names (if registered)
 * - Tree-shakes unused icons (only registered icons are bundled)
 * - Provides a single source of truth for icon resolution
 */

type IconPath = string;

class IconRegistryClass {
  private icons = new Map<string, IconPath>();
  private initialized = false;

  /**
   * Register a single icon
   * @internal Called by generated registration code
   */
  register(name: string, path: IconPath): void {
    // Normalize the name (strip mdi: prefix, lowercase)
    const normalizedName = this.normalizeName(name);
    this.icons.set(normalizedName, path);
  }

  /**
   * Register multiple icons at once
   * @internal Called by generated registration code
   */
  registerMany(icons: Record<string, IconPath>): void {
    Object.entries(icons).forEach(([name, path]) => {
      this.register(name, path);
    });
    this.initialized = true;
  }

  /**
   * Get an icon path by name
   * Returns undefined if the icon is not registered
   */
  get(name: string): IconPath | undefined {
    const normalizedName = this.normalizeName(name);
    return this.icons.get(normalizedName);
  }

  /**
   * Check if an icon is registered
   */
  has(name: string): boolean {
    const normalizedName = this.normalizeName(name);
    return this.icons.has(normalizedName);
  }

  /**
   * Get all registered icon names
   */
  getRegisteredNames(): string[] {
    return Array.from(this.icons.keys());
  }

  /**
   * Get the count of registered icons
   */
  get size(): number {
    return this.icons.size;
  }

  /**
   * Check if the registry has been initialized
   */
  get isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Normalize icon name for consistent lookup
   * - Strips "mdi:" prefix
   * - Converts to lowercase for case-insensitive matching
   */
  private normalizeName(name: string): string {
    if (!name || typeof name !== 'string') {
      return '';
    }

    // Strip mdi: prefix if present
    let normalized = name.startsWith('mdi:') ? name.slice(4) : name;

    // Lowercase for consistent lookup
    normalized = normalized.toLowerCase();

    return normalized;
  }
}

// Singleton instance
export const IconRegistry = new IconRegistryClass();

// Also export the class for testing purposes
export { IconRegistryClass };

/**
 * Icon Registry stub for native platform
 *
 * On native, icons are handled by react-native-vector-icons which uses
 * icon names directly. The registry is only used on web for SVG path lookup.
 *
 * This stub exists to prevent import errors when code is shared between platforms.
 */

class IconRegistryStub {
  register(_name: string, _path: string): void {
    // No-op on native
  }

  registerMany(_icons: Record<string, string>): void {
    // No-op on native
  }

  get(_name: string): string | undefined {
    return undefined;
  }

  has(_name: string): boolean {
    return false;
  }

  getRegisteredNames(): string[] {
    return [];
  }

  get size(): number {
    return 0;
  }

  get isInitialized(): boolean {
    return false;
  }
}

export const IconRegistry = new IconRegistryStub();
export { IconRegistryStub as IconRegistryClass };

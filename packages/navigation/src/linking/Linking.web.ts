export const Linking = {
  /**
   * Open a URL. On web, uses window.open.
   * @param url - The URL to open
   * @param external - If true, opens in a new tab. If false, navigates in current tab.
   * @returns Promise that resolves immediately (web is synchronous)
   */
  open: async (url: string, external: boolean = true): Promise<void> => {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  },
};

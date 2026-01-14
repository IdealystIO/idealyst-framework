import { Linking as RNLinking } from 'react-native';

export const Linking = {
  /**
   * Open a URL. On native, uses React Native's Linking API.
   * @param url - The URL to open
   * @param external - Ignored on native (always opens externally)
   * @returns Promise that resolves when the URL is opened
   */
  open: async (url: string, external: boolean = true): Promise<void> => {
    const canOpen = await RNLinking.canOpenURL(url);
    if (canOpen) {
      await RNLinking.openURL(url);
    } else {
      console.warn(`Cannot open URL: ${url}`);
    }
  },
};

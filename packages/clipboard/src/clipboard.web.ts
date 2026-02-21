import { IClipboard } from './types';

class WebClipboard implements IClipboard {
  async copy(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
  }

  async paste(): Promise<string> {
    return navigator.clipboard.readText();
  }

  async hasText(): Promise<boolean> {
    try {
      const text = await navigator.clipboard.readText();
      return text.length > 0;
    } catch {
      return false;
    }
  }
}

export default WebClipboard;

import { IClipboard, IClipboardWithListener, ClipboardListener } from './types';

class BaseClipboard implements IClipboardWithListener {
  protected adapter: IClipboard;
  protected listeners: Set<ClipboardListener> = new Set();

  constructor(adapter: IClipboard) {
    this.adapter = adapter;
  }

  async copy(text: string): Promise<void> {
    await this.adapter.copy(text);
    this.notifyListeners(text);
  }

  async paste(): Promise<string> {
    return this.adapter.paste();
  }

  async hasText(): Promise<boolean> {
    return this.adapter.hasText();
  }

  addListener(listener: ClipboardListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  protected notifyListeners(content: string): void {
    this.listeners.forEach((listener) => listener(content));
  }
}

export default BaseClipboard;

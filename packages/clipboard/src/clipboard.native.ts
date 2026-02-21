import RNClipboard from '@react-native-clipboard/clipboard';
import { IClipboard } from './types';

class NativeClipboard implements IClipboard {
  async copy(text: string): Promise<void> {
    RNClipboard.setString(text);
  }

  async paste(): Promise<string> {
    return RNClipboard.getString();
  }

  async hasText(): Promise<boolean> {
    return RNClipboard.hasString();
  }
}

export default NativeClipboard;

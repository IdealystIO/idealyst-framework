import { ReactNode } from 'react';

export interface DialogProps {
  /**
   * Whether the dialog is open/visible
   */
  open: boolean;
  
  /**
   * Called when the dialog should be opened or closed
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * Optional title for the dialog
   */
  title?: string;
  
  /**
   * The content to display inside the dialog
   */
  children: ReactNode;
  
  /**
   * The size of the dialog
   */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  
  /**
   * The visual style variant of the dialog
   */
  variant?: 'default' | 'alert' | 'confirmation';
  
  /**
   * Whether to show the close button in the header
   */
  showCloseButton?: boolean;
  
  /**
   * Whether clicking the backdrop should close the dialog
   */
  closeOnBackdropClick?: boolean;
  
  /**
   * Whether pressing escape key should close the dialog (web only)
   */
  closeOnEscapeKey?: boolean;
  
  /**
   * Animation type for the dialog (native only)
   */
  animationType?: 'slide' | 'fade' | 'none';
  
  /**
   * Additional styles (platform-specific)
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}
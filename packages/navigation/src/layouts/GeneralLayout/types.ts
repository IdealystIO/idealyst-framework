import { ReactNode } from 'react';

export interface SidebarConfig {
  /**
   * Whether the sidebar is enabled
   */
  enabled?: boolean;
  
  /**
   * Whether the sidebar is initially expanded
   */
  initiallyExpanded?: boolean;
  
  /**
   * Width of the sidebar when expanded
   */
  expandedWidth?: number;
  
  /**
   * Width of the sidebar when collapsed
   */
  collapsedWidth?: number;
  
  /**
   * Whether the sidebar can be collapsed
   */
  collapsible?: boolean;
  
  /**
   * Position of the sidebar
   */
  position?: 'left' | 'right';
  
  /**
   * Content to display in the sidebar
   */
  content?: ReactNode;
  
  /**
   * Custom styles for the sidebar
   */
  style?: any;
}

export interface HeaderConfig {
  /**
   * Whether the header is enabled
   */
  enabled?: boolean;
  
  /**
   * Height of the header
   */
  height?: number;
  
  /**
   * Content to display in the header
   */
  content?: ReactNode;
  
  /**
   * Custom styles for the header
   */
  style?: any;
}

export interface GeneralLayoutProps {
  /**
   * The main content to display
   */
  children?: ReactNode;
  
  /**
   * Sidebar configuration
   */
  sidebar?: SidebarConfig;
  
  /**
   * Header configuration
   */
  header?: HeaderConfig;
  
  /**
   * Additional styles for the layout container
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}

export interface GeneralLayoutState {
  /**
   * Whether the sidebar is currently expanded
   */
  isSidebarExpanded: boolean;
} 
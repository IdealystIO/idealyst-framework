import React from 'react';

export interface WebTabItem {
  /**
   * Unique identifier for the tab
   */
  id: string;
  
  /**
   * Display label for the tab
   */
  label: string;
  
  /**
   * Icon for the tab (React component or Material Design icon name)
   */
  icon?: React.ReactNode | string;
  
  /**
   * Badge to display on the tab
   */
  badge?: string | number;
  
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean;
}

export interface WebTabConfig {
  /**
   * List of tab items
   */
  items: WebTabItem[];
  
  /**
   * Currently active tab ID
   */
  activeTab?: string;
  
  /**
   * Callback when tab is selected
   */
  onTabSelect?: (tabId: string) => void;
  
  /**
   * Position of tabs: 'auto', 'header', or 'bottom'
   * 'auto' uses breakpoint to determine position
   */
  position?: 'auto' | 'header' | 'bottom';
  
  /**
   * Breakpoint in pixels for auto positioning
   * Above this width, tabs go to header. Below, they go to bottom.
   */
  autoBreakpoint?: number;
  
  /**
   * Additional styles for the tab bar
   */
  style?: any;
}

export interface WebTabLayoutProps {
  /**
   * Child components to render in the main content area
   */
  children?: React.ReactNode;
  
  /**
   * List of tabs to display
   */
  tabs?: WebTabItem[];
  
  /**
   * Currently active tab ID
   */
  activeTab?: string;
  
  /**
   * Callback when tab changes
   */
  onTabChange?: (tabId: string) => void;
  
  /**
   * Position of tabs: 'auto', 'header', or 'bottom'
   * 'auto' uses breakpoint to determine position (default)
   */
  position?: 'auto' | 'header' | 'bottom';
  
  /**
   * Breakpoint in pixels for auto positioning (default: 768)
   * Above this width, tabs go to header. Below, they go to bottom.
   */
  breakpoint?: number;
  
  /**
   * Header configuration
   */
  header?: {
    /**
     * Whether to show the header
     */
    enabled?: boolean;
    
    /**
     * Header height in pixels
     */
    height?: number;
    
    /**
     * Header title
     */
    title?: string;
    
    /**
     * Whether to show back button
     */
    showBackButton?: boolean;
    
    /**
     * Back button press handler
     */
    onBackPress?: () => void;
    
    /**
     * Custom header content (overrides title and back button)
     */
    content?: React.ReactNode;
    
    /**
     * Additional content for header right side
     */
    rightContent?: React.ReactNode;
    
    /**
     * Additional header styles
     */
    style?: any;
  };
  
  /**
   * Additional styles for the layout container
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}
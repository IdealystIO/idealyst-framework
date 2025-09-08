import { ReactNode } from 'react';

export interface TabBarItem {
  /**
   * Unique identifier for the tab
   */
  id: string;
  
  /**
   * Display label for the tab
   */
  label: string;
  
  /**
   * Icon for the tab (can be a component or icon name)
   */
  icon?: ReactNode | string;
  
  /**
   * Badge content to display on the tab
   */
  badge?: string | number;
  
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean;
  
  /**
   * Custom render function for the tab button
   */
  renderTab?: (props: TabButtonProps) => ReactNode;
}

export interface TabButtonProps {
  item: TabBarItem;
  isActive: boolean;
  onPress: () => void;
  position: 'bottom' | 'header';
}

export interface TabBarConfig {
  /**
   * Array of tab items
   */
  items: TabBarItem[];
  
  /**
   * Currently active tab ID
   */
  activeTab?: string;
  
  /**
   * Callback when tab is selected
   */
  onTabSelect?: (tabId: string) => void;
  
  /**
   * Position of tab bar
   * - 'bottom': Traditional mobile tab bar at bottom
   * - 'header': Tabs integrated into header (for wider screens)
   * - 'auto': Automatically choose based on screen width
   */
  position?: 'bottom' | 'header' | 'auto';
  
  /**
   * Breakpoint for auto position switching (default: 768px)
   */
  autoBreakpoint?: number;
  
  /**
   * Custom styles for tab bar container
   */
  style?: any;
  
  /**
   * Custom styles for tab buttons
   */
  tabStyle?: any;
  
  /**
   * Whether to show labels with icons
   */
  showLabels?: boolean;
  
  /**
   * Custom component for rendering tab bar
   */
  renderTabBar?: (props: TabBarRenderProps) => ReactNode;
}

export interface TabBarRenderProps {
  items: TabBarItem[];
  activeTab?: string;
  onTabSelect?: (tabId: string) => void;
  position: 'bottom' | 'header';
}

export interface TabBarHeaderConfig {
  /**
   * Whether the header is enabled
   */
  enabled?: boolean;
  
  /**
   * Height of the header
   */
  height?: number;
  
  /**
   * Header title (native-style)
   */
  title?: string;
  
  /**
   * Whether to show back button (auto-detected from navigation stack)
   */
  showBackButton?: boolean;
  
  /**
   * Custom back button handler (overrides native navigation)
   */
  onBackPress?: () => void;
  
  /**
   * Content to display in the header (left side) - overrides native elements
   */
  content?: ReactNode;
  
  /**
   * Content to display on the right side of header
   */
  rightContent?: ReactNode;
  
  /**
   * Custom styles for the header
   */
  style?: any;
  
  /**
   * Whether to show tabs in header (when position is 'header')
   */
  showTabs?: boolean;
  
  /**
   * Use native header styling (platform-specific)
   */
  native?: boolean;
}

export interface TabBarLayoutProps {
  /**
   * The main content to display
   */
  children?: ReactNode;
  
  /**
   * Tab bar configuration
   */
  tabBar?: TabBarConfig;
  
  /**
   * Header configuration
   */
  header?: TabBarHeaderConfig;
  
  /**
   * Additional styles for the layout container
   */
  style?: any;
  
  /**
   * Test ID for testing
   */
  testID?: string;
}
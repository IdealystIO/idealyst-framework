import React, { useState, useCallback } from 'react';
import { View, Button, Text } from '@idealyst/components';
import { GeneralLayoutProps, SidebarConfig, HeaderConfig } from './types';
import { generalLayoutStyles } from './GeneralLayout.styles';

const GeneralLayout: React.FC<GeneralLayoutProps> = ({
  children,
  sidebar = {},
  header = {},
  style,
  testID,
}) => {
  // Default sidebar configuration
  const sidebarConfig: Required<SidebarConfig> = {
    enabled: true,
    initiallyExpanded: true,
    expandedWidth: 280,
    collapsedWidth: 60,
    collapsible: true,
    position: 'left',
    content: null,
    style: undefined,
    ...sidebar,
  };

  // Default header configuration
  const headerConfig: Required<HeaderConfig> = {
    enabled: true,
    height: 64,
    content: null,
    style: undefined,
    ...header,
  };

  // State for sidebar expansion
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    sidebarConfig.initiallyExpanded
  );

  // Toggle sidebar expansion
  const toggleSidebar = useCallback(() => {
    if (sidebarConfig.collapsible) {
      setIsSidebarExpanded((prev) => !prev);
    }
  }, [sidebarConfig.collapsible]);

  // Calculate sidebar width based on expanded state
  const sidebarWidth = isSidebarExpanded 
    ? sidebarConfig.expandedWidth 
    : sidebarConfig.collapsedWidth;

  // Create dynamic styles for sidebar width
  const sidebarDynamicStyles = {
    width: sidebarWidth,
    minWidth: sidebarWidth,
    maxWidth: sidebarWidth,
    order: sidebarConfig.position === 'right' ? 3 : 1,
  };

  // Create dynamic styles for header height
  const headerDynamicStyles = {
    height: headerConfig.height,
    minHeight: headerConfig.height,
  };

  return (
    <View 
      background="transparent"
      style={[
        generalLayoutStyles.container,
        style,
      ]}
      testID={testID}
    >
      {/* Header */}
      {headerConfig.enabled && (
        <View 
          border="thin"
          spacing="md"
          style={[
            generalLayoutStyles.headerContainer,
            headerDynamicStyles,
            headerConfig.style,
          ]}
        >
          {headerConfig.content}
        </View>
      )}

      {/* Body Container */}
      <View style={generalLayoutStyles.bodyContainer}>
        {/* Sidebar */}
        {sidebarConfig.enabled && (
          <View 
            background="surface"
            border="thin"
            spacing="md"
            style={[
              generalLayoutStyles.sidebar,
              sidebarDynamicStyles,
              sidebarConfig.style,
            ]}
          >
            {/* Sidebar Toggle Button - Positioned within sidebar using flexbox */}
            {sidebarConfig.collapsible && (
              <Button
                onPress={toggleSidebar}
                variant="outlined"
                size="small"
                style={[
                  generalLayoutStyles.sidebarToggle,
                  // Align toggle button based on sidebar position
                  { alignSelf: sidebarConfig.position === 'right' ? 'flex-start' : 'flex-end' }
                ]}
              >
                  {sidebarConfig.position === 'right' 
                    ? (isSidebarExpanded ? '→' : '←')
                    : (isSidebarExpanded ? '←' : '→')
                  }
              </Button>
            )}

            {/* Sidebar Content */}
            <View style={generalLayoutStyles.sidebarContent}>
              {sidebarConfig.content}
            </View>
          </View>
        )}

        {/* Main Content Area */}
        <View style={generalLayoutStyles.mainContent}>
          <View 
            style={generalLayoutStyles.contentArea}
          >
            {children}
          </View>
        </View>
      </View>
    </View>
  );
};

export default GeneralLayout;

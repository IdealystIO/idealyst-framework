import React, { useState, useEffect } from 'react';
import { View, Text, Button, Icon, Pressable } from '@idealyst/components';
import { getWebProps } from 'react-native-unistyles/web';
import { WebTabLayoutProps, WebTabConfig, WebTabItem } from './types';
import { webTabLayoutStyles } from './WebTabLayout.styles';

const DEFAULT_BREAKPOINT = 768;

const WebTabLayout: React.FC<WebTabLayoutProps> = ({
  children,
  tabs = [],
  activeTab,
  onTabChange,
  position = 'auto',
  breakpoint = DEFAULT_BREAKPOINT,
  header = {},
  style,
  testID,
}) => {
  const styles = webTabLayoutStyles;
  const [screenWidth, setScreenWidth] = useState(() => window.innerWidth);

  // Update screen width on window resize
  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Determine actual tab position
  const actualTabPosition = (() => {
    if (position === 'auto') {
      return screenWidth >= breakpoint ? 'header' : 'bottom';
    }
    return position;
  })();

  const showTabsInHeader = actualTabPosition === 'header';
  const showTabsAtBottom = actualTabPosition === 'bottom';

  // Default header configuration
  const headerConfig = {
    enabled: true,
    height: 64,
    title: undefined,
    showBackButton: false,
    onBackPress: undefined,
    content: null,
    rightContent: null,
    style: undefined,
    ...header,
  };

  const handleBackPress = () => {
    if (headerConfig.onBackPress) {
      headerConfig.onBackPress();
    } else {
      window.history.back();
    }
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Header */}
      {headerConfig.enabled && (
        <View
          style={[
            styles.headerContainer,
            {
              height: headerConfig.height,
              minHeight: headerConfig.height,
            },
            headerConfig.style,
          ]}
        >
          <View style={styles.headerContent}>
            {/* Custom content overrides native elements */}
            {headerConfig.content ? (
              headerConfig.content
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {/* Back Button */}
                {headerConfig.showBackButton && (
                  <Button
                    variant="text"
                    onPress={handleBackPress}
                    style={{ marginRight: 8, minWidth: 'auto' }}
                  >
                    <Icon name="arrow-left" size="lg" color="primary" />
                  </Button>
                )}

                {/* Title */}
                {headerConfig.title && (
                  <Text
                    size="large"
                    weight="semibold"
                    style={{ flex: 1 }}
                  >
                    {headerConfig.title}
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.headerRightContent}>
            {/* Tabs in header for wide screens */}
            {showTabsInHeader && tabs.length > 0 && (
              <WebTabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
                position="header"
              />
            )}

            {/* Additional right content */}
            {headerConfig.rightContent}
          </View>
        </View>
      )}

      {/* Main Content Area */}
      <View style={styles.bodyContainer}>
        <View style={styles.mainContent}>
          <View style={styles.contentArea}>
            {children}
          </View>
        </View>
      </View>

      {/* Bottom Tab Bar */}
      {showTabsAtBottom && tabs.length > 0 && (
        <View style={styles.tabBarBottomContainer}>
          <WebTabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            position="bottom"
          />
        </View>
      )}
    </View>
  );
};

const WebTabBar: React.FC<{
  tabs: WebTabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  position: 'header' | 'bottom';
}> = ({ tabs, activeTab, onTabChange, position }) => {
  const styles = webTabLayoutStyles;

  const containerStyle = position === 'header' 
    ? styles.headerTabs 
    : styles.tabBarBottom;

  return (
    <View style={containerStyle}>
      {tabs.map((tab) => (
        <WebTabButton
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTab}
          onPress={() => onTabChange?.(tab.id)}
          position={position}
        />
      ))}
    </View>
  );
};

const WebTabButton: React.FC<{
  tab: WebTabItem;
  isActive: boolean;
  onPress: () => void;
  position: 'header' | 'bottom';
}> = ({ tab, isActive, onPress, position }) => {
  const styles = webTabLayoutStyles;
  const isHeader = position === 'header';

  return (
    <Pressable
      onPress={onPress}
      disabled={tab.disabled}
      style={[
        isHeader ? styles.tabButtonHeader : styles.tabButton,
        isActive && styles.tabButtonActive,
        tab.disabled && styles.tabButtonDisabled,
      ]}
    >
      <View style={styles.tabIconContainer}>
        {tab.icon && (
          typeof tab.icon === 'string' ? (
            <Icon 
              name={tab.icon as any} 
              size={isHeader ? "lg" : "md"} 
              color={isActive ? 'primary' : 'secondary'} 
            />
          ) : (
            tab.icon
          )
        )}
        {tab.badge !== undefined && (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>
              {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
            </Text>
          </View>
        )}
      </View>
      {(!isHeader || (isHeader && tab.label)) && (
        <Text 
          size={isHeader ? "medium" : "small"}
          color={isActive ? 'primary' : 'secondary'}
          style={isHeader ? { marginLeft: 8 } : { marginTop: 2, textAlign: 'center', fontSize: 10 }}
        >
          {tab.label}
        </Text>
      )}
    </Pressable>
  );
};

export default WebTabLayout;
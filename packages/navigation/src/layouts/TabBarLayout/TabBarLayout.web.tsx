import React, { useState, useEffect } from 'react';
import { View, Text, Button, Icon, Pressable } from '@idealyst/components';
import { TabBarLayoutProps, TabBarConfig, TabButtonProps } from './types';
import { tabBarLayoutStyles } from './TabBarLayout.styles';

const DEFAULT_AUTO_BREAKPOINT = 768;

// Web doesn't need safe area insets
const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });

const WebHeader: React.FC<{
  config: any;
  styles: any;
  showTabsInHeader: boolean;
  tabBarConfig: TabBarConfig;
  insets: any;
}> = ({ config, styles, showTabsInHeader, tabBarConfig, insets }) => {
  const handleBackPress = () => {
    if (config.onBackPress) {
      config.onBackPress();
    } else {
      // Web history back
      window.history.back();
    }
  };

  const headerDynamicStyles = {
    height: config.height,
    minHeight: config.height,
    paddingTop: config.enabled ? insets.top : 0,
  };

  return (
    <View 
      style={[
        styles.headerContainer,
        headerDynamicStyles,
        config.style,
      ]}
    >
      <View style={styles.headerContent}>
        {/* Custom content overrides native elements */}
        {config.content ? (
          config.content
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {/* Back Button */}
            {config.showBackButton && (
              <Button
                variant="text"
                onPress={handleBackPress}
                style={{ marginRight: 8, minWidth: 'auto' }}
              >
                <Icon name="arrow-left" size="lg" color="primary" />
              </Button>
            )}
            
            {/* Title */}
            {config.title && (
              <Text 
                size="large" 
                weight="semibold"
                style={{ flex: 1 }}
              >
                {config.title}
              </Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.headerRightContent}>
        {/* Tabs in header for wide screens */}
        {showTabsInHeader && tabBarConfig.items.length > 0 && (
          <TabBar config={tabBarConfig} position="header" />
        )}
        
        {/* Additional right content */}
        {config.rightContent}
      </View>
    </View>
  );
};

const TabButton: React.FC<TabButtonProps> = ({ item, isActive, onPress, position }) => {
  const styles = tabBarLayoutStyles;
  const isHeader = position === 'header';
  
  return (
    <Pressable
      onPress={onPress}
      disabled={item.disabled}
      style={[
        isHeader ? styles.tabButtonHeader : styles.tabButton,
        isActive && styles.tabButtonActive,
        item.disabled && styles.tabButtonDisabled,
      ]}
    >
      <View style={styles.tabIconContainer}>
        {item.icon && (
          typeof item.icon === 'string' ? (
            <Icon name={item.icon as any} size={isHeader ? "lg" : "md"} color={isActive ? 'primary' : 'secondary'} />
          ) : (
            item.icon
          )
        )}
        {item.badge !== undefined && (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>
              {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
            </Text>
          </View>
        )}
      </View>
      {(!isHeader || (isHeader && item.label)) && (
        <Text 
          size={isHeader ? "medium" : "small"}
          color={isActive ? 'primary' : 'secondary'}
          style={isHeader ? { marginLeft: 8 } : { marginTop: 2, textAlign: 'center', fontSize: 10 }}
        >
          {item.label}
        </Text>
      )}
    </Pressable>
  );
};

const TabBar: React.FC<{
  config: TabBarConfig;
  position: 'bottom' | 'header';
}> = ({ config, position }) => {
  const styles = tabBarLayoutStyles;
  
  if (config.renderTabBar) {
    return (
      <>
        {config.renderTabBar({
          items: config.items,
          activeTab: config.activeTab,
          onTabSelect: config.onTabSelect,
          position,
        })}
      </>
    );
  }
  
  const containerStyle = position === 'header' 
    ? styles.headerTabs 
    : [styles.tabBarBottom, config.style];
  
  return (
    <View style={containerStyle}>
      {config.items.map((item) => {
        if (item.renderTab) {
          return (
            <React.Fragment key={item.id}>
              {item.renderTab({
                item,
                isActive: item.id === config.activeTab,
                onPress: () => config.onTabSelect?.(item.id),
                position,
              })}
            </React.Fragment>
          );
        }
        
        return (
          <TabButton
            key={item.id}
            item={item}
            isActive={item.id === config.activeTab}
            onPress={() => config.onTabSelect?.(item.id)}
            position={position}
          />
        );
      })}
    </View>
  );
};

const TabBarLayout: React.FC<TabBarLayoutProps> = ({
  children,
  tabBar = {},
  header = {},
  style,
  testID,
}) => {
  const styles = tabBarLayoutStyles;
  const insets = useSafeAreaInsets();
  const [screenWidth, setScreenWidth] = useState(() => window.innerWidth);
  
  // Default tab bar configuration
  const tabBarConfig = {
    items: [],
    activeTab: undefined,
    onTabSelect: undefined,
    position: 'auto' as const,
    autoBreakpoint: DEFAULT_AUTO_BREAKPOINT,
    style: undefined,
    tabStyle: undefined,
    showLabels: true,
    renderTabBar: undefined,
    ...tabBar,
  };
  
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
    showTabs: true,
    native: true,
    ...header,
  };
  
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
    if (tabBarConfig.position === 'auto') {
      // On web, use header tabs for wide screens
      return screenWidth >= tabBarConfig.autoBreakpoint ? 'header' : 'bottom';
    }
    return tabBarConfig.position;
  })();
  
  const showTabsInHeader = actualTabPosition === 'header' && headerConfig.showTabs;
  const showTabsAtBottom = actualTabPosition === 'bottom';
  
  // Create dynamic styles for bottom tab bar (no safe area needed on web)
  const tabBarBottomStyles = {
    paddingBottom: 0,
  };
  
  return (
    <View 
      style={[
        styles.container,
        style,
      ]}
      testID={testID}
    >
      {/* Header */}
      {headerConfig.enabled && (
        <WebHeader 
          config={headerConfig}
          styles={styles}
          showTabsInHeader={showTabsInHeader}
          tabBarConfig={tabBarConfig}
          insets={insets}
        />
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
      {showTabsAtBottom && tabBarConfig.items.length > 0 && (
        <View style={tabBarBottomStyles}>
          <TabBar config={tabBarConfig} position="bottom" />
        </View>
      )}
    </View>
  );
};

export default TabBarLayout;
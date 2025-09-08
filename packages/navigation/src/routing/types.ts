import React from "react";

export type ScreenOptions = {
    /**
     * Screen title for navigation headers
     */
    title?: string;
    
    /**
     * Icon component for tab/drawer navigation (React.ComponentType, React.ReactElement, function, or string)
     */
    tabBarIcon?: React.ComponentType<{ focused: boolean; color: string; size: number }> 
                | React.ReactElement 
                | ((props: { focused: boolean; color: string; size: string }) => React.ReactElement)
                | string;
    
    /**
     * Label for tab/drawer navigation
     */
    tabBarLabel?: string;
    
    /**
     * Badge for tab navigation
     */
    tabBarBadge?: string | number;
    
    /**
     * Whether to show the tab bar for this screen
     */
    tabBarVisible?: boolean;
    
    /**
     * Custom header title component
     */
    headerTitle?: React.ComponentType | string;
    
    /**
     * Whether to show header back button
     */
    headerBackVisible?: boolean;
    
    /**
     * Custom header right component
     */
    headerRight?: React.ComponentType;
    
    /**
     * Additional platform-specific options
     */
    platformOptions?: {
        native?: Record<string, any>;
        web?: Record<string, any>;
    };
};

export type RouteParam = {
    path?: string;
    routes?: RouteParam[];
    component: React.ComponentType;
    layout?: LayoutParam;
    screenOptions?: ScreenOptions;
}

export type LayoutType = 'stack' | 'tab' | 'drawer' | 'modal';

export type LayoutParam = {
    type: LayoutType;
    component?: React.ComponentType<{ children?: React.ReactNode }>;
}
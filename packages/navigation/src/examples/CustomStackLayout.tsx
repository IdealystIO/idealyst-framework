import { Button, Text, View } from "@idealyst/components";
import { StackLayoutProps } from "src";
import React, { useMemo } from "react";

export default function CustomStackLayout({ 
    routes,
    options,
    ContentComponent,
    onNavigate,
    currentPath
}: StackLayoutProps) {

    const headerTitle = useMemo(() => {
        if (!options?.headerTitle) return <Text>{currentPath}</Text>;
        if (typeof options.headerTitle === 'string') {
            return <Text>{options.headerTitle}</Text>;
        }
        const HeaderComponent = options.headerTitle as React.ComponentType;
        return <HeaderComponent />;
    }, [options?.headerTitle, currentPath]);

    return (
        <View style={{ height: '100vh' }}>
            {/* Header */}
            <View style={{ padding: 16, borderBottom: '1px solid #e0e0e0' }}>
                {headerTitle}
            </View>
            
            {/* Main content area with sidebar and content */}
            <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                {/* Left sidebar with routes */}
                <View style={{ 
                    width: 250, 
                    padding: 16, 
                    borderRight: '1px solid #e0e0e0',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                }}>
                    {routes.map(route => (
                        <Button
                            variant={currentPath === route.path ? 'contained' : 'outlined'}
                            key={route.path}
                            onPress={() => onNavigate(route.path)}
                            style={{ 
                                justifyContent: 'flex-start',
                                textAlign: 'left'
                            }}
                        >
                            {route.path === '/' ? 'Home' : route.path}
                        </Button>
                    ))}
                </View>
                
                {/* Main content area */}
                <View style={{ flex: 1, padding: 16 }}>
                    <ContentComponent />
                </View>
            </View>
        </View>
    )
}
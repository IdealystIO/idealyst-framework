import React from "react";
import { Button, View, Text } from "@idealyst/components";
import { TabLayoutProps } from "src/routing";

export default function CustomTabLayout({
    routes,
    options,
    ContentComponent,
    onNavigate,
    currentPath
}: TabLayoutProps) {

    return (
        <View>
            <View>
                {options?.headerTitle ? (
                    typeof options.headerTitle === 'string' ? (
                        <Text>{options.headerTitle}</Text>
                    ) : (
                        React.createElement(options.headerTitle as React.ComponentType)
                    )
                ) : (
                    <Text>Custom Tab Layout</Text>
                )}
            </View>
            <View style={{ flexDirection: 'row' }}>
                {routes.map(route => (
                    <Button
                        variant={currentPath === route.fullPath ? 'contained' : 'outlined'}
                        key={route.path}
                        onPress={() => onNavigate(route.path)}
                        style={{ margin: 4 }}
                    >
                        {route.fullPath === '/' ? 'Home' : route.fullPath}
                    </Button>
                ))}
            </View>
            <View>
                <ContentComponent />
            </View>
        </View>
    )

}
import React from "react";
import { Button, View, Text, Pressable } from "@idealyst/components";
import { RouteParam, TabBarScreenOptions, TabLayoutProps } from "src/routing";

export default function CustomTabLayout({
    routes,
    options,
    ContentComponent,
    onNavigate,
    currentPath
}: TabLayoutProps) {
    console.log(routes)
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
                    <TabButton
                        key={route.path}
                        route={route}
                        onNavigate={onNavigate}
                        currentPath={currentPath}
                    />
                ))}
            </View>
            <View>
                <ContentComponent />
            </View>
        </View>
    )

}

type TabButtonProps = {
    route: RouteParam<TabBarScreenOptions>
    onNavigate: (path: string) => void
    currentPath: string
}

function TabButton({route, onNavigate, currentPath}: TabButtonProps) {
    if (route.type !== 'screen') return null
    return (
        <Pressable
        key={route.path}
        onPress={() => onNavigate(route.path)}
        style={{ margin: 4 }}
    >
        {route.options?.tabBarIcon?.({ size: 20, color: currentPath === route.path ? 'blue' : 'black' })}
        <Text style={{ color: currentPath === route.fullPath ? 'blue' : 'black' }}>
            {route.fullPath === '/' ? 'Home' : route.fullPath}
        </Text>
    </Pressable>
    )
}
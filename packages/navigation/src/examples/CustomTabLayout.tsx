import React from "react";
import { Button, View, Text, Pressable } from "@idealyst/components";
import { RouteParam, TabBarScreenOptions, TabLayoutProps } from "../routing";
import { useNavigator } from "../context";

export default function CustomTabLayout({
    routes,
    options,
    currentPath
}: TabLayoutProps) {

    const navigator = useNavigator();

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
                        onNavigate={(path) => navigator.navigate({ path: route.fullPath })}
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
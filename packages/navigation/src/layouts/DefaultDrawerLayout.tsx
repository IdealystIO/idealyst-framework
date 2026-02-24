import React from 'react'
import { View, Text, Pressable, Icon } from '@idealyst/components'
import { TabLayoutProps, DrawerSidebarProps } from '../routing/types'
import { Outlet } from '../router'
import { useNavigator } from '../context'

export interface DrawerLayoutProps extends TabLayoutProps {
    /**
     * Optional custom sidebar component.
     * When provided, replaces the default sidebar navigation.
     */
    sidebarComponent?: React.ComponentType<DrawerSidebarProps>
}

/**
 * Default Drawer Layout Component for Web
 * Provides a sidebar + content navigation interface using @idealyst/components.
 * The sidebar displays navigation items from routes with active state highlighting.
 * If a custom sidebarComponent is provided, it renders that instead of the default sidebar.
 */
export const DefaultDrawerLayout: React.FC<DrawerLayoutProps> = ({
    options,
    routes,
    currentPath,
    sidebarComponent: SidebarComponent
}) => {
    const navigator = useNavigator()

    return (
        <View style={{ height: '100vh', flexDirection: 'column' }}>
            {/* Header */}
            {(options?.headerTitle || options?.headerLeft || options?.headerRight) && (
                <View style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e0e0e0',
                    backgroundColor: '#f8f9fa'
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            {options?.headerLeft && React.createElement(options.headerLeft as any)}

                            {options?.headerTitle && (
                                typeof options.headerTitle === 'string' ? (
                                    <Text typography="h4" style={{ marginLeft: options.headerLeft ? 12 : 0 }}>
                                        {options.headerTitle}
                                    </Text>
                                ) : (
                                    React.createElement(options.headerTitle as any)
                                )
                            )}
                        </View>

                        {options?.headerRight && React.createElement(options.headerRight as any)}
                    </View>
                </View>
            )}

            {/* Sidebar + Content */}
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* Sidebar */}
                {SidebarComponent ? (
                    <View style={{
                        width: 240,
                        borderRightWidth: 1,
                        borderRightColor: '#e0e0e0',
                        backgroundColor: '#f8f9fa'
                    }}>
                        <SidebarComponent />
                    </View>
                ) : (
                    <View style={{
                        width: 240,
                        borderRightWidth: 1,
                        borderRightColor: '#e0e0e0',
                        backgroundColor: '#f8f9fa',
                        paddingTop: 8
                    }}>
                        {routes.map((route) => {
                            if (route.type !== 'screen') return null

                            const isActive = currentPath === route.fullPath
                                || (route.fullPath !== '/' && currentPath.startsWith(route.fullPath + '/'))
                            const screenRoute = route as any
                            const label = screenRoute.options?.tabBarLabel
                                || screenRoute.options?.title
                                || (route.fullPath === '/' ? 'Home' : route.fullPath)
                            const icon = screenRoute.options?.tabBarIcon

                            return (
                                <Pressable
                                    key={route.path}
                                    onPress={() => navigator.navigate({ path: route.fullPath })}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                        paddingHorizontal: 16,
                                        gap: 10,
                                        backgroundColor: isActive ? '#e8f0fe' : 'transparent',
                                        borderRightWidth: isActive ? 3 : 0,
                                        borderRightColor: isActive ? '#1a73e8' : 'transparent'
                                    }}
                                >
                                    {icon && typeof icon === 'string' && (
                                        <Icon
                                            name={icon as any}
                                            size="sm"
                                            color={isActive ? 'blue' : 'gray'}
                                        />
                                    )}
                                    <Text
                                        typography="body2"
                                        weight={isActive ? 'semibold' : 'normal'}
                                        color={isActive ? 'primary' : undefined}
                                    >
                                        {label}
                                    </Text>
                                </Pressable>
                            )
                        })}
                    </View>
                )}

                {/* Content Area */}
                <View style={{ flex: 1, padding: 20 }}>
                    <Outlet />
                </View>
            </View>
        </View>
    )
}

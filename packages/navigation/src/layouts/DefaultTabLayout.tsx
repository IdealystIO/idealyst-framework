import React from 'react'
import { View, Text, Button, Icon } from '@idealyst/components'
import { TabLayoutProps } from '../routing/types'
import { Outlet } from '..'

export interface DefaultTabLayoutProps extends TabLayoutProps {}

/**
 * Default Tab Layout Component for Web
 * Provides a simple tab navigation interface using @idealyst/components
 */
export const DefaultTabLayout: React.FC<DefaultTabLayoutProps> = ({
    options,
    routes,
    onNavigate,
    currentPath
}) => {
    return (
        <View style={{ height: '100vh', flexDirection: 'column' }}>
            {/* Header */}
            {options?.headerTitle && (
                <View style={{ 
                    padding: 16, 
                    borderBottomWidth: 1, 
                    borderBottomColor: '#e0e0e0',
                    backgroundColor: '#f8f9fa'
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            {options.headerLeft && React.createElement(options.headerLeft as any)}
                            
                            {typeof options.headerTitle === 'string' ? (
                                <Text size="large" weight="bold" style={{ marginLeft: options.headerLeft ? 12 : 0 }}>
                                    {options.headerTitle}
                                </Text>
                            ) : (
                                React.createElement(options.headerTitle as any)
                            )}
                        </View>
                        
                        {options.headerRight && React.createElement(options.headerRight as any)}
                    </View>
                </View>
            )}
            
            {/* Tab Navigation */}
            <View style={{ 
                padding: 12, 
                borderBottomWidth: 1, 
                borderBottomColor: '#e0e0e0',
                backgroundColor: '#ffffff'
            }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {routes.map((route) => {
                        if (route.type !== 'screen') return null
                        
                        const isActive = currentPath === route.fullPath
                        const screenRoute = route as any
                        const label = screenRoute.options?.tabBarLabel || screenRoute.options?.title || (route.fullPath === '/' ? 'Home' : route.fullPath)
                        const icon = screenRoute.options?.tabBarIcon
                        
                        return (
                            <Button
                                key={route.path}
                                variant={isActive ? 'contained' : 'outlined'}
                                intent={isActive ? 'primary' : undefined}
                                size="small"
                                onPress={() => onNavigate(route.path)}
                                style={{ 
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 6
                                }}
                            >
                                {icon && typeof icon === 'string' && (
                                    <Icon 
                                        name={icon as any} 
                                        size="sm" 
                                        color={isActive ? 'white' : 'primary'} 
                                    />
                                )}
                                <Text 
                                    size="small" 
                                    color={isActive ? 'white' : 'primary'}
                                    weight={isActive ? 'semibold' : 'medium'}
                                >
                                    {label}
                                </Text>
                            </Button>
                        )
                    })}
                </View>
            </View>
            
            {/* Content Area */}
            <View style={{ flex: 1, padding: 20 }}>
                <Outlet />
            </View>
        </View>
    )
}

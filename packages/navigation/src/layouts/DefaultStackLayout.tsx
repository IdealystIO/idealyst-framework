import React from 'react'
import { View, Text } from '@idealyst/components'
import { StackLayoutProps } from '../routing/types'
import { Outlet } from '../router'
export interface DefaultStackLayoutProps extends StackLayoutProps {
    onNavigate: (path: string) => void
    currentPath: string
}

/**
 * Default Stack Layout Component for Web
 * Provides a simple stack navigation interface using @idealyst/components
 */
export const DefaultStackLayout: React.FC<DefaultStackLayoutProps> = ({
    options,
    routes,
    onNavigate,
    currentPath
}) => {
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
                            {options.headerLeft && React.createElement(options.headerLeft as any)}
                            
                            {options.headerTitle && (
                                typeof options.headerTitle === 'string' ? (
                                    <Text size="large" weight="bold" style={{ marginLeft: options.headerLeft ? 12 : 0 }}>
                                        {options.headerTitle}
                                    </Text>
                                ) : (
                                    React.createElement(options.headerTitle as any)
                                )
                            )}
                        </View>
                        
                        {options.headerRight && React.createElement(options.headerRight as any)}
                    </View>
                </View>
            )}
            
            {/* Content Area */}
            <View style={{ flex: 1, padding: 20 }}>
                <Outlet />
            </View>
        </View>
    )
}

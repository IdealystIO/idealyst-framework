import React, { useState, useMemo } from 'react';
import { Dialog, View, Text, Input, ListItem, List } from '@idealyst/components';
import { useNavigator } from '../context';
import type { IconName } from '@idealyst/components';

// Icon mapping for routes
const routeIcons: Record<string, IconName> = {
    '/': 'home',
    'button': 'gesture-tap',
    'checkbox': 'checkbox-marked',
    'input': 'form-textbox',
    'radio-button': 'radiobox-marked',
    'select': 'form-dropdown',
    'slider': 'tune',
    'switch': 'toggle-switch',
    'textarea': 'note-text',
    'accordion': 'chevron-down',
    'alert': 'information',
    'avatar': 'account-circle',
    'badge': 'label',
    'card': 'credit-card',
    'chip': 'label',
    'icon': 'emoticon',
    'list': 'format-list-bulleted',
    'skeleton': 'timer-sand-empty',
    'text': 'format-text',
    'divider': 'minus',
    'screen': 'cellphone',
    'view': 'view-compact',
    'breadcrumb': 'chevron-right',
    'tabbar': 'tab',
    'dialog': 'picture-in-picture-bottom-right',
    'menu': 'menu',
    'popover': 'message',
    'tooltip': 'help',
    'progress': 'timer-sand-empty',
    'image': 'image',
    'svg-image': 'image',
    'video': 'video',
    'datagrid': 'grid',
    'datepicker': 'calendar-today',
    'table': 'table',
    'theme-extension': 'palette',
};

// Get all routes recursively
const getAllRoutes = (routes: any[]): Array<{ path: string; title: string; icon?: IconName }> => {
    const result: Array<{ path: string; title: string; icon?: IconName }> = [];

    routes.forEach((route) => {
        if (route.type === 'screen' && route.options?.title) {
            result.push({
                path: route.path,
                title: route.options.title,
                icon: routeIcons[route.path],
            });
        }
        if (route.routes) {
            result.push(...getAllRoutes(route.routes));
        }
    });

    return result;
};

interface ExampleSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ExampleSearchDialog({ open, onOpenChange }: ExampleSearchDialogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const navigator = useNavigator();

    // Get all available pages
    const allPages = useMemo(() => {
        if (!navigator.route?.routes) return [];
        return getAllRoutes(navigator.route.routes);
    }, [navigator.route]);

    // Filter pages based on search query
    const filteredPages = useMemo(() => {
        if (!searchQuery.trim()) return allPages;

        const query = searchQuery.toLowerCase();
        return allPages.filter((page) =>
            page.title.toLowerCase().includes(query)
        );
    }, [searchQuery, allPages]);

    const handleNavigate = (path: string) => {
        navigator.navigate({ path: `/${path}` });
        onOpenChange(false);
        setSearchQuery('');
    };

    // Reset search when dialog closes
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setSearchQuery('');
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange} title='Search Pages'>
            <View spacing='md'>
                <Input
                    placeholder='Search for a page...'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    leftIcon='magnify'
                />
                {filteredPages.length > 0 ? (
                    <List scrollable maxHeight={400}>
                        {filteredPages.map((page) => (
                            <ListItem
                                size='sm'
                                key={page.path}
                                label={page.title}
                                leading={page.icon}
                                onPress={() => handleNavigate(page.path)}
                            />
                        ))}
                    </List>
                ) : (
                    <Text color='tertiary' style={{ textAlign: 'center', padding: 16 }}>
                        No pages found
                    </Text>
                )}
            </View>
        </Dialog>
    );
}

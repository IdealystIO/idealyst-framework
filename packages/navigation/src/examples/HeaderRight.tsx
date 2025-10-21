import React, { useState } from 'react';
import { Button, Dialog, View, Text } from '@idealyst/components';
import { UnistylesRuntime } from 'react-native-unistyles';

export default function HeaderRight() {

    const [isDark, setIsDark] = useState(false);

    const [showDialog, setShowDialog] = useState(false);
    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        UnistylesRuntime.setTheme(newTheme);
        setIsDark(!isDark);
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button leftIcon="magnify" size='md' intent='neutral' variant='text' onPress={() => setShowDialog(true)} />
            <Button variant='outlined' size='sm' onPress={toggleTheme}>
                Toggle Theme
            </Button>
            <Dialog open={showDialog} onOpenChange={setShowDialog} title='Search'>
                <Text>Search dialog content goes here.</Text>
            </Dialog>
        </View>
    );
}
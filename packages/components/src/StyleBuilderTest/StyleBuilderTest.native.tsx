/**
 * StyleBuilderTest - Native implementation
 * Uses raw React Native primitives to test defineStyle system
 */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { styleBuilderTestStyles } from './StyleBuilderTest.styles';

export interface StyleBuilderTestProps {
    intent?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function StyleBuilderTest({
    intent = 'primary',
    size = 'md',
}: StyleBuilderTestProps) {
    styleBuilderTestStyles.useVariants({
        intent,
        size,
    });

    const toggleTheme = () => {
        const currentTheme = UnistylesRuntime.themeName;
        UnistylesRuntime.setTheme(currentTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <View style={styleBuilderTestStyles.container}>
            <Text style={styleBuilderTestStyles.title}>
                StyleBuilder Test (Native)
            </Text>
            <Text style={styleBuilderTestStyles.subtitle}>
                Theme: {UnistylesRuntime.themeName}
            </Text>

            <View style={styleBuilderTestStyles.box}>
                <Text style={styleBuilderTestStyles.boxText}>
                    Intent: {intent} | Size: {size}
                </Text>
            </View>

            <Pressable style={styleBuilderTestStyles.button} onPress={toggleTheme}>
                <Text style={styleBuilderTestStyles.buttonText}>
                    Toggle Theme
                </Text>
            </Pressable>

            <Text style={styleBuilderTestStyles.info}>
                ✓ Box colors should match intent{'\n'}
                ✓ Colors should change on theme toggle
            </Text>
        </View>
    );
}

export default StyleBuilderTest;

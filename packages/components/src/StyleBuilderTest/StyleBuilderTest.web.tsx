/**
 * StyleBuilderTest - Web implementation
 * Uses raw HTML elements to test defineStyle system
 */
import React from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';
import { styleBuilderTestStyles } from './StyleBuilderTest.styles';
import { getWebProps } from 'react-native-unistyles/web';

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

    const containerProps = getWebProps(styleBuilderTestStyles.container);
    const titleProps = getWebProps(styleBuilderTestStyles.title);
    const subtitleProps = getWebProps(styleBuilderTestStyles.subtitle);
    const boxProps = getWebProps(styleBuilderTestStyles.box);
    const boxTextProps = getWebProps(styleBuilderTestStyles.boxText);
    const buttonProps = getWebProps(styleBuilderTestStyles.button);
    const buttonTextProps = getWebProps(styleBuilderTestStyles.buttonText);
    const infoProps = getWebProps(styleBuilderTestStyles.info);

    return (
        <div {...containerProps}>
            <span {...titleProps}>
                StyleBuilder Test (Web)
            </span>
            <span {...subtitleProps}>
                Theme: {UnistylesRuntime.themeName}
            </span>

            <div {...boxProps}>
                <span {...boxTextProps}>
                    Intent: {intent} | Size: {size}
                </span>
            </div>

            <button
                {...buttonProps}
                onClick={toggleTheme}
            >
                <span {...buttonTextProps}>
                    Toggle Theme
                </span>
            </button>

            <span {...infoProps}>
                ✓ Box colors should match intent | ✓ Colors should change on theme toggle
            </span>
        </div>
    );
}

export default StyleBuilderTest;

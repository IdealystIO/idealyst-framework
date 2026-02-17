/**
 * Tests for the font scale system.
 *
 * Tests applyFontScale (pure function), contentSizeCategoryToScale mapping,
 * and ThemeBuilder.setFontScale integration.
 */

import { createTheme, fromTheme } from '../src/builder';
import { applyFontScale, contentSizeCategoryToScale } from '../src/fontScale';
import { lightTheme } from '../src/lightTheme';

// =============================================================================
// Helper: build a minimal theme for testing
// =============================================================================

function buildTestTheme() {
    return createTheme()
        .addIntent('primary', { primary: '#3b82f6', contrast: '#fff', light: '#bfdbfe', dark: '#1e40af' })
        .addRadius('md', 8)
        .addShadow('none', {})
        .setColors({
            pallet: {} as any,
            surface: { screen: '#fff' } as any,
            text: { primary: '#000' } as any,
            border: { primary: '#e0e0e0' } as any,
        })
        .setSizes({
            button: {
                sm: { paddingVertical: 6, paddingHorizontal: 12, minHeight: 32, fontSize: 14, lineHeight: 20, iconSize: 14 },
                md: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 40, fontSize: 16, lineHeight: 24, iconSize: 16 },
            },
            iconButton: {
                sm: { size: 32, iconSize: 20 },
                md: { size: 40, iconSize: 24 },
            },
            chip: {
                sm: { paddingVertical: 2, paddingHorizontal: 8, minHeight: 20, borderRadius: 999, fontSize: 11, lineHeight: 14, iconSize: 12 },
                md: { paddingVertical: 2, paddingHorizontal: 10, minHeight: 24, borderRadius: 999, fontSize: 12, lineHeight: 16, iconSize: 14 },
            },
            badge: {
                sm: { minWidth: 16, height: 16, paddingHorizontal: 4, fontSize: 10, lineHeight: 12, iconSize: 10 },
                md: { minWidth: 20, height: 20, paddingHorizontal: 6, fontSize: 12, lineHeight: 14, iconSize: 12 },
            },
            icon: {
                sm: { width: 16, height: 16, fontSize: 16 },
                md: { width: 24, height: 24, fontSize: 24 },
            },
            input: {
                sm: { height: 36, paddingHorizontal: 8, fontSize: 14, iconSize: 16, iconMargin: 4 },
                md: { height: 44, paddingHorizontal: 12, fontSize: 16, iconSize: 20, iconMargin: 6 },
            },
            radioButton: {
                sm: { radioSize: 14, radioDotSize: 10, fontSize: 14, gap: 8 },
                md: { radioSize: 18, radioDotSize: 12, fontSize: 16, gap: 8 },
            },
            select: {
                sm: { paddingHorizontal: 10, minHeight: 36, fontSize: 14, iconSize: 18, borderRadius: 4 },
                md: { paddingHorizontal: 12, minHeight: 44, fontSize: 16, iconSize: 20, borderRadius: 4 },
            },
            slider: {
                sm: { trackHeight: 4, thumbSize: 16, thumbIconSize: 10, markHeight: 8, labelFontSize: 11 },
                md: { trackHeight: 6, thumbSize: 20, thumbIconSize: 12, markHeight: 10, labelFontSize: 12 },
            },
            switch: {
                sm: { trackWidth: 36, trackHeight: 20, thumbSize: 16, thumbIconSize: 10, translateX: 16 },
                md: { trackWidth: 44, trackHeight: 24, thumbSize: 20, thumbIconSize: 12, translateX: 20 },
            },
            textarea: {
                sm: { fontSize: 14, padding: 8, lineHeight: 20, minHeight: 80 },
                md: { fontSize: 16, padding: 12, lineHeight: 24, minHeight: 100 },
            },
            avatar: {
                sm: { width: 32, height: 32, fontSize: 14 },
                md: { width: 40, height: 40, fontSize: 16 },
            },
            progress: {
                sm: { linearHeight: 4, circularSize: 32, labelFontSize: 12, circularLabelFontSize: 10 },
                md: { linearHeight: 8, circularSize: 48, labelFontSize: 14, circularLabelFontSize: 12 },
            },
            accordion: {
                sm: { headerPadding: 12, headerFontSize: 14, iconSize: 18, contentPadding: 12 },
                md: { headerPadding: 16, headerFontSize: 16, iconSize: 20, contentPadding: 16 },
            },
            activityIndicator: {
                sm: { size: 20, borderWidth: 2 },
                md: { size: 36, borderWidth: 3 },
            },
            alert: {
                sm: { padding: 12, gap: 8, borderRadius: 6, titleFontSize: 14, titleLineHeight: 20, messageFontSize: 12, messageLineHeight: 16, iconSize: 20, closeIconSize: 14 },
                md: { padding: 16, gap: 10, borderRadius: 8, titleFontSize: 16, titleLineHeight: 24, messageFontSize: 14, messageLineHeight: 20, iconSize: 24, closeIconSize: 16 },
            },
            breadcrumb: {
                sm: { fontSize: 12, lineHeight: 16, iconSize: 14 },
                md: { fontSize: 14, lineHeight: 20, iconSize: 16 },
            },
            list: {
                sm: { paddingVertical: 4, paddingHorizontal: 8, minHeight: 32, iconSize: 16, labelFontSize: 14, labelLineHeight: 20 },
                md: { paddingVertical: 4, paddingHorizontal: 12, minHeight: 44, iconSize: 20, labelFontSize: 16, labelLineHeight: 24 },
            },
            menu: {
                sm: { paddingVertical: 4, paddingHorizontal: 8, iconSize: 16, labelFontSize: 14 },
                md: { paddingVertical: 8, paddingHorizontal: 16, iconSize: 20, labelFontSize: 16 },
            },
            text: {
                sm: { fontSize: 14, lineHeight: 21 },
                md: { fontSize: 16, lineHeight: 24 },
            },
            tabBar: {
                sm: { fontSize: 14, lineHeight: 20, padding: 8 },
                md: { fontSize: 16, lineHeight: 24, padding: 12 },
            },
            table: {
                sm: { padding: 8, fontSize: 13, lineHeight: 18 },
                md: { padding: 16, fontSize: 14, lineHeight: 20 },
            },
            tooltip: {
                sm: { fontSize: 12, padding: 6 },
                md: { fontSize: 14, padding: 8 },
            },
            view: {
                sm: { padding: 8, spacing: 8 },
                md: { padding: 16, spacing: 16 },
            },
            typography: {
                h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
                h2: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
                h3: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const },
                h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
                h5: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
                h6: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
                subtitle1: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
                subtitle2: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
                body1: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
                body2: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
                caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
            },
        })
        .setInteraction({
            focusedBackground: 'rgba(59, 130, 246, 0.08)',
            focusBorder: 'rgba(59, 130, 246, 0.3)',
            opacity: { hover: 0.9, active: 0.75, disabled: 0.5 },
        })
        .setBreakpoints({ xs: 0, sm: 576, md: 768 })
        .build();
}

// =============================================================================
// applyFontScale tests
// =============================================================================

describe('applyFontScale', () => {
    const theme = buildTestTheme();

    it('should be a no-op at scale 1.0', () => {
        const scaled = applyFontScale(theme, 1.0);

        expect(scaled.sizes.button.md.fontSize).toBe(16);
        expect(scaled.sizes.button.md.lineHeight).toBe(24);
        expect(scaled.sizes.button.md.iconSize).toBe(16);
        expect(scaled.sizes.button.md.paddingVertical).toBe(8);
        expect(scaled.sizes.typography.h1.fontSize).toBe(32);
    });

    it('should scale font properties correctly', () => {
        const scaled = applyFontScale(theme, 1.5);

        expect(scaled.sizes.button.md.fontSize).toBe(24);    // 16 * 1.5
        expect(scaled.sizes.button.md.lineHeight).toBe(36);   // 24 * 1.5
        expect(scaled.sizes.text.md.fontSize).toBe(24);       // 16 * 1.5
        expect(scaled.sizes.text.md.lineHeight).toBe(36);     // 24 * 1.5
        expect(scaled.sizes.input.md.fontSize).toBe(24);      // 16 * 1.5
        expect(scaled.sizes.textarea.md.fontSize).toBe(24);   // 16 * 1.5
        expect(scaled.sizes.textarea.md.lineHeight).toBe(36); // 24 * 1.5
    });

    it('should scale icon properties when scaleIcons is true (default)', () => {
        const scaled = applyFontScale(theme, 1.5);

        expect(scaled.sizes.button.md.iconSize).toBe(24);     // 16 * 1.5
        expect(scaled.sizes.input.md.iconSize).toBe(30);      // 20 * 1.5
        expect(scaled.sizes.accordion.md.iconSize).toBe(30);  // 20 * 1.5
        expect(scaled.sizes.alert.md.iconSize).toBe(36);      // 24 * 1.5
        expect(scaled.sizes.alert.md.closeIconSize).toBe(24); // 16 * 1.5
        expect(scaled.sizes.slider.md.thumbIconSize).toBe(18);// 12 * 1.5
        expect(scaled.sizes.switch.md.thumbIconSize).toBe(18);// 12 * 1.5
    });

    it('should NOT scale icon properties when scaleIcons is false', () => {
        const scaled = applyFontScale(theme, 1.5, { scaleIcons: false });

        expect(scaled.sizes.button.md.iconSize).toBe(16);     // unchanged
        expect(scaled.sizes.input.md.iconSize).toBe(20);      // unchanged
        expect(scaled.sizes.alert.md.closeIconSize).toBe(16); // unchanged

        // Font properties should still scale
        expect(scaled.sizes.button.md.fontSize).toBe(24);     // 16 * 1.5
    });

    it('should scale icon component width/height when scaleIcons is true', () => {
        const scaled = applyFontScale(theme, 1.5);

        expect(scaled.sizes.icon.md.width).toBe(36);    // 24 * 1.5
        expect(scaled.sizes.icon.md.height).toBe(36);   // 24 * 1.5
        expect(scaled.sizes.icon.md.fontSize).toBe(36);  // 24 * 1.5
    });

    it('should NOT scale icon component width/height when scaleIcons is false', () => {
        const scaled = applyFontScale(theme, 1.5, { scaleIcons: false });

        expect(scaled.sizes.icon.md.width).toBe(24);    // unchanged
        expect(scaled.sizes.icon.md.height).toBe(24);   // unchanged
        expect(scaled.sizes.icon.md.fontSize).toBe(36);  // fontSize always scales
    });

    it('should NOT scale layout properties', () => {
        const scaled = applyFontScale(theme, 2.0);

        // Button layout
        expect(scaled.sizes.button.md.paddingVertical).toBe(8);
        expect(scaled.sizes.button.md.paddingHorizontal).toBe(16);
        expect(scaled.sizes.button.md.minHeight).toBe(40);

        // Input layout
        expect(scaled.sizes.input.md.height).toBe(44);
        expect(scaled.sizes.input.md.paddingHorizontal).toBe(12);
        expect(scaled.sizes.input.md.iconMargin).toBe(6);

        // Chip layout
        expect(scaled.sizes.chip.md.paddingVertical).toBe(2);
        expect(scaled.sizes.chip.md.paddingHorizontal).toBe(10);
        expect(scaled.sizes.chip.md.minHeight).toBe(24);
        expect(scaled.sizes.chip.md.borderRadius).toBe(999);

        // Badge layout
        expect(scaled.sizes.badge.md.minWidth).toBe(20);
        expect(scaled.sizes.badge.md.height).toBe(20);
        expect(scaled.sizes.badge.md.paddingHorizontal).toBe(6);

        // RadioButton layout
        expect(scaled.sizes.radioButton.md.radioSize).toBe(18);
        expect(scaled.sizes.radioButton.md.radioDotSize).toBe(12);
        expect(scaled.sizes.radioButton.md.gap).toBe(8);

        // Switch layout
        expect(scaled.sizes.switch.md.trackWidth).toBe(44);
        expect(scaled.sizes.switch.md.trackHeight).toBe(24);
        expect(scaled.sizes.switch.md.thumbSize).toBe(20);
        expect(scaled.sizes.switch.md.translateX).toBe(20);

        // Slider layout
        expect(scaled.sizes.slider.md.trackHeight).toBe(6);
        expect(scaled.sizes.slider.md.thumbSize).toBe(20);
        expect(scaled.sizes.slider.md.markHeight).toBe(10);

        // ActivityIndicator layout
        expect(scaled.sizes.activityIndicator.md.size).toBe(36);
        expect(scaled.sizes.activityIndicator.md.borderWidth).toBe(3);

        // IconButton layout
        expect(scaled.sizes.iconButton.md.size).toBe(40);

        // Avatar layout (width/height are layout, not icon)
        expect(scaled.sizes.avatar.md.width).toBe(40);
        expect(scaled.sizes.avatar.md.height).toBe(40);

        // Progress layout
        expect(scaled.sizes.progress.md.linearHeight).toBe(8);
        expect(scaled.sizes.progress.md.circularSize).toBe(48);

        // Alert layout
        expect(scaled.sizes.alert.md.padding).toBe(16);
        expect(scaled.sizes.alert.md.gap).toBe(10);
        expect(scaled.sizes.alert.md.borderRadius).toBe(8);

        // View layout
        expect(scaled.sizes.view.md.padding).toBe(16);
        expect(scaled.sizes.view.md.spacing).toBe(16);

        // Textarea layout
        expect(scaled.sizes.textarea.md.padding).toBe(12);
        expect(scaled.sizes.textarea.md.minHeight).toBe(100);

        // TabBar layout
        expect(scaled.sizes.tabBar.md.padding).toBe(12);

        // Table layout
        expect(scaled.sizes.table.md.padding).toBe(16);

        // Tooltip layout
        expect(scaled.sizes.tooltip.md.padding).toBe(8);

        // List layout
        expect(scaled.sizes.list.md.paddingVertical).toBe(4);
        expect(scaled.sizes.list.md.paddingHorizontal).toBe(12);
        expect(scaled.sizes.list.md.minHeight).toBe(44);

        // Menu layout
        expect(scaled.sizes.menu.md.paddingVertical).toBe(8);
        expect(scaled.sizes.menu.md.paddingHorizontal).toBe(16);

        // Accordion layout
        expect(scaled.sizes.accordion.md.headerPadding).toBe(16);
        expect(scaled.sizes.accordion.md.contentPadding).toBe(16);

        // Select layout
        expect(scaled.sizes.select.md.paddingHorizontal).toBe(12);
        expect(scaled.sizes.select.md.minHeight).toBe(44);
        expect(scaled.sizes.select.md.borderRadius).toBe(4);
    });

    it('should scale typography fontSize/lineHeight but not fontWeight', () => {
        const scaled = applyFontScale(theme, 1.5);

        expect(scaled.sizes.typography.h1.fontSize).toBe(48);     // 32 * 1.5
        expect(scaled.sizes.typography.h1.lineHeight).toBe(60);   // 40 * 1.5
        expect(scaled.sizes.typography.h1.fontWeight).toBe('700'); // unchanged

        expect(scaled.sizes.typography.body1.fontSize).toBe(24);   // 16 * 1.5
        expect(scaled.sizes.typography.body1.lineHeight).toBe(36); // 24 * 1.5
        expect(scaled.sizes.typography.body1.fontWeight).toBe('400');

        expect(scaled.sizes.typography.caption.fontSize).toBe(18);  // 12 * 1.5
        expect(scaled.sizes.typography.caption.lineHeight).toBe(24);// 16 * 1.5
    });

    it('should scale all font-variant properties', () => {
        const scaled = applyFontScale(theme, 2.0);

        // headerFontSize (accordion)
        expect(scaled.sizes.accordion.md.headerFontSize).toBe(32); // 16 * 2

        // labelFontSize (slider, progress, list, menu)
        expect(scaled.sizes.slider.md.labelFontSize).toBe(24);     // 12 * 2
        expect(scaled.sizes.progress.md.labelFontSize).toBe(28);   // 14 * 2
        expect(scaled.sizes.list.md.labelFontSize).toBe(32);       // 16 * 2
        expect(scaled.sizes.menu.md.labelFontSize).toBe(32);       // 16 * 2

        // labelLineHeight (list)
        expect(scaled.sizes.list.md.labelLineHeight).toBe(48);     // 24 * 2

        // titleFontSize/titleLineHeight (alert)
        expect(scaled.sizes.alert.md.titleFontSize).toBe(32);      // 16 * 2
        expect(scaled.sizes.alert.md.titleLineHeight).toBe(48);    // 24 * 2

        // messageFontSize/messageLineHeight (alert)
        expect(scaled.sizes.alert.md.messageFontSize).toBe(28);    // 14 * 2
        expect(scaled.sizes.alert.md.messageLineHeight).toBe(40);  // 20 * 2

        // circularLabelFontSize (progress)
        expect(scaled.sizes.progress.md.circularLabelFontSize).toBe(24); // 12 * 2
    });

    it('should clamp scale to minScale/maxScale', () => {
        const scaledDown = applyFontScale(theme, 0.1);
        expect(scaledDown.fontScaleConfig?.fontScale).toBe(0.5);

        const scaledUp = applyFontScale(theme, 10);
        expect(scaledUp.fontScaleConfig?.fontScale).toBe(3.0);
    });

    it('should respect custom minScale/maxScale', () => {
        const scaled = applyFontScale(theme, 0.6, { minScale: 0.8 });
        expect(scaled.fontScaleConfig?.fontScale).toBe(0.8);

        const scaledUp = applyFontScale(theme, 5, { maxScale: 2.0 });
        expect(scaledUp.fontScaleConfig?.fontScale).toBe(2.0);
    });

    it('should set fontScaleConfig on the result', () => {
        const scaled = applyFontScale(theme, 1.2, { scaleIcons: false });

        expect(scaled.fontScaleConfig).toEqual({
            fontScale: 1.2,
            scaleIcons: false,
            minScale: 0.5,
            maxScale: 3.0,
        });
    });

    it('should preserve __baseSizes for idempotent rescaling', () => {
        const scaled = applyFontScale(theme, 1.5);

        expect(scaled.__baseSizes).toBeDefined();
        expect(scaled.__baseSizes!.button.md.fontSize).toBe(16); // original
        expect(scaled.sizes.button.md.fontSize).toBe(24);        // scaled
    });

    it('should be idempotent when rescaling', () => {
        const scaled1 = applyFontScale(theme, 1.5);
        const scaled2 = applyFontScale(scaled1, 2.0);
        const direct = applyFontScale(theme, 2.0);

        // Rescaling from 1.5 to 2.0 should produce the same result
        // as scaling from 1.0 to 2.0
        expect(scaled2.sizes.button.md.fontSize).toBe(direct.sizes.button.md.fontSize);
        expect(scaled2.sizes.button.md.lineHeight).toBe(direct.sizes.button.md.lineHeight);
        expect(scaled2.sizes.button.md.iconSize).toBe(direct.sizes.button.md.iconSize);
        expect(scaled2.sizes.typography.h1.fontSize).toBe(direct.sizes.typography.h1.fontSize);

        // Both should compute from base, not previously scaled values
        expect(scaled2.sizes.button.md.fontSize).toBe(32); // 16 * 2.0, NOT 24 * 2.0
    });

    it('should not mutate the original theme', () => {
        const original = buildTestTheme();
        const originalFontSize = original.sizes.button.md.fontSize;

        applyFontScale(original, 2.0);

        expect(original.sizes.button.md.fontSize).toBe(originalFontSize);
        expect(original.fontScaleConfig).toBeUndefined();
        expect(original.__baseSizes).toBeUndefined();
    });

    it('should preserve non-size theme properties', () => {
        const scaled = applyFontScale(theme, 1.5);

        expect(scaled.intents).toBe(theme.intents);
        expect(scaled.radii).toBe(theme.radii);
        expect(scaled.shadows).toBe(theme.shadows);
        expect(scaled.colors).toBe(theme.colors);
        expect(scaled.interaction).toBe(theme.interaction);
        expect(scaled.breakpoints).toBe(theme.breakpoints);
    });
});

// =============================================================================
// applyFontScale with lightTheme (integration)
// =============================================================================

describe('applyFontScale with lightTheme', () => {
    it('should scale the full lightTheme without errors', () => {
        const scaled = applyFontScale(lightTheme, 1.3);

        // Spot check a few values
        expect(scaled.sizes.button.md.fontSize).toBeCloseTo(16 * 1.3);
        expect(scaled.sizes.typography.h1.fontSize).toBeCloseTo(32 * 1.3);
        expect(scaled.sizes.text.md.fontSize).toBeCloseTo(16 * 1.3);
        expect(scaled.fontScaleConfig?.fontScale).toBe(1.3);
    });
});

// =============================================================================
// contentSizeCategoryToScale tests
// =============================================================================

describe('contentSizeCategoryToScale', () => {
    it('should return 1.0 for iOS Large (default)', () => {
        expect(contentSizeCategoryToScale('Large')).toBe(1.0);
    });

    it('should return correct values for iOS categories', () => {
        expect(contentSizeCategoryToScale('xSmall')).toBe(0.82);
        expect(contentSizeCategoryToScale('Small')).toBe(0.88);
        expect(contentSizeCategoryToScale('Medium')).toBe(0.94);
        expect(contentSizeCategoryToScale('xLarge')).toBe(1.12);
        expect(contentSizeCategoryToScale('xxLarge')).toBe(1.24);
        expect(contentSizeCategoryToScale('xxxLarge')).toBe(1.35);
    });

    it('should return correct values for iOS accessibility categories', () => {
        expect(contentSizeCategoryToScale('accessibilityMedium')).toBe(1.6);
        expect(contentSizeCategoryToScale('accessibilityLarge')).toBe(1.9);
        expect(contentSizeCategoryToScale('accessibilityExtraLarge')).toBe(2.35);
        expect(contentSizeCategoryToScale('accessibilityExtraExtraLarge')).toBe(2.75);
        expect(contentSizeCategoryToScale('accessibilityExtraExtraExtraLarge')).toBe(3.1);
    });

    it('should return correct values for Android categories', () => {
        expect(contentSizeCategoryToScale('Default')).toBe(1.0);
        expect(contentSizeCategoryToScale('ExtraLarge')).toBe(1.24);
        expect(contentSizeCategoryToScale('Huge')).toBe(1.35);
        expect(contentSizeCategoryToScale('ExtraHuge')).toBe(1.6);
        expect(contentSizeCategoryToScale('ExtraExtraHuge')).toBe(1.9);
    });

    it('should return 1.0 for web-unspecified', () => {
        expect(contentSizeCategoryToScale('web-unspecified')).toBe(1.0);
    });

    it('should return 1.0 for unspecified', () => {
        expect(contentSizeCategoryToScale('unspecified')).toBe(1.0);
    });

    it('should return 1.0 for unknown categories', () => {
        expect(contentSizeCategoryToScale('unknown')).toBe(1.0);
        expect(contentSizeCategoryToScale('')).toBe(1.0);
        expect(contentSizeCategoryToScale('SuperLarge')).toBe(1.0);
    });
});

// =============================================================================
// ThemeBuilder.setFontScale tests
// =============================================================================

describe('ThemeBuilder.setFontScale', () => {
    it('should scale font sizes when building', () => {
        const theme = createTheme()
            .addIntent('primary', { primary: '#3b82f6', contrast: '#fff', light: '#bfdbfe', dark: '#1e40af' })
            .addRadius('md', 8)
            .addShadow('none', {})
            .setColors({
                pallet: {} as any,
                surface: { screen: '#fff' } as any,
                text: { primary: '#000' } as any,
                border: { primary: '#e0e0e0' } as any,
            })
            .setSizes({
                button: {
                    md: { paddingVertical: 8, paddingHorizontal: 16, minHeight: 40, fontSize: 16, lineHeight: 24, iconSize: 16 },
                },
                iconButton: { md: { size: 40, iconSize: 24 } },
                chip: { md: { paddingVertical: 2, paddingHorizontal: 10, minHeight: 24, borderRadius: 999, fontSize: 12, lineHeight: 16, iconSize: 14 } },
                badge: { md: { minWidth: 20, height: 20, paddingHorizontal: 6, fontSize: 12, lineHeight: 14, iconSize: 12 } },
                icon: { md: { width: 24, height: 24, fontSize: 24 } },
                input: { md: { height: 44, paddingHorizontal: 12, fontSize: 16, iconSize: 20, iconMargin: 6 } },
                radioButton: { md: { radioSize: 18, radioDotSize: 12, fontSize: 16, gap: 8 } },
                select: { md: { paddingHorizontal: 12, minHeight: 44, fontSize: 16, iconSize: 20, borderRadius: 4 } },
                slider: { md: { trackHeight: 6, thumbSize: 20, thumbIconSize: 12, markHeight: 10, labelFontSize: 12 } },
                switch: { md: { trackWidth: 44, trackHeight: 24, thumbSize: 20, thumbIconSize: 12, translateX: 20 } },
                textarea: { md: { fontSize: 16, padding: 12, lineHeight: 24, minHeight: 100 } },
                avatar: { md: { width: 40, height: 40, fontSize: 16 } },
                progress: { md: { linearHeight: 8, circularSize: 48, labelFontSize: 14, circularLabelFontSize: 12 } },
                accordion: { md: { headerPadding: 16, headerFontSize: 16, iconSize: 20, contentPadding: 16 } },
                activityIndicator: { md: { size: 36, borderWidth: 3 } },
                alert: { md: { padding: 16, gap: 10, borderRadius: 8, titleFontSize: 16, titleLineHeight: 24, messageFontSize: 14, messageLineHeight: 20, iconSize: 24, closeIconSize: 16 } },
                breadcrumb: { md: { fontSize: 14, lineHeight: 20, iconSize: 16 } },
                list: { md: { paddingVertical: 4, paddingHorizontal: 12, minHeight: 44, iconSize: 20, labelFontSize: 16, labelLineHeight: 24 } },
                menu: { md: { paddingVertical: 8, paddingHorizontal: 16, iconSize: 20, labelFontSize: 16 } },
                text: { md: { fontSize: 16, lineHeight: 24 } },
                tabBar: { md: { fontSize: 16, lineHeight: 24, padding: 12 } },
                table: { md: { padding: 16, fontSize: 14, lineHeight: 20 } },
                tooltip: { md: { fontSize: 14, padding: 8 } },
                view: { md: { padding: 16, spacing: 16 } },
                typography: {
                    h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
                    h2: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
                    h3: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const },
                    h4: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
                    h5: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
                    h6: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
                    subtitle1: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
                    subtitle2: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
                    body1: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
                    body2: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
                    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
                },
            })
            .setInteraction({
                focusedBackground: 'rgba(59, 130, 246, 0.08)',
                focusBorder: 'rgba(59, 130, 246, 0.3)',
                opacity: { hover: 0.9, active: 0.75, disabled: 0.5 },
            })
            .setBreakpoints({ xs: 0, sm: 576, md: 768 })
            .setFontScale(1.5)
            .build();

        expect(theme.sizes.button.md.fontSize).toBe(24);           // 16 * 1.5
        expect(theme.sizes.button.md.paddingVertical).toBe(8);      // unchanged
        expect(theme.sizes.typography.h1.fontSize).toBe(48);        // 32 * 1.5
        expect(theme.fontScaleConfig?.fontScale).toBe(1.5);
        expect(theme.__baseSizes?.button.md.fontSize).toBe(16);     // original preserved
    });

    it('should produce no fontScaleConfig when setFontScale is not called', () => {
        const theme = createTheme()
            .addIntent('primary', { primary: '#3b82f6', contrast: '#fff', light: '#bfdbfe', dark: '#1e40af' })
            .build();

        expect(theme.fontScaleConfig).toBeUndefined();
        expect(theme.__baseSizes).toBeUndefined();
    });

    it('should be a no-op at scale 1.0 via builder', () => {
        const unscaled = buildTestTheme();
        const theme = fromTheme(unscaled)
            .setFontScale(1.0)
            .build();

        expect(theme.sizes.button.md.fontSize).toBe(16);
        expect(theme.fontScaleConfig?.fontScale).toBe(1.0);
    });

    it('should survive chaining after setFontScale (mid-chain usage)', () => {
        const theme = fromTheme(lightTheme)
            .setFontScale(1.5)
            .addSurfaceColor('highlight', '#FF0000')
            .addRadius('2xl', 24)
            .build();

        // Font scale should still be applied even though other methods were called after it
        expect(theme.sizes.button.md.fontSize).toBe(24);           // 16 * 1.5
        expect(theme.sizes.typography.h1.fontSize).toBe(48);        // 32 * 1.5
        expect(theme.fontScaleConfig?.fontScale).toBe(1.5);
        // Other additions should still be present
        expect(theme.colors.surface.highlight).toBe('#FF0000');
        expect(theme.radii['2xl']).toBe(24);
    });
});

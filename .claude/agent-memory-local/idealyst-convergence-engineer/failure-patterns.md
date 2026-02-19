# Detailed Failure Patterns

## 1. View Shorthand Props (HIGH IMPACT - affects many scenarios)
**Pattern**: Agents use `<View direction="row" align="center" justify="space-between">`
**Root Cause**: Guide examples previously used these non-existent shorthand props
**Fix Applied**: Changed all guide examples to `style={{ flexDirection: 'row', alignItems: 'center' }}`
**Files Fixed**: audio-guides.ts, camera-guides.ts, files-guides.ts, lottie-guides.ts, datagrid-guides.ts
**Impact**: Causes TS compilation errors in every scenario that needs row layouts

## 2. Button icon Prop (MEDIUM IMPACT)
**Pattern**: `<Button icon="check">` instead of `<Button leftIcon="check">`
**Root Cause**: Icon guide examples showed `icon=` on Button
**Fix Applied**: Changed icon-guide.ts examples to use `leftIcon`; added to intro.ts common mistakes
**Files Fixed**: icon-guide.ts, intro.ts

## 3. Animate Hook Hallucination (HIGH IMPACT for animate scenario)
**Pattern**: Agents import `useSequence`, `useKeyframes`, `useSpring` which don't exist
**Root Cause**: Generic hook names that agents assume exist in any animation library
**Fix Applied**: Added "COMPLETE LIST" with exact count (5 exports); added explicit "does NOT exist" warnings
**Files Fixed**: animate-guides.ts

## 4. Easing String Format (MEDIUM IMPACT)
**Pattern**: `easing: 'ease-out'` instead of `easing: 'easeOut'`
**Root Cause**: CSS convention vs camelCase convention
**Fix Applied**: Added valid vs invalid comparison table in animate-guides.ts

## 5. ChartDataSeries label (HIGH IMPACT for charts scenario)
**Pattern**: `{ data: [...], label: 'Revenue' }` instead of `{ data: [...], name: 'Revenue' }`
**Root Cause**: DataPoint has `label` but ChartDataSeries uses `name` - easy confusion
**Fix Applied**: Added explicit "NO label property" warning
**Files Fixed**: charts-guides.ts

## 6. IconName Type (MEDIUM IMPACT)
**Pattern**: `function getIcon(s: string): string { return 'check'; }` - returns string not IconName
**Fix Applied**: Added TypeScript Type section to icon-guide.ts; usage note in search_icons handler

## 7. Text variant Prop (LOW IMPACT)
**Pattern**: `<Text variant="title">` - Text has no variant prop
**Fix Applied**: Changed to `<Text typography="h6" weight="bold">`
**Files Fixed**: navigation-guides.ts

## 8. useRef() Missing Initial Argument (HIGH IMPACT - React 19)
**Pattern**: `useRef<T>()` instead of `useRef<T>(null)` — causes TS2554
**Root Cause**: React 19 strict TypeScript requires initial argument
**Fix Applied**: Fixed examples in animate-guides.ts, lottie-guides.ts; added section to intro.ts
**Impact**: Caused failures in animate-transitions, full-app-no-context

## 9. View onPress (MEDIUM IMPACT)
**Pattern**: `<View onPress={handler}>` — View has no onPress prop
**Root Cause**: Agents expect View to be pressable like in some RN patterns
**Fix Applied**: Strengthened warning in intro.ts #4; documented Pressable as alternative
**Impact**: Caused TS failures in full-app-no-context

## 10. Card.Content Compound Components (HIGH IMPACT for navigation)
**Pattern**: `<Card.Content>`, `<Card.Header>`, `<Card.Body>` — don't exist
**Root Cause**: Common React UI library pattern (MUI, etc.) that agents assume
**Fix Applied**: Added warning to Card metadata, intro.ts #11
**Impact**: Caused 6 TS errors in navigation scenario

## 11. Navigation Types Returning Empty (HIGH IMPACT)
**Pattern**: `get_navigation_types` returns empty content
**Root Cause**: Dynamic type generation skips navigation (requires ts-morph)
**Fix Applied**: Added static hardcoded navigation types as fallback in get-types.ts
**Impact**: Agent couldn't verify navigation API, guessed wrong

## 12. Size Type Bug (MEDIUM IMPACT)
**Pattern**: Theme Size type shows '0'|'1'|'2'|'3'|'4' instead of 'xs'|'sm'|'md'|'lg'|'xl'
**Root Cause**: `Object.keys(array)` returns array indices, not values
**Fix Applied**: Changed to read array values directly in get-types.ts
**Impact**: Confusing type information for all components with size prop

## 13. Expand/Collapse Animation (MEDIUM IMPACT)
**Pattern**: `{expanded && <View style={animStyle}>...}` defeats animation
**Root Cause**: No example showing the correct pattern
**Fix Applied**: Added expand/collapse example to animate-guides.ts examples section

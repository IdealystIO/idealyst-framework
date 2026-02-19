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
**Files Fixed**: animate-guides.ts, animate-transitions scenario

## 4. Easing String Format (MEDIUM IMPACT)
**Pattern**: `easing: 'ease-out'` instead of `easing: 'easeOut'`
**Root Cause**: CSS convention vs camelCase convention
**Fix Applied**: Added valid vs invalid comparison table in animate-guides.ts
**Files Fixed**: animate-guides.ts

## 5. ChartDataSeries label (HIGH IMPACT for charts scenario)
**Pattern**: `{ data: [...], label: 'Revenue' }` instead of `{ data: [...], name: 'Revenue' }`
**Root Cause**: DataPoint has `label` but ChartDataSeries uses `name` - easy confusion
**Fix Applied**: Added explicit "NO label property" warning; distinguished DataPoint.label from series.name
**Files Fixed**: charts-guides.ts

## 6. IconName Type (MEDIUM IMPACT)
**Pattern**: `function getIcon(s: string): string { return 'check'; }` - returns string not IconName
**Root Cause**: Agents don't know about the IconName type union
**Fix Applied**: Added TypeScript Type section to icon-guide.ts; added usage note in search_icons handler
**Files Fixed**: icon-guide.ts, handlers.ts

## 7. Text variant Prop (LOW IMPACT)
**Pattern**: `<Text variant="title">` - Text has no variant prop
**Root Cause**: Navigation guide examples used it
**Fix Applied**: Changed to `<Text typography="h6" weight="bold">`
**Files Fixed**: navigation-guides.ts

## 8. Markdown Web Resolution (FRAMEWORK BUG - not doc issue)
**Pattern**: TS2305 "Module '@idealyst/markdown' has no exported member 'Markdown'"
**Root Cause**: The eval workspace may not resolve .web.ts exports correctly
**Status**: Not fixed - framework-level .web extension resolution issue
**Workaround**: None found yet; the import `{ Markdown }` matches the actual index.ts export

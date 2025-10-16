/**
 * Test cases for the enhanced MDI auto-import babel plugin
 *
 * These examples demonstrate how the plugin handles different scenarios:
 * 1. Direct string literals in Icon components
 * 2. Variables with icon names
 * 3. Namespace prefixes (mdi:iconname)
 * 4. Conditional expressions
 * 5. Common words that should NOT be transformed
 */

import React from 'react';
import { Icon } from '@idealyst/components';

export function TestCases() {
  // Case 1: Direct string literal - SHOULD transform
  const case1 = <Icon name="home" size="md" />;

  // Case 2: Variable with icon name - SHOULD transform (context-aware)
  const iconName = "account";
  const case2 = <Icon name={iconName} size="md" />;

  // Case 3: Namespace prefix - SHOULD ALWAYS transform
  const explicitIcon = "mdi:star";
  const case3 = <Icon name={explicitIcon} size="md" />;

  // Case 4: Direct namespace in JSX - SHOULD transform
  const case4 = <Icon name="mdi:heart" size="md" />;

  // Case 5: Conditional expression - SHOULD transform both
  const isActive = true;
  const case5 = <Icon name={isActive ? "check" : "close"} size="md" />;

  // Case 6: Common word NOT used with Icon - should NOT transform
  const pageName = "home";  // This is just a page name, not an icon
  const case6 = <div>{pageName}</div>;

  // Case 7: Common word in unrelated variable - should NOT transform
  const title = "account";  // Not used with Icon
  const case7 = <h1>{title}</h1>;

  // Case 8: Variable from manifest (if manifest includes "folder")
  const directoryIcon = "folder";
  const case8 = <Icon name={directoryIcon} size="md" />;

  // Case 9: Function that returns icon name - currently won't transform without manifest
  function getIcon() {
    return "file";
  }
  const case9 = <Icon name={getIcon()} size="md" />;  // Won't transform unless "file" is in manifest

  // Case 10: Complex expression with namespace prefix - SHOULD transform
  const showDetails = false;
  const case10 = <Icon name={showDetails ? "mdi:chevron-down" : "mdi:chevron-right"} size="md" />;

  // Case 11: Template literal (static) - SHOULD transform
  const case11 = <Icon name={`home`} size="md" />;

  // Case 12: Logical expression - SHOULD transform
  const hasError = true;
  const case12 = <Icon name={hasError && "alert"} size="md" />;

  return (
    <div>
      <h2>Icon Transform Test Cases</h2>
      <div>Case 1 (direct literal): {case1}</div>
      <div>Case 2 (variable): {case2}</div>
      <div>Case 3 (namespace variable): {case3}</div>
      <div>Case 4 (namespace direct): {case4}</div>
      <div>Case 5 (conditional): {case5}</div>
      <div>Case 6 (non-icon string): {case6}</div>
      <div>Case 7 (unrelated variable): {case7}</div>
      <div>Case 8 (manifest icon): {case8}</div>
      <div>Case 9 (function call): {case9}</div>
      <div>Case 10 (complex with namespace): {case10}</div>
      <div>Case 11 (template literal): {case11}</div>
      <div>Case 12 (logical expression): {case12}</div>
    </div>
  );
}

/**
 * Expected transformations after babel plugin runs:
 *
 * - case1: "home" -> path={_mdiHome}
 * - case2: "account" -> path={_mdiAccount} (because iconName is used with Icon)
 * - case3: "mdi:star" -> path={_mdiStar} (namespace prefix)
 * - case4: "mdi:heart" -> path={_mdiHeart} (namespace prefix)
 * - case5: Both "check" and "close" imported, component not transformed (multiple icons)
 * - case6: "home" NOT transformed (not used with Icon)
 * - case7: "account" NOT transformed (not used with Icon)
 * - case8: "folder" -> path={_mdiFolder} (if in manifest)
 * - case9: No transform unless "file" is in manifest
 * - case10: Both chevron icons imported and transformed (namespace prefix)
 * - case11: "home" -> path={_mdiHome} (static template literal)
 * - case12: "alert" imported (but component might not transform due to logical expression)
 *
 * Expected imports at top of file:
 * import MdiIcon from '@mdi/react';
 * import {
 *   mdiHome as _mdiHome,
 *   mdiAccount as _mdiAccount,
 *   mdiStar as _mdiStar,
 *   mdiHeart as _mdiHeart,
 *   mdiCheck as _mdiCheck,
 *   mdiClose as _mdiClose,
 *   mdiFolder as _mdiFolder,  // if in manifest
 *   mdiChevronDown as _mdiChevronDown,
 *   mdiChevronRight as _mdiChevronRight,
 *   mdiAlert as _mdiAlert
 * } from '@mdi/js';
 */

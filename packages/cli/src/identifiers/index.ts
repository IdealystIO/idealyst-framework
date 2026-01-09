/**
 * Mobile identifier generation
 */

import { generateIosBundleId, validateIosBundleId } from './ios';
import { generateAndroidPackageName, validateAndroidPackageName } from './android';

export interface MobileIdentifiers {
  iosBundleId: string;
  androidPackageName: string;
}

/**
 * Generate iOS and Android identifiers from org domain and project name
 *
 * @param orgDomain - Organization domain (e.g., "com.company")
 * @param projectName - Project name in kebab-case
 * @returns Generated identifiers for both platforms
 *
 * @example
 * generateIdentifiers('com.mycompany', 'awesome-app')
 * // Returns:
 * // {
 * //   iosBundleId: 'com.mycompany.awesome-app',
 * //   androidPackageName: 'com.mycompany.awesomeapp'
 * // }
 */
export function generateIdentifiers(
  orgDomain: string,
  projectName: string
): MobileIdentifiers {
  return {
    iosBundleId: generateIosBundleId(orgDomain, projectName),
    androidPackageName: generateAndroidPackageName(orgDomain, projectName),
  };
}

export {
  generateIosBundleId,
  validateIosBundleId,
  generateAndroidPackageName,
  validateAndroidPackageName,
};

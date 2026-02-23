/**
 * Live Activity extension generator
 *
 * Scaffolds iOS Widget Extension and Android configuration
 * for @idealyst/live-activity integration.
 */

import path from 'path';
import fs from 'fs-extra';
import { TemplateData, PackageGeneratorResult } from '../../types';
import { logger } from '../../utils/logger';

export interface LiveActivityConfig {
  /** Name of the custom activity (PascalCase). */
  name: string;
  /** Base template to extend (optional). */
  templateBase?: 'delivery' | 'timer' | 'media' | 'progress';
  /** Enable push update support. */
  withPushUpdates?: boolean;
}

/**
 * Apply Live Activity extension to a mobile project.
 * Scaffolds the iOS Widget Extension and Android configuration.
 */
export async function applyLiveActivityExtension(
  workspaceRoot: string,
  data: TemplateData,
  config: LiveActivityConfig
): Promise<PackageGeneratorResult> {
  logger.info('Setting up Live Activity support...');

  const mobileDir = path.join(workspaceRoot, 'packages', 'mobile');
  const iosDir = path.join(mobileDir, 'ios');
  const androidDir = path.join(mobileDir, 'android');

  // Verify mobile project exists
  if (!await fs.pathExists(mobileDir)) {
    return {
      success: false,
      warning: 'No mobile project found. Run "idealyst add mobile" first.',
    };
  }

  const warnings: string[] = [];

  // 1. Create iOS Widget Extension
  if (await fs.pathExists(iosDir)) {
    await createIosWidgetExtension(iosDir, data, config);
    logger.success('Created iOS Widget Extension');
  } else {
    warnings.push('iOS directory not found — skipping Widget Extension scaffolding');
  }

  // 2. Configure Android
  if (await fs.pathExists(androidDir)) {
    await configureAndroid(androidDir, data);
    logger.success('Configured Android Live Updates');
  } else {
    warnings.push('Android directory not found — skipping Android configuration');
  }

  // 3. Generate TypeScript interface
  await generateTypeScriptInterface(mobileDir, config);
  logger.success(`Created src/activities/${toCamelCase(config.name)}.ts`);

  return {
    success: true,
    warning: warnings.length > 0 ? warnings.join('; ') : undefined,
  };
}

// ============================================================================
// iOS Widget Extension
// ============================================================================

async function createIosWidgetExtension(
  iosDir: string,
  data: TemplateData,
  config: LiveActivityConfig
): Promise<void> {
  const extensionDirName = `${data.appDisplayName.replace(/\s+/g, '')}LiveActivity`;
  const extensionDir = path.join(iosDir, extensionDirName);

  await fs.ensureDir(extensionDir);

  // Generate ActivityAttributes
  await fs.writeFile(
    path.join(extensionDir, `${config.name}Attributes.swift`),
    generateAttributesSwift(config),
  );

  // Generate ActivityView
  await fs.writeFile(
    path.join(extensionDir, `${config.name}ActivityView.swift`),
    generateActivityViewSwift(config),
  );

  // Generate Widget Bundle
  await fs.writeFile(
    path.join(extensionDir, `${config.name}Bundle.swift`),
    generateBundleSwift(config),
  );

  // Generate Info.plist for extension
  await fs.writeFile(
    path.join(extensionDir, 'Info.plist'),
    generateExtensionInfoPlist(),
  );

  // Update main app Info.plist
  await enableLiveActivitiesInPlist(iosDir, data);
}

function generateAttributesSwift(config: LiveActivityConfig): string {
  return `import ActivityKit
import Foundation

struct ${config.name}Attributes: ActivityAttributes {
  struct ContentState: Codable, Hashable {
    // TODO: Define your dynamic content state here.
    // These values can be updated while the activity is running.
    var status: String
    var progress: Double
    var subtitle: String?
  }

  // TODO: Define your static attributes here.
  // These values are set when the activity starts and cannot change.
  var title: String
  var accentColor: String?
}
`;
}

function generateActivityViewSwift(config: LiveActivityConfig): string {
  return `import SwiftUI
import WidgetKit
import ActivityKit

@available(iOS 16.2, *)
struct ${config.name}ActivityView: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: ${config.name}Attributes.self) { context in
      // Lock screen / StandBy presentation
      VStack(spacing: 12) {
        HStack {
          Text(context.attributes.title)
            .font(.headline)
          Spacer()
          Text("\\(Int(context.state.progress * 100))%")
            .font(.title2)
            .bold()
            .monospacedDigit()
        }

        ProgressView(value: context.state.progress)
          .tint(.blue)

        Text(context.state.status)
          .font(.subheadline)
          .foregroundStyle(.secondary)
          .frame(maxWidth: .infinity, alignment: .leading)
      }
      .padding()
      .background(.ultraThinMaterial)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Text(context.attributes.title)
            .font(.caption)
            .lineLimit(1)
        }

        DynamicIslandExpandedRegion(.trailing) {
          Text("\\(Int(context.state.progress * 100))%")
            .font(.caption)
            .bold()
            .monospacedDigit()
        }

        DynamicIslandExpandedRegion(.center) {
          Text(context.state.status)
            .font(.headline)
            .lineLimit(1)
        }

        DynamicIslandExpandedRegion(.bottom) {
          ProgressView(value: context.state.progress)
            .tint(.blue)
            .padding(.top, 4)
        }
      } compactLeading: {
        Image(systemName: "bolt.fill")
          .foregroundColor(.blue)
      } compactTrailing: {
        Text("\\(Int(context.state.progress * 100))%")
          .font(.caption)
          .monospacedDigit()
      } minimal: {
        Image(systemName: "bolt.fill")
          .foregroundColor(.blue)
      }
    }
  }
}
`;
}

function generateBundleSwift(config: LiveActivityConfig): string {
  return `import SwiftUI
import WidgetKit

@available(iOS 16.2, *)
@main
struct ${config.name}Bundle: WidgetBundle {
  var body: some Widget {
    ${config.name}ActivityView()
  }
}
`;
}

function generateExtensionInfoPlist(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>$(DEVELOPMENT_LANGUAGE)</string>
  <key>CFBundleDisplayName</key>
  <string>$(PRODUCT_NAME)</string>
  <key>CFBundleExecutable</key>
  <string>$(EXECUTABLE_NAME)</string>
  <key>CFBundleIdentifier</key>
  <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>$(PRODUCT_NAME)</string>
  <key>CFBundlePackageType</key>
  <string>$(PRODUCT_TYPE)</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>NSExtension</key>
  <dict>
    <key>NSExtensionPointIdentifier</key>
    <string>com.apple.widgetkit-extension</string>
  </dict>
</dict>
</plist>
`;
}

async function enableLiveActivitiesInPlist(
  iosDir: string,
  data: TemplateData
): Promise<void> {
  // Find the app's Info.plist
  const appName = data.appDisplayName.replace(/\s+/g, '');
  const possiblePaths = [
    path.join(iosDir, appName, 'Info.plist'),
    path.join(iosDir, 'mobile', 'Info.plist'),
  ];

  for (const plistPath of possiblePaths) {
    if (await fs.pathExists(plistPath)) {
      let content = await fs.readFile(plistPath, 'utf8');

      if (!content.includes('NSSupportsLiveActivities')) {
        content = content.replace(
          /<\/dict>\s*<\/plist>/,
          `\t<key>NSSupportsLiveActivities</key>
\t<true/>
\t<key>NSSupportsLiveActivitiesFrequentUpdates</key>
\t<true/>
</dict>
</plist>`,
        );
        await fs.writeFile(plistPath, content);
      }
      break;
    }
  }
}

// ============================================================================
// Android Configuration
// ============================================================================

async function configureAndroid(
  androidDir: string,
  data: TemplateData
): Promise<void> {
  const manifestPath = path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml');

  if (await fs.pathExists(manifestPath)) {
    let content = await fs.readFile(manifestPath, 'utf8');

    // Add POST_NOTIFICATIONS permission if not present
    if (!content.includes('POST_NOTIFICATIONS')) {
      content = content.replace(
        '<application',
        '    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n    <uses-permission android:name="android.permission.POST_PROMOTED_NOTIFICATIONS" />\n\n    <application',
      );
      await fs.writeFile(manifestPath, content);
    }
  }
}

// ============================================================================
// TypeScript Interface
// ============================================================================

async function generateTypeScriptInterface(
  mobileDir: string,
  config: LiveActivityConfig
): Promise<void> {
  const activitiesDir = path.join(mobileDir, 'src', 'activities');
  await fs.ensureDir(activitiesDir);

  const camelName = toCamelCase(config.name);
  const filePath = path.join(activitiesDir, `${camelName}.ts`);

  await fs.writeFile(filePath, `import type { StartActivityOptions, UpdateActivityOptions } from '@idealyst/live-activity';

// ============================================================================
// ${config.name} Activity Types
// ============================================================================

/** Static attributes — set when the activity starts, cannot change. */
export interface ${config.name}Attributes {
  title: string;
  accentColor?: string;
}

/** Dynamic content state — can be updated while the activity is running. */
export interface ${config.name}ContentState {
  status: string;
  progress: number;
  subtitle?: string;
}

/** Start a ${config.name} activity with type safety. */
export function start${config.name}(
  attributes: ${config.name}Attributes,
  contentState: ${config.name}ContentState,
  options?: Partial<Omit<StartActivityOptions<'custom'>, 'templateType' | 'attributes' | 'contentState'>>,
): StartActivityOptions<'custom'> {
  return {
    templateType: 'custom',
    attributes,
    contentState,
    ...options,
  };
}
`);
}

// ============================================================================
// Helpers
// ============================================================================

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

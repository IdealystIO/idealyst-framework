import SwiftUI
import WidgetKit

/// Widget bundle that registers all Idealyst pre-built Live Activity templates.
/// This is used as the @main entry point for the Widget Extension target.
///
/// When using the CLI generator to scaffold a custom Live Activity,
/// add your custom widget to this bundle.
@available(iOS 16.2, *)
@main
struct IdealystActivityBundle: WidgetBundle {
  var body: some Widget {
    DeliveryActivityView()
    TimerActivityView()
    MediaActivityView()
    ProgressActivityView()
  }
}

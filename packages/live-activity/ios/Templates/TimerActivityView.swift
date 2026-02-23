import SwiftUI
import WidgetKit
import ActivityKit

@available(iOS 16.2, *)
struct TimerActivityView: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: TimerAttributes.self) { context in
      // Lock screen presentation
      TimerLockScreenView(context: context)
        .padding()
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Image(systemName: context.attributes.icon ?? "timer")
            .foregroundColor(accentColorFrom(context.attributes.accentColor))
            .font(.title2)
        }

        DynamicIslandExpandedRegion(.trailing) {
          timerText(for: context)
            .font(.title2)
            .bold()
            .monospacedDigit()
        }

        DynamicIslandExpandedRegion(.center) {
          Text(context.attributes.title)
            .font(.headline)
            .lineLimit(1)
        }

        DynamicIslandExpandedRegion(.bottom) {
          if let subtitle = context.state.subtitle {
            Text(subtitle)
              .font(.caption)
              .foregroundStyle(.secondary)
          }
        }
      } compactLeading: {
        Image(systemName: context.attributes.icon ?? "timer")
          .foregroundColor(accentColorFrom(context.attributes.accentColor))
      } compactTrailing: {
        timerText(for: context)
          .font(.caption)
          .monospacedDigit()
      } minimal: {
        Image(systemName: context.attributes.icon ?? "timer")
          .foregroundColor(accentColorFrom(context.attributes.accentColor))
      }
    }
  }

  @ViewBuilder
  private func timerText(for context: ActivityViewContext<TimerAttributes>) -> some View {
    let endDate = Date(timeIntervalSince1970: context.state.endTime / 1000)
    if context.state.isPaused == true {
      Text(endDate, style: .relative)
    } else {
      Text(timerInterval: Date.now...endDate, countsDown: !(context.attributes.showElapsed ?? false))
    }
  }
}

@available(iOS 16.2, *)
private struct TimerLockScreenView: View {
  let context: ActivityViewContext<TimerAttributes>

  var body: some View {
    VStack(spacing: 12) {
      HStack {
        Image(systemName: context.attributes.icon ?? "timer")
          .foregroundColor(accentColorFrom(context.attributes.accentColor))
          .font(.title2)

        Text(context.attributes.title)
          .font(.headline)

        Spacer()

        let endDate = Date(timeIntervalSince1970: context.state.endTime / 1000)
        if context.state.isPaused == true {
          Text(endDate, style: .relative)
            .font(.title)
            .bold()
            .monospacedDigit()
        } else {
          Text(timerInterval: Date.now...endDate, countsDown: !(context.attributes.showElapsed ?? false))
            .font(.title)
            .bold()
            .monospacedDigit()
        }
      }

      if let subtitle = context.state.subtitle {
        Text(subtitle)
          .font(.subheadline)
          .foregroundStyle(.secondary)
          .frame(maxWidth: .infinity, alignment: .leading)
      }
    }
    .padding()
    .background(.ultraThinMaterial)
  }
}

private func accentColorFrom(_ hex: String?) -> Color {
  guard let hex = hex else { return .blue }
  return Color(hex: hex) ?? .blue
}

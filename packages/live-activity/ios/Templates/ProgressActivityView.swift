import SwiftUI
import WidgetKit
import ActivityKit

@available(iOS 16.2, *)
struct ProgressActivityView: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: ProgressAttributes.self) { context in
      // Lock screen presentation
      ProgressLockScreenView(context: context)
        .padding()
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Image(systemName: context.attributes.icon ?? "arrow.down.circle")
            .foregroundColor(accentColorFrom(context.attributes.accentColor))
            .font(.title2)
        }

        DynamicIslandExpandedRegion(.trailing) {
          if context.state.indeterminate == true {
            ProgressView()
              .progressViewStyle(.circular)
          } else {
            Text("\(Int(context.state.progress * 100))%")
              .font(.title3)
              .bold()
              .monospacedDigit()
          }
        }

        DynamicIslandExpandedRegion(.center) {
          Text(context.state.status)
            .font(.headline)
            .lineLimit(1)
        }

        DynamicIslandExpandedRegion(.bottom) {
          VStack(spacing: 4) {
            if context.state.indeterminate == true {
              ProgressView()
                .progressViewStyle(.linear)
                .tint(accentColorFrom(context.attributes.accentColor))
            } else {
              ProgressView(value: context.state.progress)
                .tint(accentColorFrom(context.attributes.accentColor))
            }

            if let subtitle = context.state.subtitle {
              Text(subtitle)
                .font(.caption2)
                .foregroundStyle(.secondary)
            }
          }
          .padding(.top, 4)
        }
      } compactLeading: {
        ProgressRing(
          progress: context.state.progress,
          color: accentColorFrom(context.attributes.accentColor),
          isIndeterminate: context.state.indeterminate == true
        )
        .frame(width: 20, height: 20)
      } compactTrailing: {
        if context.state.indeterminate == true {
          ProgressView()
            .progressViewStyle(.circular)
            .scaleEffect(0.5)
        } else {
          Text("\(Int(context.state.progress * 100))%")
            .font(.caption)
            .monospacedDigit()
        }
      } minimal: {
        ProgressRing(
          progress: context.state.progress,
          color: accentColorFrom(context.attributes.accentColor),
          isIndeterminate: context.state.indeterminate == true
        )
        .frame(width: 20, height: 20)
      }
    }
  }
}

@available(iOS 16.2, *)
private struct ProgressLockScreenView: View {
  let context: ActivityViewContext<ProgressAttributes>

  var body: some View {
    VStack(spacing: 12) {
      HStack {
        Image(systemName: context.attributes.icon ?? "arrow.down.circle")
          .foregroundColor(accentColorFrom(context.attributes.accentColor))
          .font(.title3)

        VStack(alignment: .leading, spacing: 2) {
          Text(context.attributes.title)
            .font(.headline)
          Text(context.state.status)
            .font(.subheadline)
            .foregroundStyle(.secondary)
        }

        Spacer()

        if context.state.indeterminate != true {
          Text("\(Int(context.state.progress * 100))%")
            .font(.title2)
            .bold()
            .monospacedDigit()
        }
      }

      if context.state.indeterminate == true {
        ProgressView()
          .progressViewStyle(.linear)
          .tint(accentColorFrom(context.attributes.accentColor))
      } else {
        ProgressView(value: context.state.progress)
          .tint(accentColorFrom(context.attributes.accentColor))
      }

      if let subtitle = context.state.subtitle {
        Text(subtitle)
          .font(.caption)
          .foregroundStyle(.secondary)
          .frame(maxWidth: .infinity, alignment: .leading)
      }
    }
    .padding()
    .background(.ultraThinMaterial)
  }
}

// MARK: - Progress Ring (for compact/minimal Dynamic Island)

private struct ProgressRing: View {
  let progress: Double
  let color: Color
  let isIndeterminate: Bool

  var body: some View {
    ZStack {
      Circle()
        .stroke(color.opacity(0.2), lineWidth: 2)
      if isIndeterminate {
        Circle()
          .trim(from: 0, to: 0.3)
          .stroke(color, style: StrokeStyle(lineWidth: 2, lineCap: .round))
      } else {
        Circle()
          .trim(from: 0, to: progress)
          .stroke(color, style: StrokeStyle(lineWidth: 2, lineCap: .round))
          .rotationEffect(.degrees(-90))
      }
    }
  }
}

private func accentColorFrom(_ hex: String?) -> Color {
  guard let hex = hex else { return .blue }
  return Color(hex: hex) ?? .blue
}

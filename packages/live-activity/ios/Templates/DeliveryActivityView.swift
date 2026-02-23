import SwiftUI
import WidgetKit
import ActivityKit

@available(iOS 16.2, *)
struct DeliveryActivityView: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: DeliveryAttributes.self) { context in
      // Lock screen presentation
      DeliveryLockScreenView(context: context)
        .padding()
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          VStack(alignment: .leading, spacing: 2) {
            Text(context.attributes.startLabel)
              .font(.caption2)
              .foregroundStyle(.secondary)
            if let driver = context.state.driverName {
              Text(driver)
                .font(.caption)
                .bold()
            }
          }
        }

        DynamicIslandExpandedRegion(.trailing) {
          VStack(alignment: .trailing, spacing: 2) {
            Text(context.attributes.endLabel)
              .font(.caption2)
              .foregroundStyle(.secondary)
            if let etaMs = context.state.eta {
              Text(Date(timeIntervalSince1970: etaMs / 1000), style: .relative)
                .font(.caption)
                .bold()
            }
          }
        }

        DynamicIslandExpandedRegion(.center) {
          Text(context.state.status)
            .font(.headline)
            .lineLimit(1)
        }

        DynamicIslandExpandedRegion(.bottom) {
          ProgressView(value: context.state.progress)
            .tint(accentColorFrom(context.attributes.accentColor))
            .padding(.top, 4)
        }
      } compactLeading: {
        Image(systemName: context.attributes.icon ?? "car.fill")
          .foregroundColor(accentColorFrom(context.attributes.accentColor))
      } compactTrailing: {
        if let etaMs = context.state.eta {
          Text(Date(timeIntervalSince1970: etaMs / 1000), style: .relative)
            .font(.caption)
            .monospacedDigit()
        } else {
          Text("\(Int(context.state.progress * 100))%")
            .font(.caption)
            .monospacedDigit()
        }
      } minimal: {
        Image(systemName: context.attributes.icon ?? "car.fill")
          .foregroundColor(accentColorFrom(context.attributes.accentColor))
      }
    }
  }
}

@available(iOS 16.2, *)
private struct DeliveryLockScreenView: View {
  let context: ActivityViewContext<DeliveryAttributes>

  var body: some View {
    VStack(spacing: 12) {
      HStack {
        VStack(alignment: .leading, spacing: 2) {
          Text(context.state.status)
            .font(.headline)
          if let subtitle = context.state.subtitle {
            Text(subtitle)
              .font(.subheadline)
              .foregroundStyle(.secondary)
          }
        }
        Spacer()
        if let etaMs = context.state.eta {
          VStack(alignment: .trailing, spacing: 2) {
            Text("ETA")
              .font(.caption2)
              .foregroundStyle(.secondary)
            Text(Date(timeIntervalSince1970: etaMs / 1000), style: .relative)
              .font(.subheadline)
              .bold()
              .monospacedDigit()
          }
        }
      }

      VStack(spacing: 4) {
        ProgressView(value: context.state.progress)
          .tint(accentColorFrom(context.attributes.accentColor))

        HStack {
          Text(context.attributes.startLabel)
            .font(.caption2)
            .foregroundStyle(.secondary)
          Spacer()
          Text(context.attributes.endLabel)
            .font(.caption2)
            .foregroundStyle(.secondary)
        }
      }
    }
    .padding()
    .background(.ultraThinMaterial)
  }
}

// MARK: - Helpers

private func accentColorFrom(_ hex: String?) -> Color {
  guard let hex = hex else { return .blue }
  return Color(hex: hex) ?? .blue
}

extension Color {
  init?(hex: String) {
    var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
    hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")

    var rgb: UInt64 = 0
    guard Scanner(string: hexSanitized).scanHexInt64(&rgb) else { return nil }

    let r = Double((rgb & 0xFF0000) >> 16) / 255.0
    let g = Double((rgb & 0x00FF00) >> 8) / 255.0
    let b = Double(rgb & 0x0000FF) / 255.0

    self.init(red: r, green: g, blue: b)
  }
}

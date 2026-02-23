import SwiftUI
import WidgetKit
import ActivityKit

@available(iOS 16.2, *)
struct MediaActivityView: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: MediaAttributes.self) { context in
      // Lock screen presentation
      MediaLockScreenView(context: context)
        .padding()
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          if let artworkUri = context.attributes.artworkUri {
            AsyncImage(url: URL(string: artworkUri)) { image in
              image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
              Image(systemName: "music.note")
            }
            .frame(width: 48, height: 48)
            .clipShape(RoundedRectangle(cornerRadius: 8))
          } else {
            Image(systemName: "music.note")
              .font(.title2)
          }
        }

        DynamicIslandExpandedRegion(.trailing) {
          Image(systemName: context.state.isPlaying ? "pause.fill" : "play.fill")
            .font(.title2)
            .foregroundColor(accentColorFrom(context.attributes.accentColor))
        }

        DynamicIslandExpandedRegion(.center) {
          VStack(spacing: 2) {
            Text(context.state.trackTitle)
              .font(.headline)
              .lineLimit(1)
            if let artist = context.state.artist {
              Text(artist)
                .font(.caption)
                .foregroundStyle(.secondary)
                .lineLimit(1)
            }
          }
        }

        DynamicIslandExpandedRegion(.bottom) {
          if let progress = context.state.progress {
            ProgressView(value: progress)
              .tint(accentColorFrom(context.attributes.accentColor))
              .padding(.top, 4)
          }
        }
      } compactLeading: {
        Image(systemName: context.state.isPlaying ? "music.note" : "pause.fill")
          .foregroundColor(accentColorFrom(context.attributes.accentColor))
      } compactTrailing: {
        Text(context.state.trackTitle)
          .font(.caption)
          .lineLimit(1)
      } minimal: {
        Image(systemName: context.state.isPlaying ? "music.note" : "pause.fill")
          .foregroundColor(accentColorFrom(context.attributes.accentColor))
      }
    }
  }
}

@available(iOS 16.2, *)
private struct MediaLockScreenView: View {
  let context: ActivityViewContext<MediaAttributes>

  var body: some View {
    HStack(spacing: 12) {
      if let artworkUri = context.attributes.artworkUri {
        AsyncImage(url: URL(string: artworkUri)) { image in
          image.resizable().aspectRatio(contentMode: .fill)
        } placeholder: {
          RoundedRectangle(cornerRadius: 8)
            .fill(.quaternary)
            .overlay(
              Image(systemName: "music.note")
                .foregroundStyle(.secondary)
            )
        }
        .frame(width: 56, height: 56)
        .clipShape(RoundedRectangle(cornerRadius: 8))
      }

      VStack(alignment: .leading, spacing: 4) {
        Text(context.state.trackTitle)
          .font(.headline)
          .lineLimit(1)

        if let artist = context.state.artist {
          Text(artist)
            .font(.subheadline)
            .foregroundStyle(.secondary)
            .lineLimit(1)
        }

        if let progress = context.state.progress {
          ProgressView(value: progress)
            .tint(accentColorFrom(context.attributes.accentColor))
        }
      }

      Spacer()

      Image(systemName: context.state.isPlaying ? "pause.circle.fill" : "play.circle.fill")
        .font(.largeTitle)
        .foregroundColor(accentColorFrom(context.attributes.accentColor))
    }
    .padding()
    .background(.ultraThinMaterial)
  }
}

private func accentColorFrom(_ hex: String?) -> Color {
  guard let hex = hex else { return .blue }
  return Color(hex: hex) ?? .blue
}

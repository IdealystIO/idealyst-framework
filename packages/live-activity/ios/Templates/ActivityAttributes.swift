import ActivityKit
import Foundation

// MARK: - Delivery Activity

struct DeliveryAttributes: IdealystActivityAttributes {
  struct ContentState: Codable, Hashable {
    var progress: Double
    var status: String
    var eta: Double?
    var driverName: String?
    var subtitle: String?
  }

  var startLabel: String
  var endLabel: String
  var icon: String?
  var accentColor: String?
}

// MARK: - Timer Activity

struct TimerAttributes: IdealystActivityAttributes {
  struct ContentState: Codable, Hashable {
    var endTime: Double
    var isPaused: Bool?
    var subtitle: String?
  }

  var title: String
  var icon: String?
  var accentColor: String?
  var showElapsed: Bool?
}

// MARK: - Media Activity

struct MediaAttributes: IdealystActivityAttributes {
  struct ContentState: Codable, Hashable {
    var trackTitle: String
    var artist: String?
    var isPlaying: Bool
    var progress: Double?
    var duration: Double?
    var position: Double?
  }

  var title: String
  var artworkUri: String?
  var accentColor: String?
}

// MARK: - Progress Activity

struct ProgressAttributes: IdealystActivityAttributes {
  struct ContentState: Codable, Hashable {
    var progress: Double
    var status: String
    var subtitle: String?
    var indeterminate: Bool?
  }

  var title: String
  var icon: String?
  var accentColor: String?
}

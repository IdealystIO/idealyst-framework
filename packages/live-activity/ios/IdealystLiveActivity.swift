import Foundation
import ActivityKit
import React

@available(iOS 16.2, *)
@objc(IdealystLiveActivity)
class IdealystLiveActivity: RCTEventEmitter {

  private var pushTokenTasks: [String: Task<Void, Never>] = [:]
  private var activityStateTasks: [String: Task<Void, Never>] = [:]

  // MARK: - RCTEventEmitter

  override func supportedEvents() -> [String]! {
    return ["IdealystLiveActivityEvent"]
  }

  override static func requiresMainQueueSetup() -> Bool {
    return false
  }

  // MARK: - Availability

  @objc
  func isSupported() -> Bool {
    if #available(iOS 16.2, *) {
      return ActivityAuthorizationInfo().areActivitiesEnabled
    }
    return false
  }

  @objc
  func isEnabled(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    if #available(iOS 16.2, *) {
      resolve(ActivityAuthorizationInfo().areActivitiesEnabled)
    } else {
      resolve(false)
    }
  }

  // MARK: - Start Activity

  @objc
  func startActivity(
    _ templateType: String,
    attributesJson: String,
    contentStateJson: String,
    optionsJson: String,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      reject("not_supported", "Live Activities require iOS 16.2 or later", nil)
      return
    }

    do {
      let optionsData = optionsJson.data(using: .utf8) ?? Data()
      let options = try JSONSerialization.jsonObject(with: optionsData) as? [String: Any] ?? [:]
      let enablePush = options["enablePushUpdates"] as? Bool ?? false
      let iosOptions = options["ios"] as? [String: Any]
      let relevanceScore = iosOptions?["relevanceScore"] as? Double
      let staleDateMs = iosOptions?["staleDate"] as? Double

      switch templateType {
      case "delivery":
        let result = try startTypedActivity(
          DeliveryAttributes.self,
          attributesJson: attributesJson,
          contentStateJson: contentStateJson,
          enablePush: enablePush,
          relevanceScore: relevanceScore,
          staleDateMs: staleDateMs
        )
        resolve(result)

      case "timer":
        let result = try startTypedActivity(
          TimerAttributes.self,
          attributesJson: attributesJson,
          contentStateJson: contentStateJson,
          enablePush: enablePush,
          relevanceScore: relevanceScore,
          staleDateMs: staleDateMs
        )
        resolve(result)

      case "media":
        let result = try startTypedActivity(
          MediaAttributes.self,
          attributesJson: attributesJson,
          contentStateJson: contentStateJson,
          enablePush: enablePush,
          relevanceScore: relevanceScore,
          staleDateMs: staleDateMs
        )
        resolve(result)

      case "progress":
        let result = try startTypedActivity(
          ProgressAttributes.self,
          attributesJson: attributesJson,
          contentStateJson: contentStateJson,
          enablePush: enablePush,
          relevanceScore: relevanceScore,
          staleDateMs: staleDateMs
        )
        resolve(result)

      default:
        reject("template_not_found", "Unknown template type: \(templateType)", nil)
      }
    } catch {
      reject("start_failed", error.localizedDescription, error)
    }
  }

  @available(iOS 16.2, *)
  private func startTypedActivity<T: IdealystActivityAttributes>(
    _ type: T.Type,
    attributesJson: String,
    contentStateJson: String,
    enablePush: Bool,
    relevanceScore: Double?,
    staleDateMs: Double?
  ) throws -> String {
    let decoder = JSONDecoder()
    let attributesData = attributesJson.data(using: .utf8)!
    let contentData = contentStateJson.data(using: .utf8)!

    let attributes = try decoder.decode(T.self, from: attributesData)
    let contentState = try decoder.decode(T.ContentState.self, from: contentData)

    let initialContent = ActivityContent(
      state: contentState,
      staleDate: staleDateMs.map { Date(timeIntervalSince1970: $0 / 1000) },
      relevanceScore: relevanceScore ?? 0
    )

    let activity = try Activity.request(
      attributes: attributes,
      content: initialContent,
      pushType: enablePush ? .token : nil
    )

    // Observe push token updates
    if enablePush {
      observePushTokenUpdates(for: activity)
    }

    // Observe activity state changes
    observeActivityState(for: activity)

    return activityToJson(activity)
  }

  // MARK: - Update Activity

  @objc
  func updateActivity(
    _ activityId: String,
    contentStateJson: String,
    alertConfigJson: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      reject("not_supported", "Live Activities require iOS 16.2 or later", nil)
      return
    }

    Task {
      do {
        // Try each template type
        if try await updateTypedActivity(DeliveryAttributes.self, activityId: activityId, contentStateJson: contentStateJson, alertConfigJson: alertConfigJson) {
          resolve(nil)
          return
        }
        if try await updateTypedActivity(TimerAttributes.self, activityId: activityId, contentStateJson: contentStateJson, alertConfigJson: alertConfigJson) {
          resolve(nil)
          return
        }
        if try await updateTypedActivity(MediaAttributes.self, activityId: activityId, contentStateJson: contentStateJson, alertConfigJson: alertConfigJson) {
          resolve(nil)
          return
        }
        if try await updateTypedActivity(ProgressAttributes.self, activityId: activityId, contentStateJson: contentStateJson, alertConfigJson: alertConfigJson) {
          resolve(nil)
          return
        }

        reject("activity_not_found", "No activity found with id: \(activityId)", nil)
      } catch {
        reject("update_failed", error.localizedDescription, error)
      }
    }
  }

  @available(iOS 16.2, *)
  private func updateTypedActivity<T: IdealystActivityAttributes>(
    _ type: T.Type,
    activityId: String,
    contentStateJson: String,
    alertConfigJson: String?
  ) async throws -> Bool {
    guard let activity = Activity<T>.activities.first(where: { $0.id == activityId }) else {
      return false
    }

    let decoder = JSONDecoder()
    let contentData = contentStateJson.data(using: .utf8)!
    let contentState = try decoder.decode(T.ContentState.self, from: contentData)

    let updatedContent = ActivityContent(state: contentState, staleDate: nil)

    if #available(iOS 16.2, *) {
      if let alertJson = alertConfigJson,
         let alertData = alertJson.data(using: .utf8),
         let alertDict = try JSONSerialization.jsonObject(with: alertData) as? [String: Any] {
        let alertConfig = AlertConfiguration(
          title: LocalizedStringResource(stringLiteral: alertDict["title"] as? String ?? ""),
          body: LocalizedStringResource(stringLiteral: alertDict["body"] as? String ?? ""),
          sound: (alertDict["sound"] as? Bool ?? false) ? .default : nil
        )
        await activity.update(updatedContent, alertConfiguration: alertConfig)
      } else {
        await activity.update(updatedContent)
      }
    }

    return true
  }

  // MARK: - End Activity

  @objc
  func endActivity(
    _ activityId: String,
    finalContentStateJson: String?,
    dismissalPolicy: String,
    dismissAfter: Double,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      reject("not_supported", "Live Activities require iOS 16.2 or later", nil)
      return
    }

    Task {
      do {
        if try await endTypedActivity(DeliveryAttributes.self, activityId: activityId, finalContentStateJson: finalContentStateJson, dismissalPolicy: dismissalPolicy, dismissAfter: dismissAfter) {
          resolve(nil)
          return
        }
        if try await endTypedActivity(TimerAttributes.self, activityId: activityId, finalContentStateJson: finalContentStateJson, dismissalPolicy: dismissalPolicy, dismissAfter: dismissAfter) {
          resolve(nil)
          return
        }
        if try await endTypedActivity(MediaAttributes.self, activityId: activityId, finalContentStateJson: finalContentStateJson, dismissalPolicy: dismissalPolicy, dismissAfter: dismissAfter) {
          resolve(nil)
          return
        }
        if try await endTypedActivity(ProgressAttributes.self, activityId: activityId, finalContentStateJson: finalContentStateJson, dismissalPolicy: dismissalPolicy, dismissAfter: dismissAfter) {
          resolve(nil)
          return
        }

        reject("activity_not_found", "No activity found with id: \(activityId)", nil)
      } catch {
        reject("end_failed", error.localizedDescription, error)
      }
    }
  }

  @available(iOS 16.2, *)
  private func endTypedActivity<T: IdealystActivityAttributes>(
    _ type: T.Type,
    activityId: String,
    finalContentStateJson: String?,
    dismissalPolicy: String,
    dismissAfter: Double
  ) async throws -> Bool {
    guard let activity = Activity<T>.activities.first(where: { $0.id == activityId }) else {
      return false
    }

    // Cancel observation tasks
    pushTokenTasks[activityId]?.cancel()
    pushTokenTasks.removeValue(forKey: activityId)
    activityStateTasks[activityId]?.cancel()
    activityStateTasks.removeValue(forKey: activityId)

    let policy = parseDismissalPolicy(dismissalPolicy, dismissAfter: dismissAfter)

    if let json = finalContentStateJson,
       let data = json.data(using: .utf8) {
      let decoder = JSONDecoder()
      let finalState = try decoder.decode(T.ContentState.self, from: data)
      let finalContent = ActivityContent(state: finalState, staleDate: nil)
      await activity.end(finalContent, dismissalPolicy: policy)
    } else {
      await activity.end(nil, dismissalPolicy: policy)
    }

    return true
  }

  @objc
  func endAllActivities(
    _ dismissalPolicy: String,
    dismissAfter: Double,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      reject("not_supported", "Live Activities require iOS 16.2 or later", nil)
      return
    }

    Task {
      let policy = parseDismissalPolicy(dismissalPolicy, dismissAfter: dismissAfter)

      // Cancel all observation tasks
      for task in pushTokenTasks.values { task.cancel() }
      pushTokenTasks.removeAll()
      for task in activityStateTasks.values { task.cancel() }
      activityStateTasks.removeAll()

      for activity in Activity<DeliveryAttributes>.activities {
        await activity.end(nil, dismissalPolicy: policy)
      }
      for activity in Activity<TimerAttributes>.activities {
        await activity.end(nil, dismissalPolicy: policy)
      }
      for activity in Activity<MediaAttributes>.activities {
        await activity.end(nil, dismissalPolicy: policy)
      }
      for activity in Activity<ProgressAttributes>.activities {
        await activity.end(nil, dismissalPolicy: policy)
      }

      resolve(nil)
    }
  }

  // MARK: - Queries

  @objc
  func getActivity(
    _ activityId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      resolve(nil)
      return
    }

    if let json = findActivity(DeliveryAttributes.self, id: activityId) ??
                  findActivity(TimerAttributes.self, id: activityId) ??
                  findActivity(MediaAttributes.self, id: activityId) ??
                  findActivity(ProgressAttributes.self, id: activityId) {
      resolve(json)
    } else {
      resolve(nil)
    }
  }

  @objc
  func listActivities(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      resolve("[]")
      return
    }

    var results: [String] = []
    for activity in Activity<DeliveryAttributes>.activities {
      results.append(activityToJson(activity))
    }
    for activity in Activity<TimerAttributes>.activities {
      results.append(activityToJson(activity))
    }
    for activity in Activity<MediaAttributes>.activities {
      results.append(activityToJson(activity))
    }
    for activity in Activity<ProgressAttributes>.activities {
      results.append(activityToJson(activity))
    }

    resolve("[\(results.joined(separator: ","))]")
  }

  @objc
  func getPushToken(
    _ activityId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard #available(iOS 16.2, *) else {
      resolve(nil)
      return
    }

    if let token = findPushToken(DeliveryAttributes.self, id: activityId) ??
                   findPushToken(TimerAttributes.self, id: activityId) ??
                   findPushToken(MediaAttributes.self, id: activityId) ??
                   findPushToken(ProgressAttributes.self, id: activityId) {
      resolve(token)
    } else {
      resolve(nil)
    }
  }

  // MARK: - Private Helpers

  @available(iOS 16.2, *)
  private func observePushTokenUpdates<T: ActivityAttributes>(for activity: Activity<T>) {
    let task = Task {
      for await tokenData in activity.pushTokenUpdates {
        let tokenString = tokenData.map { String(format: "%02x", $0) }.joined()
        let event: [String: Any] = [
          "type": "tokenUpdated",
          "activityId": activity.id,
          "timestamp": Date().timeIntervalSince1970 * 1000,
          "payload": [
            "token": [
              "token": tokenString,
              "platform": "ios",
              "activityId": activity.id
            ]
          ]
        ]
        self.sendEvent(withName: "IdealystLiveActivityEvent", body: event)
      }
    }
    pushTokenTasks[activity.id] = task
  }

  @available(iOS 16.2, *)
  private func observeActivityState<T: ActivityAttributes>(for activity: Activity<T>) {
    let task = Task {
      for await state in activity.activityStateUpdates {
        let stateString: String
        switch state {
        case .active: stateString = "active"
        case .dismissed: stateString = "ended"
        case .ended: stateString = "ended"
        case .stale: stateString = "stale"
        @unknown default: stateString = "unknown"
        }

        let eventType = state == .stale ? "stale" : (state == .dismissed || state == .ended ? "ended" : "updated")

        let event: [String: Any] = [
          "type": eventType,
          "activityId": activity.id,
          "timestamp": Date().timeIntervalSince1970 * 1000,
          "payload": [
            "state": stateString
          ]
        ]
        self.sendEvent(withName: "IdealystLiveActivityEvent", body: event)
      }
    }
    activityStateTasks[activity.id] = task
  }

  @available(iOS 16.2, *)
  private func activityToJson<T: ActivityAttributes>(_ activity: Activity<T>) -> String {
    let encoder = JSONEncoder()
    let stateString: String
    switch activity.activityState {
    case .active: stateString = "active"
    case .dismissed: stateString = "ended"
    case .ended: stateString = "ended"
    case .stale: stateString = "stale"
    @unknown default: stateString = "unknown"
    }

    var dict: [String: Any] = [
      "id": activity.id,
      "state": stateString,
      "startedAt": Date().timeIntervalSince1970 * 1000,
    ]

    // Encode attributes and content state
    if let attrData = try? encoder.encode(activity.attributes),
       let attrDict = try? JSONSerialization.jsonObject(with: attrData) {
      dict["attributes"] = attrDict
    }
    if let contentData = try? encoder.encode(activity.content.state),
       let contentDict = try? JSONSerialization.jsonObject(with: contentData) {
      dict["contentState"] = contentDict
    }

    // Determine template type from attributes type
    dict["templateType"] = templateTypeFor(T.self)

    if let jsonData = try? JSONSerialization.data(withJSONObject: dict),
       let jsonString = String(data: jsonData, encoding: .utf8) {
      return jsonString
    }

    return "{}"
  }

  @available(iOS 16.2, *)
  private func findActivity<T: ActivityAttributes>(_ type: T.Type, id: String) -> String? {
    guard let activity = Activity<T>.activities.first(where: { $0.id == id }) else {
      return nil
    }
    return activityToJson(activity)
  }

  @available(iOS 16.2, *)
  private func findPushToken<T: ActivityAttributes>(_ type: T.Type, id: String) -> String? {
    guard let activity = Activity<T>.activities.first(where: { $0.id == id }) else {
      return nil
    }
    guard let tokenData = activity.pushToken else {
      return nil
    }
    let tokenString = tokenData.map { String(format: "%02x", $0) }.joined()
    let dict: [String: Any] = [
      "token": tokenString,
      "platform": "ios",
      "activityId": activity.id
    ]
    if let jsonData = try? JSONSerialization.data(withJSONObject: dict),
       let jsonString = String(data: jsonData, encoding: .utf8) {
      return jsonString
    }
    return nil
  }

  @available(iOS 16.2, *)
  private func parseDismissalPolicy(_ policy: String, dismissAfter: Double) -> ActivityUIDismissalPolicy {
    switch policy {
    case "immediate":
      return .immediate
    case "afterDate":
      if dismissAfter > 0 {
        return .after(Date(timeIntervalSince1970: dismissAfter / 1000))
      }
      return .default
    default:
      return .default
    }
  }

  private func templateTypeFor<T: ActivityAttributes>(_ type: T.Type) -> String {
    switch String(describing: type) {
    case "DeliveryAttributes": return "delivery"
    case "TimerAttributes": return "timer"
    case "MediaAttributes": return "media"
    case "ProgressAttributes": return "progress"
    default: return "custom"
    }
  }
}

// MARK: - Protocol for template attributes

protocol IdealystActivityAttributes: ActivityAttributes where ContentState: Codable {}

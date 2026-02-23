package io.idealyst.liveactivity

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.ConcurrentHashMap

class IdealystLiveActivityModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "IdealystLiveActivity"

  private val liveUpdateNotification by lazy { LiveUpdateNotification(reactContext) }

  // Track active activities: activityId -> { notificationId, templateType, attributes, contentState, options, startedAt }
  private val activeActivities = ConcurrentHashMap<String, ActivityRecord>()

  private data class ActivityRecord(
    val notificationId: Int,
    val templateType: String,
    val attributes: JSONObject,
    val contentState: JSONObject,
    val options: JSONObject,
    val startedAt: Long
  )

  // ---- Availability ----

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun isSupported(): Boolean {
    return liveUpdateNotification.isProgressStyleSupported()
  }

  @ReactMethod
  fun isEnabled(promise: Promise) {
    promise.resolve(liveUpdateNotification.canPostPromotedNotifications())
  }

  // ---- Lifecycle ----

  @ReactMethod
  fun startActivity(
    templateType: String,
    attributesJson: String,
    contentStateJson: String,
    optionsJson: String,
    promise: Promise
  ) {
    try {
      val attributes = JSONObject(attributesJson)
      val contentState = JSONObject(contentStateJson)
      val options = JSONObject(optionsJson)
      val androidOptions = options.optJSONObject("android") ?: JSONObject()

      val notificationId = androidOptions.optInt(
        "notificationId",
        LiveUpdateNotification.nextNotificationId()
      )

      liveUpdateNotification.show(
        notificationId, templateType, attributes, contentState, androidOptions
      )

      val activityId = "android_la_$notificationId"
      val now = System.currentTimeMillis()

      activeActivities[activityId] = ActivityRecord(
        notificationId = notificationId,
        templateType = templateType,
        attributes = attributes,
        contentState = contentState,
        options = androidOptions,
        startedAt = now
      )

      // Emit started event
      emitEvent(JSONObject().apply {
        put("type", "started")
        put("activityId", activityId)
        put("timestamp", now)
        put("payload", JSONObject().put("state", "active"))
      })

      // Return activity info
      val info = JSONObject().apply {
        put("id", activityId)
        put("state", "active")
        put("startedAt", now)
        put("templateType", templateType)
        put("attributes", attributes)
        put("contentState", contentState)
      }

      promise.resolve(info.toString())
    } catch (e: Exception) {
      promise.reject("start_failed", e.message, e)
    }
  }

  @ReactMethod
  fun updateActivity(
    activityId: String,
    contentStateJson: String,
    alertConfigJson: String?,
    promise: Promise
  ) {
    try {
      val record = activeActivities[activityId]
      if (record == null) {
        promise.reject("activity_not_found", "No activity found with id: $activityId")
        return
      }

      val newContentState = JSONObject(contentStateJson)

      // Merge with existing content state
      val mergedState = JSONObject(record.contentState.toString())
      val keys = newContentState.keys()
      while (keys.hasNext()) {
        val key = keys.next()
        mergedState.put(key, newContentState.get(key))
      }

      liveUpdateNotification.update(
        record.notificationId, record.templateType, mergedState, record.attributes, record.options
      )

      // Update stored record
      activeActivities[activityId] = record.copy(contentState = mergedState)

      emitEvent(JSONObject().apply {
        put("type", "updated")
        put("activityId", activityId)
        put("timestamp", System.currentTimeMillis())
        put("payload", JSONObject().put("state", "active"))
      })

      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("update_failed", e.message, e)
    }
  }

  @ReactMethod
  fun endActivity(
    activityId: String,
    finalContentStateJson: String?,
    dismissalPolicy: String,
    dismissAfter: Double,
    promise: Promise
  ) {
    try {
      val record = activeActivities[activityId]
      if (record == null) {
        promise.reject("activity_not_found", "No activity found with id: $activityId")
        return
      }

      // If there's a final state, show it briefly before dismissing
      if (finalContentStateJson != null) {
        val finalState = JSONObject(finalContentStateJson)
        val mergedState = JSONObject(record.contentState.toString())
        val keys = finalState.keys()
        while (keys.hasNext()) {
          val key = keys.next()
          mergedState.put(key, finalState.get(key))
        }
        liveUpdateNotification.update(
          record.notificationId, record.templateType, mergedState, record.attributes, record.options
        )
      }

      // Dismiss based on policy
      when (dismissalPolicy) {
        "immediate" -> {
          liveUpdateNotification.dismiss(record.notificationId)
        }
        "afterDate" -> {
          val delayMs = if (dismissAfter > 0) {
            (dismissAfter - System.currentTimeMillis()).toLong().coerceAtLeast(0)
          } else {
            5000L // Default 5 second delay
          }
          android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            liveUpdateNotification.dismiss(record.notificationId)
          }, delayMs)
        }
        else -> {
          // "default" — dismiss after a short delay (similar to iOS default)
          android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            liveUpdateNotification.dismiss(record.notificationId)
          }, 5000L)
        }
      }

      activeActivities.remove(activityId)

      emitEvent(JSONObject().apply {
        put("type", "ended")
        put("activityId", activityId)
        put("timestamp", System.currentTimeMillis())
        put("payload", JSONObject().put("state", "ended"))
      })

      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("end_failed", e.message, e)
    }
  }

  @ReactMethod
  fun endAllActivities(
    dismissalPolicy: String,
    dismissAfter: Double,
    promise: Promise
  ) {
    try {
      for ((activityId, record) in activeActivities) {
        liveUpdateNotification.dismiss(record.notificationId)

        emitEvent(JSONObject().apply {
          put("type", "ended")
          put("activityId", activityId)
          put("timestamp", System.currentTimeMillis())
          put("payload", JSONObject().put("state", "ended"))
        })
      }
      activeActivities.clear()
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject("end_failed", e.message, e)
    }
  }

  // ---- Queries ----

  @ReactMethod
  fun getActivity(activityId: String, promise: Promise) {
    val record = activeActivities[activityId]
    if (record == null) {
      promise.resolve(null)
      return
    }

    promise.resolve(recordToJson(activityId, record).toString())
  }

  @ReactMethod
  fun listActivities(promise: Promise) {
    val array = JSONArray()
    for ((activityId, record) in activeActivities) {
      array.put(recordToJson(activityId, record))
    }
    promise.resolve(array.toString())
  }

  @ReactMethod
  fun getPushToken(activityId: String, promise: Promise) {
    // Android Live Updates don't have per-activity push tokens.
    // FCM tokens are managed at the app level via @idealyst/notifications.
    promise.resolve(null)
  }

  // ---- Events ----

  @ReactMethod
  fun addListener(eventName: String) {
    // Required for NativeEventEmitter
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    // Required for NativeEventEmitter
  }

  private fun emitEvent(event: JSONObject) {
    try {
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("IdealystLiveActivityEvent", event.toString())
    } catch (e: Exception) {
      // JS not ready yet — ignore
    }
  }

  // ---- Helpers ----

  private fun recordToJson(activityId: String, record: ActivityRecord): JSONObject {
    return JSONObject().apply {
      put("id", activityId)
      put("state", "active")
      put("startedAt", record.startedAt)
      put("templateType", record.templateType)
      put("attributes", record.attributes)
      put("contentState", record.contentState)
    }
  }
}

package io.idealyst.liveactivity

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import org.json.JSONObject

/**
 * Wraps Android notification creation for Live Updates.
 * Uses Notification.ProgressStyle on API 36+ (Android 16),
 * falls back to standard progress notification on older versions.
 */
class LiveUpdateNotification(private val context: Context) {

  companion object {
    const val DEFAULT_CHANNEL_ID = "idealyst_live_activity"
    const val DEFAULT_CHANNEL_NAME = "Live Activities"
    const val DEFAULT_CHANNEL_DESCRIPTION = "Real-time activity updates"

    private var notificationIdCounter = 9000
    fun nextNotificationId(): Int = notificationIdCounter++
  }

  private val notificationManager =
    context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

  init {
    ensureChannel()
  }

  private fun ensureChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val existing = notificationManager.getNotificationChannel(DEFAULT_CHANNEL_ID)
      if (existing == null) {
        val channel = NotificationChannel(
          DEFAULT_CHANNEL_ID,
          DEFAULT_CHANNEL_NAME,
          NotificationManager.IMPORTANCE_HIGH
        ).apply {
          description = DEFAULT_CHANNEL_DESCRIPTION
        }
        notificationManager.createNotificationChannel(channel)
      }
    }
  }

  /**
   * Check if the device supports Live Updates (ProgressStyle).
   */
  fun isProgressStyleSupported(): Boolean {
    return Build.VERSION.SDK_INT >= 36
  }

  /**
   * Check if the app can post promoted notifications (Live Updates).
   */
  fun canPostPromotedNotifications(): Boolean {
    if (Build.VERSION.SDK_INT < 36) return false
    return try {
      notificationManager.canPostPromotedNotifications()
    } catch (e: Exception) {
      false
    }
  }

  /**
   * Create and show a Live Update notification.
   * Returns the notification ID used.
   */
  fun show(
    notificationId: Int,
    templateType: String,
    attributes: JSONObject,
    contentState: JSONObject,
    options: JSONObject
  ): Int {
    val channelId = options.optString("channelId", DEFAULT_CHANNEL_ID)
    val smallIconName = options.optString("smallIcon", "ic_notification")
    val deepLinkUrl = options.optString("deepLinkUrl", "")

    val smallIconRes = getIconResource(smallIconName)

    if (Build.VERSION.SDK_INT >= 36 && canPostPromotedNotifications()) {
      showProgressStyleNotification(
        notificationId, templateType, attributes, contentState,
        channelId, smallIconRes, deepLinkUrl
      )
    } else {
      showFallbackNotification(
        notificationId, templateType, attributes, contentState,
        channelId, smallIconRes, deepLinkUrl
      )
    }

    return notificationId
  }

  /**
   * Update an existing Live Update notification.
   */
  fun update(
    notificationId: Int,
    templateType: String,
    contentState: JSONObject,
    attributes: JSONObject,
    options: JSONObject
  ) {
    show(notificationId, templateType, attributes, contentState, options)
  }

  /**
   * Dismiss a Live Update notification.
   */
  fun dismiss(notificationId: Int) {
    notificationManager.cancel(notificationId)
  }

  /**
   * Dismiss all Live Update notifications.
   */
  fun dismissAll() {
    notificationManager.cancelAll()
  }

  // ---- ProgressStyle (API 36+) ----

  private fun showProgressStyleNotification(
    notificationId: Int,
    templateType: String,
    attributes: JSONObject,
    contentState: JSONObject,
    channelId: String,
    smallIconRes: Int,
    deepLinkUrl: String
  ) {
    if (Build.VERSION.SDK_INT < 36) return

    val title = extractTitle(templateType, attributes, contentState)
    val status = extractStatus(templateType, contentState)
    val progress = contentState.optDouble("progress", -1.0)

    val progressStyle = Notification.ProgressStyle()

    if (progress in 0.0..1.0) {
      progressStyle.setProgress((progress * 100).toInt())
    } else {
      progressStyle.setProgressIndeterminate(true)
    }

    val builder = Notification.Builder(context, channelId)
      .setSmallIcon(smallIconRes)
      .setContentTitle(title)
      .setContentText(status)
      .setStyle(progressStyle)
      .setOngoing(true)
      .setCategory(Notification.CATEGORY_PROGRESS)

    if (deepLinkUrl.isNotEmpty()) {
      val intent = createDeepLinkIntent(deepLinkUrl)
      if (intent != null) {
        val pendingIntent = PendingIntent.getActivity(
          context, notificationId, intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        builder.setContentIntent(pendingIntent)
      }
    }

    notificationManager.notify(notificationId, builder.build())
  }

  // ---- Fallback (pre-API 36) ----

  private fun showFallbackNotification(
    notificationId: Int,
    templateType: String,
    attributes: JSONObject,
    contentState: JSONObject,
    channelId: String,
    smallIconRes: Int,
    deepLinkUrl: String
  ) {
    val title = extractTitle(templateType, attributes, contentState)
    val status = extractStatus(templateType, contentState)
    val progress = contentState.optDouble("progress", -1.0)
    val indeterminate = contentState.optBoolean("indeterminate", false)

    val builder = NotificationCompat.Builder(context, channelId)
      .setSmallIcon(smallIconRes)
      .setContentTitle(title)
      .setContentText(status)
      .setOngoing(true)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setCategory(NotificationCompat.CATEGORY_PROGRESS)

    if (indeterminate) {
      builder.setProgress(0, 0, true)
    } else if (progress in 0.0..1.0) {
      builder.setProgress(100, (progress * 100).toInt(), false)
    }

    if (deepLinkUrl.isNotEmpty()) {
      val intent = createDeepLinkIntent(deepLinkUrl)
      if (intent != null) {
        val pendingIntent = PendingIntent.getActivity(
          context, notificationId, intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        builder.setContentIntent(pendingIntent)
      }
    }

    notificationManager.notify(notificationId, builder.build())
  }

  // ---- Helpers ----

  private fun extractTitle(
    templateType: String,
    attributes: JSONObject,
    contentState: JSONObject
  ): String {
    return when (templateType) {
      "delivery" -> "${attributes.optString("startLabel", "")} → ${attributes.optString("endLabel", "")}"
      "timer" -> attributes.optString("title", "Timer")
      "media" -> contentState.optString("trackTitle", attributes.optString("title", "Now Playing"))
      "progress" -> attributes.optString("title", "Progress")
      else -> attributes.optString("title", "Live Activity")
    }
  }

  private fun extractStatus(templateType: String, contentState: JSONObject): String {
    return when (templateType) {
      "delivery" -> contentState.optString("status", "In progress")
      "timer" -> contentState.optString("subtitle", "Running")
      "media" -> {
        val artist = contentState.optString("artist", "")
        val playing = if (contentState.optBoolean("isPlaying", false)) "Playing" else "Paused"
        if (artist.isNotEmpty()) "$artist • $playing" else playing
      }
      "progress" -> contentState.optString("status", "In progress")
      else -> contentState.optString("status", "")
    }
  }

  private fun getIconResource(name: String): Int {
    val res = context.resources.getIdentifier(name, "drawable", context.packageName)
    return if (res != 0) res else android.R.drawable.ic_popup_sync
  }

  private fun createDeepLinkIntent(url: String): Intent? {
    return try {
      val intent = Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url))
      intent.setPackage(context.packageName)
      intent
    } catch (e: Exception) {
      null
    }
  }
}

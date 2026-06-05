package co.custech.calltracker.callhandler

import android.database.Cursor
import android.provider.CallLog
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class CusCallHandlerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("CusCallHandler")

    AsyncFunction("load") { limit: Int ->
      val context = appContext.reactContext ?: return@AsyncFunction emptyList<Map<String, Any?>>()
      val maxRows = limit.coerceIn(1, 500)
      val entries = mutableListOf<Map<String, Any?>>()

      val projection = arrayOf(
        CallLog.Calls.NUMBER,
        CallLog.Calls.CACHED_NAME,
        CallLog.Calls.TYPE,
        CallLog.Calls.DURATION,
        CallLog.Calls.DATE,
        CallLog.Calls.PHONE_ACCOUNT_ID,
      )

      val cursor = context.contentResolver.query(
        CallLog.Calls.CONTENT_URI,
        projection,
        null,
        null,
        "${CallLog.Calls.DATE} DESC",
      )

      cursor?.use {
        while (it.moveToNext() && entries.size < maxRows) {
          entries.add(
            mapOf(
              "phoneNumber" to (it.stringAt(CallLog.Calls.NUMBER) ?: ""),
              "name" to it.stringAt(CallLog.Calls.CACHED_NAME),
              "type" to it.intAt(CallLog.Calls.TYPE),
              "duration" to it.intAt(CallLog.Calls.DURATION),
              "dateTime" to it.longAt(CallLog.Calls.DATE),
              "phoneAccountId" to it.stringAt(CallLog.Calls.PHONE_ACCOUNT_ID),
            ),
          )
        }
      }

      entries
    }
  }

  private fun Cursor.stringAt(column: String): String? {
    val index = getColumnIndex(column)
    if (index < 0 || isNull(index)) return null
    return getString(index)
  }

  private fun Cursor.intAt(column: String): Int {
    val index = getColumnIndex(column)
    if (index < 0 || isNull(index)) return 0
    return getInt(index)
  }

  private fun Cursor.longAt(column: String): Long {
    val index = getColumnIndex(column)
    if (index < 0 || isNull(index)) return 0L
    return getLong(index)
  }
}

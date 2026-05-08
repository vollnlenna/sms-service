package com.mobileapp.sms

import android.app.PendingIntent
import android.content.*
import android.os.Build
import android.telephony.SmsManager
import android.telephony.TelephonyManager
import com.facebook.react.bridge.*

class SmsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    init {
        reactContextHolder = reactContext
    }

    override fun getName(): String = "SmsModule"

    @ReactMethod
    fun sendSms(phone: String, text: String, promise: Promise) {
        try {
            val smsManager =
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    reactContext.getSystemService(SmsManager::class.java)
                } else {
                    @Suppress("DEPRECATION")
                    SmsManager.getDefault()
                }

            val sentIntent = Intent("SMS_SENT")

            val sentPI = PendingIntent.getBroadcast(
                reactContext,
                0,
                sentIntent,
                PendingIntent.FLAG_IMMUTABLE
            )

            smsManager.sendTextMessage(phone, null, text, sentPI, null)

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SMS_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getLine1Number(promise: Promise) {
        try {
            val tm = reactContext.getSystemService(TelephonyManager::class.java)
            val number = tm?.line1Number ?: ""
            promise.resolve(number)
        } catch (e: Exception) {
            promise.resolve("")
        }
    }

    companion object {
        var reactContextHolder: ReactApplicationContext? = null
    }
}
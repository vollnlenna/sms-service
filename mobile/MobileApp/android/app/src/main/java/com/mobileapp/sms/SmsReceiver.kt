package com.mobileapp.sms

import android.content.*
import android.os.Build
import android.telephony.SmsMessage
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Arguments

class SmsReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val reactContext = SmsModule.reactContextHolder ?: return

        when (intent.action) {

            "SMS_SENT" -> {
                val status = if (resultCode == android.app.Activity.RESULT_OK) "sent" else "failed"

                val params = Arguments.createMap()
                params.putString("status", status)
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("SmsStatus", params)
            }

            "android.provider.Telephony.SMS_RECEIVED" -> {
                val pdus = intent.extras?.get("pdus") as? Array<*> ?: return
                val format = intent.getStringExtra("format")

                for (pdu in pdus) {
                    val sms = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        SmsMessage.createFromPdu(pdu as ByteArray, format)
                    } else {
                        @Suppress("DEPRECATION")
                        SmsMessage.createFromPdu(pdu as ByteArray)
                    }

                    val from = sms.originatingAddress ?: continue
                    val body = sms.messageBody ?: continue

                    val params = Arguments.createMap()
                    params.putString("from", from)
                    params.putString("body", body)
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("SmsReceived", params)
                }
            }
        }
    }
}
package com.technovatepowerbox

import android.content.Context
import android.content.SharedPreferences
import com.technovatepowerbox.NativeLocalStorageSpec
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import org.eclipse.paho.client.mqttv3.*
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
// import android.util.Log
import com.facebook.react.bridge.Callback

class NativeLocalStorageModule(reactContext: ReactApplicationContext) : NativeLocalStorageSpec(reactContext) {

  private val mqttClient: MqttClient
  private var isConnecting = false

  private var onConnectCallback: Callback? = null
  private var onDisconnectCallback: Callback? = null
  private var onMessageCallback: Callback? = null

  init {
    val brokerUrl = "tcp://41.223.145.80:1883"  // Replace with actual MQTT broker URL
    mqttClient = MqttClient(brokerUrl, MqttClient.generateClientId(), MemoryPersistence())

    mqttClient.setCallback(object : MqttCallbackExtended {
      override fun connectionLost(cause: Throwable?) {
        onDisconnectCallback?.invoke(cause?.message ?: "Unknown error")
      }

      override fun messageArrived(topic: String?, message: MqttMessage?) {
        onMessageCallback?.invoke(topic ?: "", message?.payload?.decodeToString() ?: "")
      }

      override fun deliveryComplete(token: IMqttDeliveryToken?) {}

      override fun connectComplete(reconnect: Boolean, serverURI: String?) {
        onConnectCallback?.invoke(reconnect)
      }
    })
  }


  override fun getName() = NAME

  override fun connect(username: String, password: String) : String? {
    val options = MqttConnectOptions().apply {
      this.userName = username
      this.password = password.toCharArray()
      this.isAutomaticReconnect = false
    }
    mqttClient.connect(options)
    return "Connected successful"
  }

  override fun disconnect(): String {
    if (mqttClient.isConnected) {
      mqttClient.disconnect()
      // onDisconnectCallback?.invoke("Disconnected from MQTT broker")
      return "Disconnected"
    } else {
      return "Already disconnected"
    }
  }

  override fun onConnect(callback: Callback) {
    onConnectCallback = callback
  }

  override fun onDisconnect(callback: Callback) {
    onDisconnectCallback = callback
  }

  override fun onMessage(callback: Callback) {
    onMessageCallback = callback
  }

  override fun publish(topic: String, message: String): String {
    val mqttMessage = MqttMessage(message.toByteArray()).apply {
      this.qos = 1
    }
    mqttClient.publish(topic, mqttMessage)
    return "Msg sent"
  }

  override fun subscribe(topic: String) {
    mqttClient.subscribe(topic, 1)
  }

  override fun unsubscribe(topic: String) {
    mqttClient.unsubscribe(topic)
  }

  override fun setItem(value: String, key: String) {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.putString(key, value)
    editor.apply()
  }

  override fun getItem(key: String): String? {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val username = sharedPref.getString(key, null)
    return username.toString()
  }

  override fun removeItem(key: String) {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.remove(key)
    editor.apply()
  }

  override fun clear() {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.clear()
    editor.apply()
  }

  companion object {
    const val NAME = "NativeLocalStorage"
  }
}
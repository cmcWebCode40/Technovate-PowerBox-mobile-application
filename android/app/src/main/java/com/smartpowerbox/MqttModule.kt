package com.smartpowerbox

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.eclipse.paho.client.mqttv3.*
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import android.util.Log

class MqttModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val mqttClient: MqttClient
    private val reactContext: ReactApplicationContext = reactContext
    private var isConnecting = false

    init {
        val brokerUrl = "tcp://41.223.145.80:1883"
        mqttClient = MqttClient(brokerUrl, MqttClient.generateClientId(), MemoryPersistence())

        // Set MQTT callback for connection and disconnection events
        mqttClient.setCallback(object : MqttCallbackExtended {
            override fun connectionLost(cause: Throwable?) {
                Log.e("MqttModule", "Connection lost: ${cause?.message}")
                sendEvent("onDisconnect", Arguments.createMap().apply {
                    putString("error", cause?.message ?: "Unknown error")
                })
                reconnect()
            }

            override fun messageArrived(topic: String?, message: MqttMessage?) {
                sendEvent("onMessage", Arguments.createMap().apply {
                    putString("topic", topic)
                    putString("message", String(message?.payload ?: byteArrayOf()))
                })
            }

            override fun deliveryComplete(token: IMqttDeliveryToken?) {
                // Not used in this implementation
            }

            override fun connectComplete(reconnect: Boolean, serverURI: String?) {
                Log.i("MqttModule", "Connected to broker: $serverURI (reconnect: $reconnect)")
                sendEvent("onConnect", Arguments.createMap().apply {
                    putBoolean("reconnect", reconnect)
                })
            }
        })
    }

    override fun getName(): String {
        return "MqttModule"
    }

    @ReactMethod
    fun addListener(type: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(type: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun connect(username: String, password: String, promise: Promise) {
        try {
            val options = MqttConnectOptions().apply {
                this.userName = username
                this.password = password.toCharArray()
                this.isAutomaticReconnect = false
            }

            mqttClient.connect(options)
            promise.resolve("Connected to MQTT broker")
        } catch (e: Exception) {
            promise.reject("MQTT_CONNECTION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun subscribe(topic: String, qos: Int, promise: Promise) {
        try {
            mqttClient.subscribe(topic, qos) { t, message ->
                sendEvent("onMessage", Arguments.createMap().apply {
                    putString("topic", t)
                    putString("message", String(message.payload))
                })
            }
            promise.resolve("Subscribed to topic: $topic")
        } catch (e: Exception) {
            promise.reject("MQTT_SUBSCRIPTION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun unsubscribe(topic: String, promise: Promise) {
        try {
            if (mqttClient.isConnected) {
                mqttClient.unsubscribe(topic)
                promise.resolve("Unsubscribed from topic: $topic")
            } else {
                promise.reject("MQTT_UNSUBSCRIBE_ERROR", "Client is not connected")
            }
        } catch (e: Exception) {
            promise.reject("MQTT_UNSUBSCRIBE_ERROR", e.message)
        }
    }

    @ReactMethod
    fun disconnect(promise: Promise) {
        try {
            if (mqttClient.isConnected) {
                mqttClient.disconnect()
                sendEvent("onDisconnect", Arguments.createMap().apply {
                    putString("message", "--Disconnected from MQTT broker--")
                })
                promise.resolve("Disconnected from MQTT broker")
            } else {
                promise.resolve("Already disconnected")
            }
        } catch (e: Exception) {
            promise.reject("MQTT_DISCONNECT_ERROR", e.message)
        }
    }

    private fun reconnect() {
        if (isConnecting) return
        isConnecting = true

        try {
            Log.i("MqttModule", "Attempting to reconnect to MQTT broker...")
            mqttClient.reconnect()
            isConnecting = false
        } catch (e: Exception) {
            Log.e("MqttModule", "Reconnect failed: ${e.message}")
            isConnecting = false
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}

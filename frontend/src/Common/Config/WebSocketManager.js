import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketManager {
  constructor() {
    this.stompClient = null;
    this.subscriptions = new Map();
  }

  async isFullyConnectedAsync(timeout = 5000, interval = 50) {
    const start = Date.now();

    return new Promise((resolve, reject) => {
      const checkConnection = () => {
        if (this.stompClient && this.stompClient.connected) {
          console.log("WebSocketManager: Connection is fully established.");
          return resolve(true);
        }

        if (Date.now() - start >= timeout) {
          console.error("WebSocketManager: Connection check timed out.");
          return reject(new Error("WebSocket connection timed out"));
        }

        // Retry after a short delay
        setTimeout(checkConnection, interval);
      };

      checkConnection(); // Start the periodic check
    });
  }

  isFullyConnected() {
    return this.stompClient && this.stompClient.connected;
  }

  connect(apiBaseUrl, onConnectCallback, onErrorCallback) {
    if (this.isConnected) {
      console.log("WebSocket already connected");
      return Promise.resolve(); // If already connected, resolve immediately
    }

    const sockJsUrl = `${apiBaseUrl.replace(/^http/, "http")}/planning-poker`;

    return new Promise((resolve, reject) => {
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(sockJsUrl),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = (frame) => {
        console.log("WebSocket connected");
        if (onConnectCallback) {
          onConnectCallback();
        }
        this.isConnected = true;
        resolve(frame); // Resolve the promise when connected
      };

      this.stompClient.onStompError = (error) => {
        console.error("STOMP error:", error);
        this.isConnected = false;
        reject(error); // Reject the promise on STOMP error
      };

      this.stompClient.onWebSocketClose = (error) => {
        console.error("WebSocket closed:", error);
        this.isConnected = false;
        reject(error); // Reject the promise on WebSocket close
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error("WebSocket error:", error);
        this.isConnected = false;
        reject(error); // Reject the promise on WebSocket error
      };

      this.stompClient.activate(); // Start the connection
    });
  }

  disconnect() {
    if (this.stompClient && this.isConnected) {
      this.stompClient.deactivate();
      this.isConnected = false;
      console.log("WebSocket disconnected");
    }
  }

  subscribe(destination, callback) {
    if (!this.isConnected) {
      console.error("Cannot subscribe. WebSocket not connected.");
      return Promise.reject("WebSocket not connected");
    }

    const subscription = this.stompClient.subscribe(destination, (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });

    this.subscriptions.set(destination, subscription);
    return Promise.resolve(subscription); // Resolve the subscription promise
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log(`Unsubscribed from ${destination}`);
    }
  }

  sendMessage(destination, body) {
    if (this.isConnected) {
      this.stompClient.publish({ destination, body: JSON.stringify(body) });
    } else {
      console.error("Cannot send message. WebSocket not connected.");
    }
  }
}

export default new WebSocketManager();

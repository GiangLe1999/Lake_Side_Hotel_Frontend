import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";

const apiUrl = import.meta.env.VITE_API_URL;

export const useWebSocket = (sessionId, onMessageReceived, onTyping) => {
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef(null);

  // Khi 1 conversation được initialize, sessionId được trả về trong response và được gán vào global context
  // Kiểm trả nếu có sessionId thì tiến hành tạo WebSocket connection
  useEffect(() => {
    if (!sessionId) return;

    const accessToken =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token") ||
      "";

    // Create WebSocket connection
    const client = new Client({
      webSocketFactory: () => new SockJS(`${apiUrl}/ws`),
      // Thêm access token vào header để backend xử lý
      connectHeaders: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "", // Gửi token trong header
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      console.log("Connected to WebSocket");

      // Subscribe to conversation messages
      client.subscribe(`/topic/chat/${sessionId}`, (message) => {
        const chatMessage = JSON.parse(message.body);
        onMessageReceived(chatMessage);
      });

      // Subscribe to typing indicators
      client.subscribe(`/topic/chat/${sessionId}/typing`, (message) => {
        const typingMessage = JSON.parse(message.body);
        console.log(typingMessage);
        if (typingMessage) {
          onTyping(typingMessage);
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      console.log("Disconnected from WebSocket");
    };

    client.onStompError = (frame) => {
      console.error("WebSocket error:", frame);
      toast.error("Connection error. Retrying...");
    };

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [sessionId, onMessageReceived]);

  const sendMessage = (destination, message) => {
    if (stompClient.current && isConnected) {
      stompClient.current.publish({
        destination,
        body: JSON.stringify(message),
      });
    }
  };

  return { isConnected, sendMessage };
};

import React, { createContext, useContext, useState, useCallback } from "react";
// import { v4 as uuidv4 } from "uuid";

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("chat_session_id");
    //  || uuidv4();
  });
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const openChat = useCallback((roomId = null) => {
    setIsOpen(true);
    // Store room context for chat initialization
    if (roomId) {
      sessionStorage.setItem("chat_room_id", roomId.toString());
    }
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addMessage = useCallback(
    (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.senderType !== "USER" && !isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    },
    [isOpen]
  );

  const clearUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const value = {
    isOpen,
    sessionId,
    setSessionId,
    messages,
    setMessages,
    unreadCount,
    openChat,
    closeChat,
    addMessage,
    clearUnreadCount,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

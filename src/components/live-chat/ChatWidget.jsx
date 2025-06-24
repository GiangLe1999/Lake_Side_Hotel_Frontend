import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  X,
  User,
  Smile,
  Paperclip,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useWebSocket } from "../../hooks/useWebSocket";
import Message from "./Message";
import { toast } from "react-toastify";
import { useChatContext } from "../../context/ChatContext";
import { chatService } from "../../service/chat-service";
import { useAuth } from "../../hooks/useAuth";
import { uploadFileToS3 } from "../../utils/upload-file-to-s3";
import TypingIndicator from "../common/TypingIndicator";

const ChatWidget = () => {
  const {
    isOpen,
    sessionId,
    setSessionId,
    messages,
    setMessages,
    closeChat,
    addMessage,
    clearUnreadCount,
  } = useChatContext();

  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
  });
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState({
    senderName: "",
    typing: false,
  });

  // New states for conversation status
  const [conversationStatus, setConversationStatus] = useState("ACTIVE"); // ACTIVE, RESOLVED, CLOSED
  const [statusMessage, setStatusMessage] = useState("");

  const { user } = useAuth();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { mutate: initializeChatMutation, isPending: initializeChatPending } =
    useMutation({
      mutationFn: chatService.initializeChat,
      onSuccess: (response) => {
        if (response?.status === 201) {
          setSessionId(response?.data?.sessionId);
          setMessages(response?.data?.messages || []);
          setIsInitialized(true);
          // Reset conversation status when initializing
          setConversationStatus("ACTIVE");
          setStatusMessage("");
        }

        if (!user) {
          setShowGuestForm(false);
        }

        // Focus input
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      onError: (err) => {
        console.error("Failed to initialize chat:", err);
        toast.error("Failed to start chat. Please try again.");
      },
    });

  const handleWebSocketTyping = useCallback((message) => {
    setTypingIndicator(message);
  }, []);

  // Enhanced message handler to process system messages
  const handleIncomingMessage = useCallback(
    (message) => {
      // Check if it's a system message
      if (message.messageType === "SYSTEM_MESSAGE") {
        const content = message.content?.toLowerCase() || "";

        if (content.includes("marked as resolved")) {
          setConversationStatus("RESOLVED");
          setStatusMessage("This conversation has been resolved by admin.");
          toast.success("Conversation has been resolved by admin");
        } else if (content.includes("reactivated")) {
          setConversationStatus("ACTIVE");
          setStatusMessage("");
          toast.success("Conversation has been reactivated");
        } else if (content.includes("closed")) {
          setConversationStatus("CLOSED");
          setStatusMessage("This conversation has been closed by admin.");
          toast.error("Conversation has been closed by admin");
        }
      }

      // Add message to chat
      addMessage(message);

      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    [addMessage]
  );

  // Initialize WebSocket connection
  const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocket(
    sessionId,
    handleIncomingMessage,
    handleWebSocketTyping
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Initialize chat when widget opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChat();
    }
  }, [isOpen, isInitialized]);

  // Clear unread count when chat is open
  useEffect(() => {
    if (isOpen) {
      clearUnreadCount();
    }
  }, [isOpen, clearUnreadCount]);

  const initializeChat = async () => {
    const roomId = sessionStorage.getItem("chat_room_id");

    if (!user) {
      // Show guest form for unauthenticated users
      setShowGuestForm(true);
      return;
    }

    // Initialize chat for authenticated user
    initializeChatMutation({
      roomId: roomId ? parseInt(roomId) : null,
    });
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    if (!guestInfo.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const roomId = sessionStorage.getItem("chat_room_id");

    initializeChatMutation({
      roomId: roomId ? parseInt(roomId) : null,
      guestName: guestInfo.name.trim(),
      guestEmail: guestInfo.email.trim() || null,
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const messageContent = inputMessage.trim();
    if (!messageContent && !selectedFile) return;
    if (!sessionId) return;

    // Prevent sending if conversation is closed or resolved
    if (conversationStatus === "CLOSED" || conversationStatus === "RESOLVED") {
      const status = conversationStatus === "CLOSED" ? "closed" : "resolved";
      toast.error(`Cannot send message. Conversation has been ${status}.`);
      return;
    }

    setIsSending(true);

    try {
      const messageType = selectedFile
        ? selectedFile.type.startsWith("image/")
          ? "IMAGE"
          : "FILE"
        : "TEXT";

      let fileUrl = null;
      if (selectedFile) {
        fileUrl = await uploadFileToS3(selectedFile, "chat");
      }

      sendWebSocketMessage("/app/chat/send", {
        sessionId,
        content: messageContent,
        messageType,
        fileUrl,
        senderName: user ? user?.fullName : guestInfo.name,
      });

      // Clear input
      setInputMessage("");
      setSelectedFile(null);

      // Send typing indicator stop
      if (isTyping) {
        sendWebSocketMessage(`/app/chat/${sessionId}/typing`, {
          typing: false,
          senderName: user ? user?.fullName : guestInfo.name,
        });
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    // Don't send typing indicator if conversation is closed or resolved
    if (conversationStatus === "CLOSED" || conversationStatus === "RESOLVED")
      return;

    // Send typing indicator
    if (!isTyping && sessionId) {
      setIsTyping(true);
      sendWebSocketMessage(`/app/chat/${sessionId}/typing`, {
        typing: true,
        senderName: user ? user?.fullName : guestInfo.name,
      });

      // Clear timeout cũ mỗi lần gõ
      clearTimeout(typingTimeoutRef.current);

      // Set timeout mới: sau 3s ngừng gõ thì gửi typing: false
      typingTimeoutRef.current = setTimeout(() => {
        sendWebSocketMessage(`/app/chat/${sessionId}/typing`, {
          typing: false,
          senderName: "ADMIN",
        });
        setIsTyping(false);
      }, 3000);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Prevent file selection if conversation is closed or resolved
    if (conversationStatus === "CLOSED" || conversationStatus === "RESOLVED") {
      const status = conversationStatus === "CLOSED" ? "closed" : "resolved";
      toast.error(`Cannot attach file. Conversation has been ${status}.`);
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("File type not supported");
      return;
    }

    setSelectedFile(file);
  };

  // Function to get status display info
  const getStatusDisplayInfo = () => {
    switch (conversationStatus) {
      case "RESOLVED":
        return {
          icon: <CheckCircle size={16} className="text-green-600" />,
          bgColor: "bg-green-50",
          textColor: "text-green-800",
          borderColor: "border-green-200",
        };
      case "CLOSED":
        return {
          icon: <X size={16} className="text-red-600" />,
          bgColor: "bg-red-50",
          textColor: "text-red-800",
          borderColor: "border-red-200",
        };
      default:
        return null;
    }
  };

  // Function to get disabled message based on status
  const getDisabledMessage = () => {
    switch (conversationStatus) {
      case "RESOLVED":
        return {
          title: "Conversation Resolved",
          description: "This conversation has been marked as resolved",
        };
      case "CLOSED":
        return {
          title: "Chat is currently unavailable",
          description: "This conversation has been closed",
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusDisplayInfo();
  const disabledMessage = getDisabledMessage();
  const isInputDisabled =
    conversationStatus === "CLOSED" || conversationStatus === "RESOLVED";

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-22 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[70vh] min-h-[400px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-t-lg flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <h3 className="font-semibold">Live Support</h3>
            <p className="text-xs text-orange-100">
              {isConnected ? "Online" : "Connecting..."}
            </p>
          </div>
        </div>
        <button
          onClick={closeChat}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      {/* Conversation Status Banner */}
      {statusInfo && statusMessage && (
        <div
          className={`px-4 py-2 border-b ${statusInfo.bgColor} ${statusInfo.borderColor} flex-shrink-0`}
        >
          <div className="flex items-center space-x-2">
            {statusInfo.icon}
            <p className={`text-sm font-medium ${statusInfo.textColor}`}>
              {statusMessage}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {showGuestForm ? (
          /* Guest Information Form */
          <div className="p-4 space-y-4 overflow-y-auto">
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-2">
                Welcome to Live Support!
              </h4>
              <p className="text-sm text-gray-600">
                Please provide your information to start chatting
              </p>
            </div>

            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={guestInfo.name}
                  onChange={(e) =>
                    setGuestInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="main-input !py-2 !rounded-md"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) =>
                    setGuestInfo((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="main-input !py-2 !rounded-md"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={initializeChatPending}
                className="main-btn !rounded-md py-2 px-4 w-full disabled:opacity-50"
              >
                {initializeChatPending ? "Starting Chat..." : "Start Chat"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-4 space-y-2">
                {initializeChatPending && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading chat...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center text-gray-500">
                      <Smile size={32} className="mx-auto mb-2 text-gray-400" />
                      <p>Start a conversation!</p>
                      <p className="text-xs">We're here to help you 24/7</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <Message
                      key={message.id || index}
                      message={message}
                      isOwn={message.senderType === "USER"}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Selected File Preview */}
            {selectedFile && (
              <div className="px-4 pb-2 flex-shrink-0">
                <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-orange-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-orange-600">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-orange-600 hover:text-orange-800 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {typingIndicator.typing &&
              typingIndicator.senderName === "ADMIN" && (
                <div className="flex-shrink-0">
                  <TypingIndicator senderName="Admin" isAdmin={true} />
                </div>
              )}

            {/* Input Area */}
            <div
              className={`border-t border-gray-200 p-4 flex-shrink-0 ${
                isInputDisabled ? "bg-gray-50 rounded-b-lg" : ""
              }`}
            >
              {isInputDisabled && disabledMessage ? (
                // Disabled input area for closed/resolved conversations
                <div className="flex items-center justify-center py-4">
                  <div className="text-center text-gray-500">
                    <AlertCircle
                      size={24}
                      className="mx-auto mb-2 text-gray-400"
                    />
                    <p className="text-sm font-medium">
                      {disabledMessage.title}
                    </p>
                    <p className="text-xs">{disabledMessage.description}</p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center space-x-2"
                >
                  <div className="flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={handleInputChange}
                      placeholder="Type your message..."
                      className="main-input !py-2 h-10 !rounded-lg resize-none text-sm w-full"
                      disabled={isInputDisabled}
                    />
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.txt,.doc,.docx"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isInputDisabled}
                    className="p-2 text-gray-500 border border-gray-300 rounded-lg hover:text-yellow-500 transition duration-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Attach file"
                  >
                    <Paperclip size={20} />
                  </button>

                  <button
                    type="submit"
                    disabled={
                      (!inputMessage.trim() && !selectedFile) ||
                      isSending ||
                      isInputDisabled
                    }
                    className="main-btn h-[38px] aspect-square shrink-0 !rounded-lg disabled:opacity-50"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white-500"></div>
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;

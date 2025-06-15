import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, X, User, Smile, Paperclip } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useWebSocket } from "../../hooks/useWebSocket";
import Message from "./Message";
import { toast } from "react-toastify";
import { useChatContext } from "../../context/ChatContext";
import { chatService } from "../../service/chat-service";
import { useAuth } from "../../hooks/useAuth";
import { uploadFileToS3 } from "../../utils/upload-file-to-s3";

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
  const { user } = useAuth();

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const { mutate: initializeChatMutation, isPending: initializeChatPending } =
    useMutation({
      mutationFn: chatService.initializeChat,
      onSuccess: (response) => {
        if (response?.status === 201) {
          console.log(response?.data);
          setSessionId(response?.data?.sessionId);
          setMessages(response?.data?.messages || []);
          setIsInitialized(true);
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

  // Initialize WebSocket connection
  const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocket(
    sessionId,
    useCallback(
      (message) => {
        addMessage(message);
        // Auto-scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      [addMessage]
    )
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        senderName: user ? null : guestInfo.name,
      });

      // Clear input
      setInputMessage("");
      setSelectedFile(null);

      // Send typing indicator stop
      if (isTyping) {
        sendWebSocketMessage(`/app/chat/${sessionId}/typing`, {
          typing: false,
          senderName: guestInfo.name || "User",
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

    // Send typing indicator
    if (!isTyping && sessionId) {
      setIsTyping(true);
      sendWebSocketMessage(`/app/chat/${sessionId}/typing`, {
        typing: true,
        senderName: guestInfo.name || "User",
      });

      // Stop typing indicator after 3 seconds
      setTimeout(() => {
        if (isTyping) {
          sendWebSocketMessage(`/app/chat/${sessionId}/typing`, {
            typing: false,
            senderName: guestInfo.name || "User",
          });
          setIsTyping(false);
        }
      }, 3000);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-22 right-6 w-80 h-[408px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-t-lg flex items-center justify-between">
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
          className="text-white/80 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {showGuestForm ? (
          /* Guest Information Form */
          <div className="p-4 space-y-4">
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
            {/* Messages */}
            <div className="relative flex-1 overflow-y-auto pt-4 space-y-2 max-h-[264px]">
              <div className="px-4">
                {initializeChatPending && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading chat...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
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

              {selectedFile && (
                <div className="sticky bottom-0 bg-white p-4 z-10 border-t border-[#eaeaea]">
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
                      className="text-orange-600 hover:text-orange-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
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
                    className="main-input !py-2 h-10 !rounded-lg resize-none text-sm"
                    disabled={false}
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
                  className="p-2 text-gray-500 border border-gray-300 rounded-lg hover:text-yellow-500 transition duration-500"
                  title="Attach file"
                >
                  <Paperclip size={20} />
                </button>

                <button
                  type="submit"
                  disabled={
                    (!inputMessage.trim() && !selectedFile) || isSending
                  }
                  className="main-btn h-[38px] aspect-square shrink-0 !rounded-lg disabled:opacity-50"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white-500 mr-1"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;

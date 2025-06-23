import React, { useEffect, useRef, useState, useCallback } from "react";
import formatDate from "../../../utils/format-date";
import {
  Download,
  FileText,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  User,
  X,
  CheckCheck,
  Lock,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { chatService } from "../../../service/chat-service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useWebSocket } from "../../../hooks/useWebSocket";
import { uploadFileToS3 } from "../../../utils/upload-file-to-s3";
import { toast } from "react-toastify";
import TypingIndicator from "../../common/TypingIndicator";

const ChatArea = ({
  selectedConversation,
  selectedFile,
  setSelectedFile,
  inputMessage,
  setInputMessage,
}) => {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState({
    senderName: "",
    typing: false,
  });

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastScrollHeight = useRef(0);

  // Check if conversation is resolved
  const isResolved = selectedConversation?.status === "RESOLVED";

  // Fetch messages với infinite query
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: messagesLoading,
    // refetch: refetchMessages,
  } = useInfiniteQuery({
    queryKey: ["messages", selectedConversation?.sessionId],
    queryFn: ({ pageParam = 0 }) =>
      chatService.getMessages({
        sessionId: selectedConversation?.sessionId,
        pageNo: pageParam,
        pageSize: 20,
      }),
    getNextPageParam: (lastPage) => {
      const lastPageData = lastPage?.data;
      const currentPage = lastPageData?.pageNo;
      const hasNextPage = lastPageData?.hasNextPage;
      return hasNextPage ? currentPage + 1 : undefined;
    },
    staleTime: 10000,
    enabled: !!selectedConversation?.sessionId,
  });

  // Xử lý scroll để load tin nhắn cũ hơn
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // Nếu scroll gần đến đầu (20px từ top) và còn có trang tiếp theo
    if (scrollTop < 20 && hasNextPage && !isFetchingNextPage) {
      // Lưu vị trí scroll hiện tại
      lastScrollHeight.current = scrollHeight;
      setShouldScrollToBottom(false);
      fetchNextPage();
    }

    // Nếu scroll gần bottom thì cho phép auto scroll
    if (scrollHeight - scrollTop - clientHeight < 100) {
      setShouldScrollToBottom(true);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Gắn event listener cho scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Cập nhật messages khi có data mới
  useEffect(() => {
    if (messagesData?.pages) {
      // Flatten tất cả các pages và reverse để có thứ tự đúng (cũ -> mới)
      const allMessages = messagesData.pages
        .flatMap((page) => page.data?.items || [])
        .reverse();

      setMessages(allMessages);

      // Nếu không phải lần đầu load, maintain scroll position
      if (lastScrollHeight.current > 0) {
        const container = messagesContainerRef.current;
        if (container) {
          const newScrollHeight = container.scrollHeight;
          const scrollDiff = newScrollHeight - lastScrollHeight.current;
          container.scrollTop = scrollDiff;
        }
        lastScrollHeight.current = 0;
      }
    }
  }, [messagesData]);

  // Auto-scroll to bottom khi có tin nhắn mới hoặc lần đầu load
  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScrollToBottom]);

  // Reset khi chuyển conversation
  useEffect(() => {
    setShouldScrollToBottom(true);
    lastScrollHeight.current = 0;
  }, [selectedConversation?.sessionId]);

  // Initialize WebSocket connection
  const handleWebSocketMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const { sendMessage: sendWebSocketMessage } = useWebSocket(
    selectedConversation?.sessionId,
    handleWebSocketMessage,
    (message) => {
      setTypingIndicator(message);
    }
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Prevent sending if conversation is resolved
    if (isResolved) {
      toast.warning("Cannot send messages to a resolved conversation.");
      return;
    }

    const messageContent = inputMessage.trim();
    if (!messageContent && !selectedFile) return;
    if (!selectedConversation) return;

    const sessionId = selectedConversation?.sessionId;
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
        senderName: "ADMIN",
      });

      // Clear input
      setInputMessage("");
      setSelectedFile(null);

      // Send typing indicator stop
      if (isTyping) {
        sendWebSocketMessage(`/app/chat/${sessionId}/typing`, {
          typing: false,
          senderName: "ADMIN",
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
    // Prevent typing if conversation is resolved
    if (isResolved) return;

    setInputMessage(e.target.value);

    const sessionId = selectedConversation?.sessionId;

    // Send typing indicator
    if (!isTyping && sessionId) {
      setIsTyping(true);
      sendWebSocketMessage(`/app/chat/${sessionId}/typing`, {
        typing: true,
        senderName: "ADMIN",
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
    // Prevent file selection if conversation is resolved
    if (isResolved) {
      toast.warning("Cannot attach files to a resolved conversation.");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
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
      alert(
        "File type not supported. Please select an image, PDF, or document file."
      );
      return;
    }

    setSelectedFile(file);
  };

  const renderMessageContent = (message) => {
    switch (message.messageType) {
      case "IMAGE":
        return (
          <div className="max-w-xs mb-2">
            <img
              src={message.fileUrl || message.content}
              alt="Shared image"
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90"
              onClick={() =>
                window.open(message.fileUrl || message.content, "_blank")
              }
            />
          </div>
        );

      case "FILE":
        return (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-xs mb-2">
            <FileText size={20} className="text-gray-600" />
            <div className="flex-1 min-w-0">
              <a
                href={message.fileUrl || message.content}
                download
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Download size={12} className="mr-1" />
                Download File
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStatusConfig = () => {
    switch (selectedConversation?.status) {
      case "RESOLVED":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          text: "Resolved",
          description: "This conversation has been resolved",
        };
      case "ACTIVE":
        return {
          icon: Clock,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          text: "Active",
          description: "This conversation is active",
        };
      default:
        return {
          icon: AlertTriangle,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          text: "Unknown",
          description: "Status unknown",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="flex-1 flex flex-col">
      {selectedConversation ? (
        <>
          {/* Chat Header */}
          <div
            className={`p-4 border-b ${
              isResolved
                ? "bg-gray-50 border-gray-300"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div
                    className={`w-10 h-10 ${
                      isResolved ? "bg-gray-400" : "bg-gray-300"
                    } rounded-full flex items-center justify-center`}
                  >
                    <User
                      size={20}
                      className={isResolved ? "text-gray-600" : "text-gray-600"}
                    />
                  </div>
                  {selectedConversation.isOnline && !isResolved && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div>
                  <h3
                    className={`font-semibold ${
                      isResolved ? "text-gray-600" : "text-gray-900"
                    }`}
                  >
                    {selectedConversation.guestName || "Anonymous"}
                  </h3>
                  <div
                    className={`flex items-center space-x-2 text-sm ${
                      isResolved ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {selectedConversation?.guestEmail}
                    {selectedConversation.roomName && (
                      <>
                        <span>•</span>
                        <span>{selectedConversation.roomName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
              >
                <statusConfig.icon size={16} className={statusConfig.color} />
                <span className={`text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.text}
                </span>
              </div>
            </div>

            {/* Status Banner for Resolved Conversations */}
            {isResolved && (
              <div className="mt-3 p-3 bg-gray-100 border border-gray-200 rounded-lg flex items-center space-x-2">
                <Lock size={16} className="text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Conversation Resolved
                  </p>
                  <p className="text-xs text-gray-600">
                    This conversation has been marked as resolved. No new
                    messages can be sent.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isResolved ? "bg-gray-25" : ""
            }`}
          >
            {/* Loading indicator for fetching previous messages */}
            {isFetchingNextPage && (
              <div className="flex items-center justify-center p-4">
                <Loader2 size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">
                  Loading previous messages...
                </span>
              </div>
            )}

            {messagesLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderType === "ADMIN" ||
                      message.senderType === "SYSTEM"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                        message.senderType === "ADMIN" ||
                        message.senderType === "SYSTEM"
                          ? isResolved
                            ? "bg-gray-500 text-white"
                            : "bg-blue-600 text-white"
                          : isResolved
                          ? "bg-gray-100 text-gray-700"
                          : "bg-gray-200 text-gray-800"
                      } ${isResolved ? "opacity-75" : ""}`}
                    >
                      {message.senderType === "USER" && (
                        <p
                          className={`text-xs font-semibold mb-1 ${
                            isResolved ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          {message.senderName || "Guest"}
                        </p>
                      )}

                      {renderMessageContent(message)}

                      {message.content && (
                        <p
                          className="text-sm mb-1"
                          style={{ wordBreak: "break-all" }}
                        >
                          {message.content}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <p
                          className={`text-[11px] ${
                            message.senderType === "ADMIN" ||
                            message.senderType === "SYSTEM"
                              ? isResolved
                                ? "text-gray-300"
                                : "text-blue-100"
                              : isResolved
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {formatDate(
                            message?.createdAt || new Date(),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Typing Indicator */}
          {typingIndicator.typing &&
            typingIndicator.senderName !== "ADMIN" &&
            !isResolved && (
              <TypingIndicator
                senderName={typingIndicator.senderName}
                isAdmin={false}
              />
            )}

          {/* File Preview */}
          {selectedFile && !isResolved && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div
            className={`p-4 border-t ${
              isResolved
                ? "bg-gray-50 border-gray-300"
                : "bg-white border-gray-200"
            }`}
          >
            {isResolved ? (
              /* Resolved State Input - Disabled */
              <div className="flex items-center space-x-2 opacity-60">
                <div className="flex-1">
                  <div className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg flex items-center space-x-2 text-gray-500">
                    <Lock size={16} />
                    <span className="text-sm">
                      This conversation has been resolved. You cannot send new
                      messages.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="h-[50px] w-[50px] grid place-items-center text-gray-400 border border-gray-300 rounded-lg cursor-not-allowed"
                  title="Cannot attach files to resolved conversation"
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="button"
                  disabled
                  className="h-[50px] w-[50px] grid place-items-center bg-gray-400 text-white rounded-lg cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            ) : (
              /* Active State Input - Normal */
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-2"
              >
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="1"
                    style={{ minHeight: "50px", maxHeight: "120px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
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
                  className="h-[50px] w-[50px] grid place-items-center text-gray-500 border border-gray-300 rounded-lg hover:text-blue-600 hover:border-blue-300 transition-colors"
                  title="Attach file"
                >
                  <Paperclip size={20} />
                </button>

                <button
                  type="submit"
                  disabled={
                    (!inputMessage.trim() && !selectedFile) || isSending
                  }
                  className="h-[50px] w-[50px] grid place-items-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </form>
            )}
          </div>
        </>
      ) : (
        /* No Conversation Selected */
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-500">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;

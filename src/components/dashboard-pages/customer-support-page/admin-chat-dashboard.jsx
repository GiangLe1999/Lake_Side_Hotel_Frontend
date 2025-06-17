import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Search,
  User,
  MessageSquare,
  Paperclip,
  X,
  Download,
  FileText,
  Image as ImageIcon,
  Settings,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { chatService } from "../../../service/chat-service";

const AdminChatDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch conversations với infinite query cho pagination
  const {
    data: conversationsData,
    fetchNextPage,
    // Nếu hàm getNextPageParam trả về số page tiếp theo (ví dụ: currentPage + 1) → hasNextPage = true
    hasNextPage,
    isFetchingNextPage,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useInfiniteQuery({
    queryKey: ["conversations", searchQuery, filterStatus],
    queryFn: ({ pageParam = 0 }) =>
      chatService.getConversations({
        // pageParam: Giá trị React Query tự truyền — là số trang hiện tại cần fetch. Default = 0 (trang đầu)
        pageNo: pageParam,
        pageSize: 10,
        search: searchQuery,
        sortBy: "desc",
        status: filterStatus,
      }),
    // Xác định số trang tiếp theo
    // lastPage: kết quả của API cuối cùng vừa fetch về.
    // allPages: tất cả các trang đã fetch.
    getNextPageParam: (lastPage) => {
      const lastPageData = lastPage?.data;
      const currentPage = lastPageData?.pageNo;
      const hasNextPage = lastPageData?.hasNextPage;
      // Nếu còn trang → trả currentPage + 1
      // Nếu hết → trả undefined (nghĩa là không load thêm nữa)
      return hasNextPage ? currentPage + 1 : undefined;
    },
    staleTime: 30000, // Cache for 30 seconds
    enabled: true,
  });

  // Fetch messages for selected conversation
  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", selectedConversation?.sessionId],
    queryFn: () => chatService.getMessages(selectedConversation.sessionId),
    enabled: !!selectedConversation?.sessionId,
    staleTime: 10000, // Cache for 10 seconds
  });

  // Flatten conversations from all pages
  const conversations =
    conversationsData?.pages.flatMap((page) => page.data.items) || [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update messages when data is fetched
  useEffect(() => {
    if (messagesData?.data) {
      setMessages(messagesData.data);
    }
  }, [messagesData]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetchConversations();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterStatus, refetchConversations]);

  // Intersection Observer for infinite scroll
  const lastConversationElementRef = useCallback(
    // node chính là DOM element được gán ref — phần tử cuối cùng trong danh sách hiển thị (last item trong list)
    (node) => {
      // Nếu đang load data (lần đầu) hoặc đang fetch thêm page → không làm gì cả
      if (conversationsLoading || isFetchingNextPage) return;

      // Tạo mới IntersectionObserver
      // Khi phần tử được quan sát (node) đi vào vùng nhìn thấy của màn hình (viewport)
      // Nếu còn page (hasNextPage === true) → gọi fetchNextPage() để load thêm data
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      // Nếu phần tử tồn tại → bắt đầu quan sát nó
      if (node) observer.observe(node);

      // Khi component unmount hoặc node thay đổi → dừng quan sát để tránh memory leak
      return () => {
        if (node) observer.unobserve(node);
      };
    },
    [conversationsLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);

    // Mark conversation as read if it has unread messages
    if (conversation.unreadCount > 0) {
      // Call API to mark as read
      chatService.markAsRead(conversation.sessionId).then(() => {
        refetchConversations();
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const messageContent = inputMessage.trim();
    if (!messageContent && !selectedFile) return;
    if (!selectedConversation) return;

    setIsSending(true);

    try {
      let messageData;

      if (selectedFile) {
        // Handle file upload
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("sessionId", selectedConversation.sessionId);
        formData.append("content", messageContent);

        messageData = await chatService.sendFileMessage(formData);
      } else {
        // Handle text message
        messageData = await chatService.sendMessage({
          sessionId: selectedConversation.sessionId,
          content: messageContent,
          messageType: "TEXT",
        });
      }

      // Add message to current conversation immediately for better UX
      const newMessage = {
        id: Date.now(),
        content: messageContent,
        messageType: selectedFile
          ? selectedFile.type.startsWith("image/")
            ? "IMAGE"
            : "FILE"
          : "TEXT",
        senderType: "ADMIN",
        senderName: "Support Agent",
        createdAt: new Date().toISOString(),
        fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Clear input
      setInputMessage("");
      setSelectedFile(null);

      // Refetch conversations to update last message
      refetchConversations();

      // Refetch messages to get the actual sent message
      setTimeout(() => {
        refetchMessages();
      }, 500);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Show error message to user
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = (e) => {
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString();
    }
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

  const getStatusFilterValue = (status) => {
    switch (status) {
      case "all":
        return "ALL";
      case "active":
        return "ACTIVE";
      case "resolved":
        return "RESOLVED";
      default:
        return "ALL";
    }
  };

  return (
    <div className="h-[calc(100vh-126px)] flex rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Reply to Customers
            </h2>
            <button
              onClick={() => refetchConversations()}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Refresh conversations"
            >
              <Settings size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex mt-3 bg-gray-100 rounded-lg p-1">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "resolved", label: "Resolved" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() =>
                  setFilterStatus(getStatusFilterValue(filter.key))
                }
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
                  filterStatus === getStatusFilterValue(filter.key)
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversationsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {conversations.map((conversation, index) => (
                <div
                  key={conversation?.id}
                  ref={
                    // Khi phần tử cuối cùng (last item) xuất hiện trong vùng nhìn của người dùng (viewport) — tự động gọi API load thêm page tiếp theo
                    index === conversations.length - 1
                      ? lastConversationElementRef
                      : null
                  }
                  onClick={() => handleConversationSelect(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation?.id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                        {conversation?.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 truncate leading-tight">
                              {conversation?.userName ||
                                conversation?.guestName}
                            </h3>
                            <span className="text-xs text-gray-500 truncate max-w-24">
                              {conversation?.userEmail ||
                                conversation?.guestEmail}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            {conversation?.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {conversation?.unreadCount}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 mt-1">
                              {formatTime(conversation?.lastMessageAt || "")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {conversation?.roomName && (
                        <p className="text-xs text-blue-600 mb-1">
                          #{conversation?.roomName | "1341"}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation?.messages?.[messages.length - 1]
                          ?.content || "No messages yet"}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            conversation?.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {conversation?.status === "ACTIVE"
                            ? "Active"
                            : "Resolved"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isFetchingNextPage && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 size={20} className="animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Loading more...
                  </span>
                </div>
              )}

              {/* No more data indicator */}
              {!hasNextPage && conversations.length > 0 && (
                <div className="text-center p-4 text-sm text-gray-500">
                  No more conversations
                </div>
              )}

              {/* No conversations found */}
              {!conversationsLoading && conversations.length === 0 && (
                <div className="text-center p-8">
                  <MessageSquare
                    size={48}
                    className="mx-auto text-gray-400 mb-2"
                  />
                  <p className="text-gray-500">No conversations found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  {selectedConversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.guestName || "Anonymous"}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {selectedConversation.isOnline ? (
                      <span>Online</span>
                    ) : (
                      <span>Offline</span>
                    )}
                    {selectedConversation.roomName && (
                      <>
                        <span>•</span>
                        <span>{selectedConversation.roomName}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderType === "ADMIN"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                          message.senderType === "ADMIN"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {message.senderType === "USER" && (
                          <p className="text-xs font-semibold mb-1 text-gray-600">
                            {message.senderName || "Guest"}
                          </p>
                        )}

                        {renderMessageContent(message)}

                        {message.content && (
                          <p className="text-sm mb-1">{message.content}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs ${
                              message.senderType === "ADMIN"
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>

                          {message.senderType === "ADMIN" && (
                            <CheckCheck size={12} className="text-blue-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* File Preview */}
            {selectedFile && (
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
            <div className="p-4 border-t border-gray-200 bg-white">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-2"
              >
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
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
    </div>
  );
};

export default AdminChatDashboard;

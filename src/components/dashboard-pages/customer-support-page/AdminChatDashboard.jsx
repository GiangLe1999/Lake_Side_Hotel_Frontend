import React, { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { chatService } from "../../../service/chat-service";
import Conversations from "./Conversations";
import ChatArea from "./ChatArea";
import ChatHeader from "./ChatHeader";

const AdminChatDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

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

  // Flatten conversations from all pages
  const conversations =
    conversationsData?.pages.flatMap((page) => page.data.items) || [];

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

  return (
    <div className="h-[calc(100vh-126px)] flex rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <ChatHeader
          refetchConversations={refetchConversations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Conversations */}
        <Conversations
          conversationsLoading={conversationsLoading}
          conversations={conversations}
          lastConversationElementRef={lastConversationElementRef}
          handleConversationSelect={handleConversationSelect}
          selectedConversation={selectedConversation}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
        />
      </div>

      {/* Chat Area */}
      <ChatArea
        selectedConversation={selectedConversation}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        refetchConversations={refetchConversations}
      />
    </div>
  );
};

export default AdminChatDashboard;

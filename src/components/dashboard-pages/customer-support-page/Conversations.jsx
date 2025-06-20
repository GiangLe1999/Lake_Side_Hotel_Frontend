import React from "react";
import formatDate from "../../../utils/format-date";
import { Loader2, MessageSquare, User } from "lucide-react";

const Conversations = ({
  conversationsLoading,
  conversations,
  lastConversationElementRef,
  handleConversationSelect,
  selectedConversation,
  isFetchingNextPage,
  hasNextPage,
}) => {
  return (
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
                          {conversation?.userName || conversation?.guestName}
                        </h3>
                        <p className="text-xs text-gray-500 truncate max-w-28">
                          {conversation?.userEmail || conversation?.guestEmail}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        {conversation?.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {conversation?.unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 mt-1">
                          {formatDate(
                            conversation?.lastMessageAt || "",
                            "dd/MM/yyyy"
                          )}
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
                    {conversation?.messages?.[
                      conversation?.messages?.length - 1
                    ]?.content || "No messages yet"}
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
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No conversations found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Conversations;

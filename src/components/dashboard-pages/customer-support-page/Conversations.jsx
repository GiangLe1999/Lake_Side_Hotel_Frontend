import React, { useState } from "react";
import formatDate from "../../../utils/format-date";
import {
  Loader2,
  MessageSquare,
  User,
  MoreVertical,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Mail,
  MailOpen,
  Clock,
  CheckCircle,
} from "lucide-react";
import { chatService } from "../../../service/chat-service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Conversations = ({
  conversationsLoading,
  conversations,
  lastConversationElementRef,
  handleConversationSelect,
  selectedConversation,
  setSelectedConversation,
  isFetchingNextPage,
  hasNextPage,
  refetchConversations,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { mutate: toggleStatusMutation } = useMutation({
    mutationFn: chatService.toggleConversationStatus,
    onSuccess: (response) => {
      if (response.status == 200) {
        refetchConversations();
        if (response.data == selectedConversation.sessionId) {
          setSelectedConversation((prev) =>
            prev.status === "ACTIVE"
              ? { ...prev, status: "RESOLVED" }
              : { ...prev, status: "ACTIVE" }
          );
        }
        toast.success("Conversation status updated.");
      }
    },
    onError: (err) => {
      toast.error("Failed to update status: " + err.message);
    },
  });
  const handleStatusToggle = (conversation, e) => {
    e.stopPropagation();
    const newStatus = conversation.status === "ACTIVE" ? "RESOLVED" : "ACTIVE";

    toggleStatusMutation({
      sessionId: conversation.sessionId,
      status: newStatus,
    });
    setDropdownOpen(null);
  };

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (sessionId) => chatService.markConversationAsRead(sessionId),
    onSuccess: () => {
      refetchConversations();
    },
    onError: (err) => {
      console.error("Failed to mark as read: " + err.message);
    },
  });
  const handleMarkAsRead = (conversation, e) => {
    e.stopPropagation();
    if (isUnread(conversation)) {
      markAsReadMutation(conversation.sessionId);
    }
    setDropdownOpen(null);
  };

  const handleDeleteClick = (conversationId, e) => {
    e.stopPropagation();
    setDeleteConfirm(conversationId);
    setDropdownOpen(null);
  };

  const { mutate: comfirmDeleteMutation } = useMutation({
    mutationFn: chatService.deleteConversation,
    onSuccess: () => {
      refetchConversations();
      setSelectedConversation(null);
      toast.success("Delete conversation successfully.");
    },
    onError: (err) => {
      toast.error("Failed to delete conversation: " + err.message);
    },
  });
  const confirmDelete = async (sessionId, e) => {
    e.stopPropagation();
    comfirmDeleteMutation(sessionId);
    setDeleteConfirm(null);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeleteConfirm(null);
  };

  const toggleDropdown = (conversationId, e) => {
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === conversationId ? null : conversationId);
  };

  // Helper function to determine if conversation is unread
  const isUnread = (conversation) => !conversation?.isReadByAdmin;

  return (
    <div className="flex-1 overflow-y-auto">
      {conversationsLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {conversations.map((conversation, index) => {
            const unread = isUnread(conversation);

            return (
              <div
                key={conversation?.id}
                ref={
                  index === conversations.length - 1
                    ? lastConversationElementRef
                    : null
                }
                onClick={() => handleConversationSelect(conversation)}
                className={`group relative p-4 border-b cursor-pointer transition-all duration-200 border-gray-100 bg-white hover:bg-gray-50 ${
                  selectedConversation?.id === conversation?.id
                    ? "!bg-gray-100" // Only selected conversations have different background
                    : ""
                }`}
              >
                {/* Delete Confirmation Overlay */}
                {deleteConfirm === conversation.id && (
                  <div className="absolute inset-0 bg-red-50 border-2 border-red-200 rounded-lg z-10 flex items-center justify-center">
                    <div className="text-center p-4">
                      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-red-800 mb-3">
                        Delete this conversation?
                      </p>
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={(e) =>
                            confirmDelete(conversation.sessionId, e)
                          }
                          className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  {/* Avatar - same style for all */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300">
                      <User size={20} className="text-gray-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="truncate leading-tight font-medium text-gray-700">
                            {conversation?.userName || conversation?.guestName}
                          </h3>
                          {conversation?.roomName && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                              #{conversation?.roomName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs truncate max-w-32 mt-0.5 text-gray-500">
                          {conversation?.userEmail || conversation?.guestEmail}
                        </p>
                      </div>

                      {/* Right side info */}
                      <div className="flex items-center space-x-2 ml-1">
                        <span className="text-xs whitespace-nowrap text-gray-500 -mt-1">
                          {formatDate(
                            conversation?.lastMessageAt || "",
                            "dd/MM/yyyy"
                          )}
                        </span>

                        {/* Actions Dropdown */}
                        <div className="relative">
                          <button
                            onClick={(e) => toggleDropdown(conversation.id, e)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {dropdownOpen === conversation.id && (
                            <>
                              {/* Backdrop */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setDropdownOpen(null)}
                              />

                              {/* Dropdown Menu */}
                              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[160px]">
                                <button
                                  onClick={(e) =>
                                    handleMarkAsRead(conversation, e)
                                  }
                                  disabled={!unread}
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2 transition-colors ${
                                    !unread
                                      ? "text-gray-400 cursor-not-allowed"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <CheckCheck size={14} />
                                  <span>Mark as read</span>
                                </button>

                                <button
                                  onClick={(e) =>
                                    handleStatusToggle(conversation, e)
                                  }
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                                >
                                  <Check size={14} />
                                  <span>
                                    Mark as{" "}
                                    {conversation.status === "ACTIVE"
                                      ? "resolved"
                                      : "active"}
                                  </span>
                                </button>

                                <hr className="my-1 border-gray-100" />

                                <button
                                  onClick={(e) =>
                                    handleDeleteClick(conversation.id, e)
                                  }
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                                >
                                  <Trash2 size={14} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Last message */}
                    <div className="mt-2">
                      <p className="text-sm truncate text-gray-600">
                        {conversation?.lastMessage || "No messages yet"}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="text-[10px] flex items-center gap-2 mt-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-[2px] rounded-full font-medium flex items-center gap-1 transition-colors ${
                            conversation?.status === "ACTIVE"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-green-100 text-green-700 border border-green-200"
                          }`}
                        >
                          {conversation?.status === "ACTIVE" ? (
                            <>
                              <Clock size={10} /> Active
                            </>
                          ) : (
                            <>
                              <CheckCircle size={10} />
                              Resolved
                            </>
                          )}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-[2px] rounded-full font-medium transition-colors flex items-center gap-1   ${
                          unread
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        {unread ? (
                          <>
                            <Mail size={10} /> Unread
                          </>
                        ) : (
                          <>
                            <MailOpen size={10} className="-mt-[2px]" /> Read
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

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

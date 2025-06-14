import React from "react";
import { MessageCircle, X } from "lucide-react";
import { useChatContext } from "../../context/ChatContext";

const LiveChatButton = ({ roomId = null, className = "" }) => {
  const { isOpen, openChat, closeChat, unreadCount } = useChatContext();

  const handleClick = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat(roomId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        fixed bottom-6 right-6 z-50 flex items-center justify-center
        w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-500
        text-white rounded-full shadow-lg hover:shadow-xl
        transform hover:scale-110 transition duration-500
        ${className}
      `}
      aria-label={isOpen ? "Close Live Chat" : "Open Live Chat"}
    >
      {isOpen ? (
        <X size={24} />
      ) : (
        <div className="relative">
          <MessageCircle size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      )}
    </button>
  );
};

export default LiveChatButton;

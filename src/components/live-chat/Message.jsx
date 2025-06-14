import React from "react";
import { Download, Image as ImageIcon, FileText } from "lucide-react";

const Message = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case "IMAGE":
        return (
          <div className="max-w-xs">
            <img
              src={message.fileUrl}
              alt="Shared image"
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90"
              onClick={() => window.open(message.fileUrl, "_blank")}
            />
            {message.content && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );

      case "FILE":
        return (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-xs">
            <FileText size={20} className="text-gray-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {message.content}
              </p>
              <a
                href={message.fileUrl}
                download
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Download size={12} className="mr-1" />
                Download
              </a>
            </div>
          </div>
        );

      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold mb-1 text-gray-600">
            {message.senderName || "Support Agent"}
          </p>
        )}
        {renderMessageContent()}
        <p
          className={`text-xs mt-1 ${
            isOwn ? "text-orange-100" : "text-gray-500"
          }`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default Message;

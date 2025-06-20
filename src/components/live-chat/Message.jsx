import React from "react";
import { Download, Image as ImageIcon, FileText } from "lucide-react";
import formatDate from "../../utils/format-date";

const Message = ({ message, isOwn }) => {
  const renderMessageContent = () => {
    switch (message.messageType) {
      case "IMAGE":
        return (
          <div className="max-w-xs">
            <img
              src={message.fileUrl}
              alt="Shared image"
              className="rounded-t-lg max-w-full h-auto cursor-pointer hover:opacity-90"
              onClick={() => window.open(message.fileUrl, "_blank")}
            />
          </div>
        );

      case "FILE":
        return (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-t-lg max-w-xs">
            <FileText size={20} className="text-gray-600" />
            <div className="flex-1 min-w-0">
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
        return;
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md rounded-lg ${
          isOwn ? "bg-[#e06c00] text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {!isOwn && message.messageType === "TEXT" && (
          <p className="text-xs font-semibold text-gray-600 p-4 pb-0">ADMIN</p>
        )}
        {renderMessageContent()}
        <div className="px-4 py-2">
          <p className="text-sm">{message.content}</p>
          <p
            className={`text-[10px] mt-1 ${
              isOwn ? "text-orange-100" : "text-gray-500"
            }`}
          >
            {formatDate(message.createdAt, "hh:mm a")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;

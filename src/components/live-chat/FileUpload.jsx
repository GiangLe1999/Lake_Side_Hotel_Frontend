import React, { useRef } from "react";
import { Paperclip, X } from "lucide-react";
import { toast } from "react-toastify";

const FileUpload = ({ onFileSelect, selectedFile, onRemoveFile }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
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

    onFileSelect(file);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.txt,.doc,.docx"
      />

      {selectedFile ? (
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
            onClick={onRemoveFile}
            className="text-orange-600 hover:text-orange-800"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 border border-gray-300 rounded-lg hover:text-yellow-500 transition duration-500"
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>
      )}
    </div>
  );
};

export default FileUpload;

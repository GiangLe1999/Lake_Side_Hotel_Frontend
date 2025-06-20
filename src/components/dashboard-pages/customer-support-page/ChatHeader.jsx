import { Search, Settings } from "lucide-react";
import React from "react";

const ChatHeader = ({
  refetchConversations,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
}) => {
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
            onClick={() => setFilterStatus(getStatusFilterValue(filter.key))}
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
  );
};

export default ChatHeader;

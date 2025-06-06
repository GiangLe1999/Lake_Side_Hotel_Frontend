import React from "react";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white-500 mr-1"></div>
      Processing...
    </div>
  );
};

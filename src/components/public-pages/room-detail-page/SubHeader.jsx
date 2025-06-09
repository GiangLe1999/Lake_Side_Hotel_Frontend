import { ArrowLeft, Heart, Share2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubHeader = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white sticky top-16 z-[49] shadow">
      <div className="container mx-auto px-4 py-[15px]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "text-red-500 fill-current" : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;

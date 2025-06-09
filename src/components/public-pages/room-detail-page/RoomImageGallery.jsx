import { Camera, Star } from "lucide-react";
import React, { useState } from "react";
import { getPublicS3Url } from "../../../utils/get-s3-url";

const RoomImageGallery = ({ room }) => {
  const fetchedImages = room?.imageKeys?.map((key) => {
    return getPublicS3Url(key);
  });
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 overflow-hidden">
      <div className="relative">
        <img
          src={fetchedImages?.[selectedImage]}
          alt={room?.type}
          className="w-full h-96 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Camera className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium">
            {selectedImage + 1} / {fetchedImages?.length}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto">
          {fetchedImages?.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-yellow-500"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img src={image} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomImageGallery;

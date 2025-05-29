import { Camera, Star } from "lucide-react";
import React, { useState } from "react";

// Mock data - thay thế bằng data thực từ API
const room = {
  images: [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop",
  ],
  type: "Tesst",
};

const RoomImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 overflow-hidden">
      <div className="relative">
        <img
          src={room.images[selectedImage]}
          alt={room.type}
          className="w-full h-96 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Camera className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium">
            {selectedImage + 1} / {room.images.length}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto">
          {room.images.map((image, index) => (
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

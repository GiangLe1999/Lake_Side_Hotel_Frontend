import React, { useState } from "react";
import { getPublicS3Url } from "../../utils/get-s3-url";
import { Heart, MapPin, Star, Users } from "lucide-react";
import formatPriceUSD from "../../utils/format-price";
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
  const [favoriteRooms, setFavoriteRooms] = useState(new Set());

  const toggleFavorite = (roomId) => {
    const newFavorites = new Set(favoriteRooms);
    if (newFavorites.has(roomId)) {
      newFavorites.delete(roomId);
    } else {
      newFavorites.add(roomId);
    }
    setFavoriteRooms(newFavorites);
  };

  return (
    <Link to={`/room/${room.id}`} key={room.id} className="group">
      <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden relative">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={getPublicS3Url(room?.thumbnailKey || "")}
            alt={room?.type}
            className="w-full h-64 object-cover transition-transform duration-700"
          />

          <button
            onClick={() => toggleFavorite(room?.id)}
            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg"
          >
            <Heart
              size={18}
              className={
                favoriteRooms.has(room?.id)
                  ? "text-red-500 fill-current"
                  : "text-gray-600"
              }
            />
          </button>

          {/* Rating Badge */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-bold text-gray-800">{4.8}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
              {room?.type}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {room?.description}
            </p>
          </div>

          {/* Room Details */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {room?.area}m<span className="text-[9px] -mt-2">2</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {room?.beds}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {room?.amenities?.slice(0, 3).map((amenity, amenityIndex) => (
                <span
                  key={amenityIndex}
                  className="bg-gradient-to-r from-yellow-100 to-orange-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium border border-yellow-100"
                >
                  {amenity}
                </span>
              ))}
            </div>

            {/* Additional Features */}
            <div className="text-xs text-gray-500">
              {room?.amenities?.slice(3, 0).join(" • ")}
            </div>
          </div>

          {/* Reviews */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(room.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span>({124} reviews)</span>
          </div>

          {/* Price and Booking */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {formatPriceUSD(room?.price)}
                </span>
              </div>
              <p className="text-sm text-gray-500">per night</p>
            </div>
            <button className="main-btn px-6 py-3 rounded-xl font-semibold">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;

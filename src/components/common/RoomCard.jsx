import React, { useState } from "react";
import { getPublicS3Url } from "../../utils/get-s3-url";
import { Heart, MapPin, Star, Users } from "lucide-react";
import formatPriceUSD from "../../utils/format-price";
import { Link } from "react-router-dom";

const RoomCard = ({ room, view = "grid" }) => {
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (roomId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(roomId)) {
      newFavorites.delete(roomId);
    } else {
      newFavorites.add(roomId);
    }
    setFavorites(newFavorites);
  };

  if (view === "list") {
    return (
      <Link
        to={`/room/${room?.id}`}
        className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-80 h-48 md:h-auto">
            <img
              src={getPublicS3Url(room?.thumbnailKey || "")}
              alt={room?.type}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => toggleFavorite(room?.id)}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300"
            >
              <Heart
                size={16}
                className={
                  favorites.has(room?.id)
                    ? "text-red-500 fill-current"
                    : "text-gray-600"
                }
              />
            </button>
          </div>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {room?.type}
                </h3>
                <p className="text-gray-600 text-sm">{room?.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">
                  {formatPriceUSD(room?.price)}
                </div>
                <div className="text-sm text-gray-500">per night</div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {room?.area}m²
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {room?.beds} bed{room.beds > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                {room?.avgRating} ({room?.reviewCount || 0} reviews)
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {room?.amenities?.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs"
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                  +{room?.amenities?.length - 3} more
                </span>
              )}
            </div>

            {/* Additional Features */}
            <div className="text-xs text-gray-500">
              {room?.features?.slice(0, 3).join(" • ")}
            </div>

            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Book Now
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/room/${room.id}`}
      className="block bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
    >
      <div className="relative">
        <img
          src={getPublicS3Url(room?.thumbnailKey || "")}
          alt={room?.type}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={() => toggleFavorite(room?.id)}
          className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg"
        >
          <Heart
            size={18}
            className={
              favorites.has(room.id)
                ? "text-red-500 fill-current"
                : "text-gray-600"
            }
          />
        </button>
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-bold text-gray-800">
            {room?.avgRating?.toFixed(2) || (0.0).toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{room.type}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {room?.description}
        </p>

        <div className="flex items-center gap-4 mb-5 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {room?.area}m²
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {room?.beds}
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-5">
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
            {room?.features?.slice(0, 3).join(" • ")}
          </div>
        </div>

        {/* Reviews */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(room?.avgRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span>({room?.reviewCount || 0} reviews)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {formatPriceUSD(room?.price)}
            </div>
            <p className="text-sm text-gray-500">per night</p>
          </div>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;

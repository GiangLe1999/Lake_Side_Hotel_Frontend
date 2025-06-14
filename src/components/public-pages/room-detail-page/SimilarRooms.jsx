import React from "react";
import {
  Star,
  Users,
  MapPin,
  Wifi,
  Car,
  Coffee,
  ArrowRight,
  Heart,
  Camera,
} from "lucide-react";

const SimilarRooms = ({ currentRoom }) => {
  // Mock data - replace with actual similar rooms from your API
  const similarRooms = [
    {
      id: 2,
      type: "Executive Suite",
      price: 199,
      avgRating: 4.8,
      reviewCount: 89,
      area: 55,
      beds: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Balcony", "City View", "Mini Bar"],
      features: ["Premium Bedding", "Work Desk", "Coffee Machine"],
    },
    {
      id: 3,
      type: "Garden View Room",
      price: 149,
      avgRating: 4.6,
      reviewCount: 156,
      area: 40,
      beds: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Garden View", "Air Conditioning", "Safe"],
      features: ["Twin Beds", "Garden Access", "Natural Light"],
    },
    {
      id: 4,
      type: "Premium Ocean Suite",
      price: 299,
      avgRating: 4.9,
      reviewCount: 67,
      area: 75,
      beds: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Ocean View", "Jacuzzi", "Premium Service"],
      features: [
        "King Bed",
        "Private Balcony",
        "Ocean Views",
        "Luxury Bathroom",
      ],
    },
  ];

  const formatPrice = (price) => `$${price}`;

  const handleRoomClick = (roomId) => {
    // Navigate to room detail page
    window.location.href = `/rooms/${roomId}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
            <Camera className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Similar Rooms</h3>
        </div>
        <button className="text-yellow-600 hover:text-yellow-700 font-medium text-sm flex items-center gap-1 transition-colors">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {similarRooms.map((room) => (
          <div
            key={room.id}
            className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => handleRoomClick(room.id)}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0">
                <img
                  src={room.imageUrl}
                  alt={room.type}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle wishlist toggle
                  }}
                >
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors">
                      {room.type}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{room.area}m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {room.beds} {room.beds === 1 ? "bed" : "beds"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatPrice(room.price)}
                    </div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-800">
                    {room.avgRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({room.reviewCount} reviews)
                  </span>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{room.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {room.features.slice(0, 2).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoomClick(room.id);
                    }}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compare Current Room CTA */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              Need help choosing?
            </h4>
            <p className="text-sm text-gray-600">
              Compare features and amenities side by side
            </p>
          </div>
          <button className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 font-medium rounded-lg hover:bg-yellow-50 transition-colors">
            Compare Rooms
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimilarRooms;

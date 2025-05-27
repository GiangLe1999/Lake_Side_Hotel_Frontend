import {
  Heart,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  MapPin,
  Users,
} from "lucide-react";
import React, { useState } from "react";

// Sample data
const featuredRooms = [
  {
    id: 1,
    name: "Deluxe Ocean View",
    price: 2500000,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=350&fit=crop",
    rating: 4.8,
    reviews: 124,
    amenities: ["Free WiFi", "Ocean View", "Private Balcony", "Minibar"],
    size: "45m²",
    beds: "1 King Bed",
    description: "Luxury room with stunning ocean views and modern amenities",
    features: ["24/7 Room Service", "Premium Bedding", "Smart TV"],
  },
  {
    id: 2,
    name: "Premium Suite",
    price: 4200000,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&h=350&fit=crop",
    rating: 4.9,
    reviews: 89,
    amenities: [
      "Free WiFi",
      "Private Jacuzzi",
      "Living Area",
      "Butler Service",
    ],
    size: "85m²",
    beds: "1 King Bed + Sofa Bed",
    description:
      "Spacious suite with luxury amenities and personalized service",
    features: ["Private Check-in", "Complimentary Breakfast", "City View"],
  },
  {
    id: 3,
    name: "Family Garden Suite",
    price: 3200000,
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&h=350&fit=crop",
    rating: 4.7,
    reviews: 156,
    amenities: ["Free WiFi", "Garden View", "2 Bedrooms", "Kitchenette"],
    size: "65m²",
    beds: "2 Queen Beds",
    description:
      "Perfect for families with separate bedrooms and garden access",
    features: ["Kids Play Area", "Family Activities", "Garden Access"],
  },
];

const FeaturedRooms = () => {
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
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-indigo-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dbeafe" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div> */}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Premium Selection
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent pb-6">
            Featured Rooms & Suites
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our handpicked collection of luxury accommodations designed
            for unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featuredRooms.map((room) => (
            <div key={room.id} className="group">
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden relative">
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-64 object-cover transition-transform duration-700"
                  />

                  <button
                    onClick={() => toggleFavorite(room.id)}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg"
                  >
                    <Heart
                      size={18}
                      className={
                        favoriteRooms.has(room.id)
                          ? "text-red-500 fill-current"
                          : "text-gray-600"
                      }
                    />
                  </button>

                  {/* Room Type Badge */}
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Premium
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-gray-800">
                      {room.rating}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  {/* Room Details */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {room.size}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {room.beds}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {room.amenities
                        .slice(0, 3)
                        .map((amenity, amenityIndex) => (
                          <span
                            key={amenityIndex}
                            className="bg-gradient-to-r from-yellow-50 to-indigo-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium border border-yellow-100"
                          >
                            {amenity}
                          </span>
                        ))}
                    </div>

                    {/* Additional Features */}
                    <div className="text-xs text-gray-500">
                      {room.features.join(" • ")}
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
                    <span>({room.reviews} reviews)</span>
                  </div>

                  {/* Price and Booking */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-600 bg-clip-text text-transparent">
                          ₫{room.price.toLocaleString("vi-VN")}
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
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Free Cancellation
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Best Price Guarantee
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              24/7 Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;

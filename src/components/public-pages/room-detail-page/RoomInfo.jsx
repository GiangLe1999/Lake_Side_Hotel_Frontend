import {
  Bath,
  Bed,
  Car,
  CheckCircle,
  Coffee,
  MapPin,
  Phone,
  Star,
  Tv,
  Users,
  Wifi,
  Wind,
} from "lucide-react";
import React from "react";

const roomData = {
  id: 1,
  type: "Deluxe Ocean View Suite",
  description:
    "Experience luxury living with panoramic ocean views from our premium suite featuring modern amenities and elegant design.",
  price: 299,
  area: 45,
  beds: 2,
  rating: 4.8,
  reviewCount: 124,
  images: [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop",
  ],
  amenities: [
    { icon: Wifi, name: "Free WiFi" },
    { icon: Car, name: "Free Parking" },
    { icon: Coffee, name: "Coffee Maker" },
    { icon: Tv, name: "Smart TV" },
    { icon: Wind, name: "Air Conditioning" },
    { icon: Bath, name: "Private Bathroom" },
    { icon: Bed, name: "King Size Bed" },
    { icon: Phone, name: "Room Service" },
  ],
  features: [
    "Ocean view balcony",
    "Marble bathroom with rainfall shower",
    "Mini refrigerator and minibar",
    "24/7 concierge service",
    "Complimentary breakfast",
    "Daily housekeeping",
  ],
  reviews: [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 days ago",
      comment:
        "Absolutely stunning room with incredible ocean views. The service was exceptional and the amenities were top-notch.",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date: "1 week ago",
      comment:
        "Perfect for our honeymoon! The room was spacious, clean, and the bed was so comfortable. Highly recommend!",
    },
    {
      id: 3,
      name: "Emma Davis",
      rating: 4,
      date: "2 weeks ago",
      comment:
        "Great location and beautiful room. The only minor issue was the wifi speed, but everything else was perfect.",
    },
  ],
};

const RoomInfo = () => {
  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8">
      <div className="mb-6">
        <h1 className="text-6xl font-bold text-gray-800 mt-2 mb-4 tangerine-bold">
          {roomData.type}
        </h1>

        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-bold text-gray-800">{roomData.rating}</span>
            <span className="text-gray-500">
              ({roomData.reviewCount} reviews)
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-lg leading-relaxed">
          {roomData.description}
        </p>
      </div>

      {/* Room Details */}
      <div className="flex items-center gap-6 mb-8 text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>{roomData.area}m²</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span>{roomData.beds} beds</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-5 h-5" />
          <span>Private bathroom</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {roomData.amenities.map((amenity, index) => {
            const IconComponent = amenity.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100"
              >
                <IconComponent className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">
                  {amenity.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Room Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roomData.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;

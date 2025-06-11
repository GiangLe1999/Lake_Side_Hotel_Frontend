import {
  Bath,
  Bed,
  Car,
  CheckCircle,
  Coffee,
  Fence,
  HandPlatter,
  HousePlus,
  List,
  MapPin,
  Phone,
  ShowerHead,
  Star,
  Tv,
  Users,
  Utensils,
  Wifi,
  Wind,
} from "lucide-react";
import React from "react";

const iconMap = {
  bath: Bath,
  bed: Bed,
  car: Car,
  coffee: Coffee,
  location: MapPin,
  phone: Phone,
  star: Star,
  tv: Tv,
  users: Users,
  wifi: Wifi,
  wind: Wind,
  default: HousePlus,
  balcony: Fence,
  shower: ShowerHead,
  service: HandPlatter,
  jacuzzi: Bath,
  breakfast: Utensils,
};

const RoomInfo = ({ room }) => {
  return (
    <div className="bg-white rounded-3xl shadow border-t border-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-gray-800 mt-2 mb-4 tangerine-bold">
          {room?.type}
        </h1>

        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-bold text-gray-800">
              {room?.avgRating?.toFixed(2)}
            </span>
            <span className="text-gray-500">({room?.reviewCount} reviews)</span>
          </div>
        </div>

        <p
          style={{ whiteSpace: "pre-line" }}
          className="text-gray-600 text-lg leading-relaxed"
        >
          {room?.description}
        </p>
      </div>

      {/* Room Details */}
      <div className="flex items-center gap-6 mb-14 border-t border-gray-100 pt-8 text-yellow-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>{room?.area}m²</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span>{room?.beds} beds</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
            <Bath className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Amenities</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {room?.amenities?.map((amenity, index) => {
            let IconComponent;

            for (const key of Object.keys(iconMap)) {
              if (amenity.toLowerCase().includes(key)) {
                IconComponent = iconMap[key];
                break; // ✅ Thoát vòng lặp
              } else {
                IconComponent = iconMap.default;
              }
            }

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100"
              >
                <IconComponent className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">
                  {amenity}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
            <List className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Room Features</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {room?.features?.map((feature, index) => (
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

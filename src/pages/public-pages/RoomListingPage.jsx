import React, { useState } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  MapPin,
  Users,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Utensils,
  Dumbbell,
  Waves,
  X,
  DollarSign,
  Home,
  Crown,
  Building,
} from "lucide-react";
import RoomCard from "../../components/common/RoomCard";

const RoomsListingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price_asc");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    roomType: [],
    amenities: [],
    rating: 0,
    bedrooms: 0,
    area: [0, 200],
  });

  // Mock data - replace with your API call
  const mockRooms = [
    {
      id: 1,
      type: "Luxury Presidential Suite",
      description:
        "Experience ultimate luxury in our flagship presidential suite with panoramic city views",
      price: 899,
      rating: 4.9,
      reviews: 156,
      area: 120,
      beds: 2,
      thumbnailKey:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400",
      amenities: ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar"],
      category: "luxury",
    },
    {
      id: 2,
      type: "Ocean View Deluxe Room",
      description:
        "Wake up to breathtaking ocean views in this elegantly appointed deluxe room",
      price: 299,
      rating: 4.7,
      reviews: 89,
      area: 45,
      beds: 1,
      thumbnailKey:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
      amenities: ["WiFi", "Ocean View", "Balcony", "Mini Bar"],
      category: "deluxe",
    },
    {
      id: 3,
      type: "Family Garden Suite",
      description:
        "Perfect for families with spacious layout and direct garden access",
      price: 459,
      rating: 4.8,
      reviews: 203,
      area: 80,
      beds: 3,
      thumbnailKey:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      amenities: ["WiFi", "Garden View", "Kitchen", "Play Area"],
      category: "family",
    },
    {
      id: 4,
      type: "Business Executive Room",
      description:
        "Ideal for business travelers with modern amenities and workspace",
      price: 199,
      rating: 4.6,
      reviews: 124,
      area: 35,
      beds: 1,
      thumbnailKey:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
      amenities: ["WiFi", "Workspace", "Meeting Room Access", "Coffee Machine"],
      category: "business",
    },
    {
      id: 5,
      type: "Romantic Honeymoon Suite",
      description: "Intimate and romantic suite perfect for special occasions",
      price: 649,
      rating: 4.9,
      reviews: 78,
      area: 65,
      beds: 1,
      thumbnailKey:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
      amenities: ["WiFi", "Jacuzzi", "Champagne", "Rose Petals", "Spa Access"],
      category: "luxury",
    },
    {
      id: 6,
      type: "Standard Comfort Room",
      description:
        "Comfortable and affordable accommodation with all essential amenities",
      price: 129,
      rating: 4.4,
      reviews: 267,
      area: 28,
      beds: 1,
      thumbnailKey:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
      amenities: ["WiFi", "Air Conditioning", "TV", "Mini Fridge"],
      category: "standard",
    },
  ];

  const roomTypes = ["luxury", "deluxe", "family", "business", "standard"];
  const amenitiesList = [
    "WiFi",
    "Pool",
    "Gym",
    "Spa",
    "Restaurant",
    "Bar",
    "Ocean View",
    "Balcony",
    "Kitchen",
    "Workspace",
  ];

  const FilterPanel = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        {showFilters && (
          <button
            onClick={() => setShowFilters(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Price Range
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters({
                ...filters,
                priceRange: [filters.priceRange[0], parseInt(e.target.value)],
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Room Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Room Type
        </label>
        <div className="space-y-2">
          {roomTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.roomType.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({
                      ...filters,
                      roomType: [...filters.roomType, type],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      roomType: filters.roomType.filter((t) => t !== type),
                    });
                  }
                }}
                className="rounded border-gray-300 mr-2"
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Amenities
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {amenitiesList.map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({
                      ...filters,
                      amenities: [...filters.amenities, amenity],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      amenities: filters.amenities.filter((a) => a !== amenity),
                    });
                  }
                }}
                className="rounded border-gray-300 mr-2"
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Minimum Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilters({ ...filters, rating })}
              className={`p-1 ${
                filters.rating >= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <Star className="w-5 h-5 fill-current" />
            </button>
          ))}
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
        Apply Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 tangerine-bold">
                Discover Our Rooms
              </h1>
              <p className="text-gray-600 mt-1">
                Find the perfect accommodation for your stay
              </p>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 w-full sm:w-80"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Rating: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>

                <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 ${
                      viewMode === "grid"
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 ${
                      viewMode === "list"
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block fixed lg:static inset-0 z-50 lg:z-auto bg-black/50 lg:bg-transparent lg:w-80 lg:shrink-0`}
          >
            <div className="lg:sticky lg:top-8 bg-white lg:bg-transparent h-full lg:h-auto overflow-y-auto lg:overflow-visible p-4 lg:p-0">
              <FilterPanel />
            </div>
          </div>

          {/* Rooms Grid/List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">{mockRooms.length}</span> rooms
              </p>
            </div>

            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  : "space-y-6"
              }`}
            >
              {mockRooms.map((room) => (
                <RoomCard key={room.id} room={room} view={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-yellow-500 text-white"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsListingPage;

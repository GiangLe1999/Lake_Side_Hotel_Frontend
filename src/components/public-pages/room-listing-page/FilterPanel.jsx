import { Star, X } from "lucide-react";
import formatPriceUSD from "../../../utils/format-price";
import { useNavigate } from "react-router-dom";

const FilterPanel = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  roomFilterCriteria,
  getRoomFilterCriteriaLoading,
}) => {
  const navigate = useNavigate();

  // Handle filter changes
  const handleFilterChange = (filterType, value, checked = true) => {
    let newFilters = { ...filters };

    switch (filterType) {
      case "priceRange":
        newFilters.priceRange = value;
        break;
      case "area":
        newFilters.area = value;
        break;
      case "rating":
        newFilters.rating = value;
        break;
      case "roomType":
        if (checked) {
          newFilters.roomType = value;
        }
        break;
      case "amenities":
        if (checked) {
          newFilters.amenities = [...filters.amenities, value];
        } else {
          newFilters.amenities = filters.amenities.filter((a) => a !== value);
        }
        break;
      case "features":
        if (checked) {
          newFilters.features = [...filters.features, value];
        } else {
          newFilters.features = filters.features.filter((f) => f !== value);
        }
        break;
      case "occupancy":
        if (checked) {
          newFilters.occupancy = value;
        }
        break;
      case "bed":
        if (checked) {
          newFilters.bed = value;
        }
        break;
      default:
        break;
    }

    setFilters(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    navigate("/room-listing?pageSize=6&sortBy=price");
  };

  const roomOccupancyTypes = roomFilterCriteria?.occupancyTypes.map((o) =>
    o.toString()
  );

  const currentValue = filters.priceRange[1];
  const minValue = roomFilterCriteria?.minPrice;
  const maxValue = roomFilterCriteria?.maxPrice;
  const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Filters</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear All
          </button>
          {showFilters && (
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Price Range
        </label>
        <div className="space-y-3">
          {/* Container cho slider với value hiển thị */}
          <div className="relative">
            {/* Hiển thị giá trị hiện tại theo vị trí thumb */}
            <div
              className="absolute -top-10 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-150 ease-out z-10"
              style={{ left: `${percentage}%` }}
            >
              {formatPriceUSD(currentValue)}
              {/* Mũi tên nhỏ */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-orange-600"></div>
            </div>

            <input
              type="range"
              min={minValue}
              max={maxValue}
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  priceRange: [minValue, parseFloat(e.target.value)],
                })
              }
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none"
              style={{
                background: `linear-gradient(to right, #f97316 0%, #f97316 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
              }}
            />
          </div>

          {/* Hiển thị range hiện tại */}
          <div className="text-center text-sm text-gray-600 mt-2">
            Selected: {formatPriceUSD(filters.priceRange[0])} -{" "}
            {formatPriceUSD(filters.priceRange[1])}
          </div>
        </div>
      </div>

      {/* Room Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Room Type
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {roomFilterCriteria?.roomTypes?.map((type) => (
            <label key={type} className="flex items-center">
              <input
                name="roomType"
                type="radio"
                checked={filters.roomType === type}
                onChange={(e) =>
                  handleFilterChange("roomType", type, e.target.checked)
                }
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
          {roomFilterCriteria?.amenities?.map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={(e) =>
                  handleFilterChange("amenities", amenity, e.target.checked)
                }
                className="rounded border-gray-300 mr-2"
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Features
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {roomFilterCriteria?.features?.map((feature) => (
            <label key={feature} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.features.includes(feature)}
                onChange={(e) =>
                  handleFilterChange("features", feature, e.target.checked)
                }
                className="rounded border-gray-300 mr-2"
              />
              <span className="text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Occupancy Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Occupancy Type
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {roomOccupancyTypes?.map((type) => (
            <label key={type} className="flex items-center">
              <input
                name="occupancy"
                type="radio"
                checked={filters.occupancy === type}
                onChange={(e) =>
                  handleFilterChange("occupancy", type, e.target.checked)
                }
                className="rounded border-gray-300 mr-2"
              />
              <span className="text-sm">
                {type} {parseInt(type) > 1 ? "people" : "person"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bed Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Bed Type
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {roomFilterCriteria?.roomBeds
            ?.slice()
            .sort()
            .map((type) => (
              <label key={type} className="flex items-center">
                <input
                  name="bed"
                  type="radio"
                  checked={filters.bed === type}
                  onChange={(e) =>
                    handleFilterChange("bed", type, e.target.checked)
                  }
                  className="rounded border-gray-300 mr-2"
                />
                <span className="text-sm">{type}</span>
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
              onClick={() => handleFilterChange("rating", rating)}
              className={`p-1 ${
                filters.rating >= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <Star className="w-5 h-5 fill-current" />
            </button>
          ))}
          {filters.rating > 0 && (
            <button
              onClick={() => handleFilterChange("rating", 0)}
              className="ml-2 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

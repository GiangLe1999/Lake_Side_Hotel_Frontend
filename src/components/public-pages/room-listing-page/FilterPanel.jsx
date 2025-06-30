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
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{formatPriceUSD(roomFilterCriteria?.minPrice)}</span>
            <span>{formatPriceUSD(roomFilterCriteria?.maxPrice)}</span>
          </div>
          <input
            type="range"
            min={roomFilterCriteria?.minPrice}
            max={roomFilterCriteria?.maxPrice}
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters({
                ...filters,
                priceRange: [
                  roomFilterCriteria?.minPrice,
                  parseFloat(e.target.value),
                ],
              })
            }
            className="w-full h-2 !bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
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

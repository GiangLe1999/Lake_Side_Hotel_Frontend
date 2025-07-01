import React, { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import RoomCard from "../../components/common/RoomCard";
import FilterPanel from "../../components/public-pages/room-listing-page/FilterPanel";
import { useQuery } from "@tanstack/react-query";
import {
  getRoomFilterCriteria,
  getRoomWithAdvancedSearch,
} from "../../service/room-service";
import Pagination from "../../components/common/pagination/Pagination";

const RoomsListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State derived from URL parameters
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "price");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("pageNo")) || 0
  );
  const pageSize = 6;
  const [showFilters, setShowFilters] = useState(false);

  // Get room filter criteria
  const { data: roomFilterCriteria, isLoading: getRoomFilterCriteriaLoading } =
    useQuery({
      queryKey: ["roomFilterCriteria"],
      queryFn: getRoomFilterCriteria,
    });

  // Parse URL parameters to get filter values
  const parseFiltersFromURL = useCallback(() => {
    const amenities = searchParams.get("amenities")?.split("_") || [];
    const features = searchParams.get("features")?.split("_") || [];
    const occupancy = searchParams.get("occupancy") || "";
    const bed = searchParams.get("bed") || "";
    const roomType = searchParams.get("roomType") || "";
    const minPrice =
      parseFloat(searchParams.get("minPrice")) || roomFilterCriteria?.minPrice;
    const price =
      parseFloat(searchParams.get("price")) || roomFilterCriteria?.maxPrice;
    const rating = parseInt(searchParams.get("rating")) || 0;

    return {
      priceRange: [minPrice, price],
      roomType,
      amenities,
      features,
      occupancy,
      rating,
      bed,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState(parseFiltersFromURL);

  // Build search parameters for API call
  const buildSearchParams = useCallback(() => {
    const params = {};

    // Add search term if exists
    if (searchTerm.trim()) {
      params.name = `:${searchTerm}`;
    }

    // Add filters
    if (filters.amenities.length > 0) {
      params.amenities = `~${filters.amenities.join("_")}`;
    }

    if (filters.features.length > 0) {
      params.features = `~${filters.features.join("_")}`;
    }

    if (filters.occupancy.trim()) {
      params.occupancy = `:${filters.occupancy}`;
    }

    if (filters.bed.trim()) {
      params.beds = `:${filters.bed}`;
    }

    if (filters.roomType.trim()) {
      params.type = `:${filters.roomType}`;
    }

    if (filters.priceRange[1] < 1000) {
      params.price = `<${filters.priceRange[1]}`;
    }

    if (filters.rating > 0) {
      params.avgRating = `>${filters.rating}`;
    }

    return params;
  }, [searchTerm, filters]);

  // API call for rooms with advanced search
  const {
    data: roomsData,
    isLoading: roomsLoading,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms", currentPage, pageSize, sortBy, buildSearchParams()],
    queryFn: () =>
      getRoomWithAdvancedSearch({
        pageNo: currentPage,
        pageSize,
        sortBy,
        search: buildSearchParams(),
      }),
    keepPreviousData: true,
  });

  console.log(sortBy);

  // Update URL when filters, search, or pagination changes
  const updateURL = useCallback(() => {
    const newParams = new URLSearchParams();

    // Add pagination
    if (currentPage > 0) newParams.set("pageNo", currentPage.toString());

    // Add sort
    if (sortBy) newParams.set("sortBy", sortBy);

    // Add search
    if (searchTerm.trim()) newParams.set("search", searchTerm);

    // Add filters
    if (filters.amenities.length > 0) {
      newParams.set("amenities", filters.amenities.join("_"));
    }

    if (filters.features.length > 0) {
      newParams.set("features", filters.features.join("_"));
    }

    if (filters.occupancy.trim()) {
      newParams.set("occupancy", filters.occupancy);
    }

    if (filters.bed.trim()) {
      newParams.set("bed", filters.bed);
    }

    if (filters.roomType.trim()) {
      newParams.set("roomType", filters.roomType);
    }

    if (filters.priceRange[1] > 0) {
      newParams.set("price", filters.priceRange[1].toString());
    }

    if (filters.rating > 0) {
      newParams.set("rating", filters.rating.toString());
    }

    setSearchParams(newParams);
  }, [currentPage, pageSize, sortBy, searchTerm, filters, setSearchParams]);

  // Update URL when state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL();
      refetchRooms();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [updateURL]);

  // Sync state with URL changes (for browser back/forward)
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSortBy(searchParams.get("sortBy") || "price");
    setCurrentPage(parseInt(searchParams.get("pageNo")) || 0);
    setFilters(parseFiltersFromURL());
  }, [searchParams, parseFiltersFromURL]);

  // Handle search input

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(0);
    }, 500); // delay 500ms

    return () => clearTimeout(timer);
  }, [searchInput]);

  const onInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(0); // Reset to first page
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page
  };

  // Get rooms and pagination info
  const rooms = roomsData?.data?.items || [];
  const totalPages = roomsData?.data?.totalPages || 1;
  const totalElements = roomsData?.data?.totalItems || 0;

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
                  value={searchInput}
                  onChange={onInputChange}
                  className="main-input !pl-10 pr-4 py-3 w-full sm:w-80"
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
                  onChange={handleSortChange}
                  className="px-4 py-3 main-input"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-avgRating">Rating: High to Low</option>
                  <option value="type">Name: A to Z</option>
                  <option value="-type">Name: Z to A</option>
                </select>

                <div className="grid grid-cols-2 border border-gray-300 rounded-xl overflow-hidden w-[140px]">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`w-full grid place-items-center ${
                      viewMode === "grid"
                        ? "main-btn !rounded-r-none"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`w-full grid place-items-center ${
                      viewMode === "list"
                        ? "main-btn !rounded-l-none"
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
              <FilterPanel
                filters={filters}
                getRoomFilterCriteriaLoading={getRoomFilterCriteriaLoading}
                setFilters={handleFiltersChange}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                roomFilterCriteria={roomFilterCriteria}
              />
            </div>
          </div>

          {/* Rooms Grid/List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{totalElements}</span>{" "}
                rooms
                {roomsLoading && (
                  <span className="ml-2 text-sm text-gray-400">
                    (Loading...)
                  </span>
                )}
              </p>
            </div>

            {roomsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                    : "space-y-6"
                }`}
              >
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} view={viewMode} />
                ))}
              </div>
            )}

            <div className="mt-8">
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  pageCount={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  className="user-ui-pagination"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsListingPage;

import React, { useState, useEffect, useMemo } from "react";
import {
  Heart,
  Grid3X3,
  List,
  Search,
  Trash2,
  HeartOff,
  Filter,
} from "lucide-react";
import RoomCard from "../../components/common/RoomCard";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/common/pagination/Pagination";
import { getRoomsForFavoritesPage } from "../../service/room-service";
import useFavoriteStore from "../../hooks/useFavoriteStore";
import { useNavigate } from "react-router-dom";

const FavoritePage = () => {
  const {
    favorites,
    getFavoritesList,
    getFavoriteCount,
    clearAllFavorites,
    removeFavorite,
  } = useFavoriteStore();

  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const navigate = useNavigate();
  const pageSize = 6;

  // Get favorite room IDs
  const favoriteRoomIds = useMemo(() => getFavoritesList(), [favorites]);

  // Fetch favorite rooms (get all rooms, no server-side pagination)
  const {
    data: favoriteRoomsData,
    isLoading: favoriteRoomsLoading,
    refetch: refetchFavoriteRooms,
  } = useQuery({
    queryKey: ["favoriteRooms", favoriteRoomIds],
    queryFn: () => getRoomsForFavoritesPage(favoriteRoomIds),
    enabled: favoriteRoomIds.length > 0,
    keepPreviousData: true,
  });

  // Filter rooms based on search term
  const filteredRooms = useMemo(() => {
    if (!favoriteRoomsData) return [];

    if (!searchTerm.trim()) {
      return favoriteRoomsData;
    }

    return favoriteRoomsData.filter(
      (room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [favoriteRoomsData, searchTerm]);

  // Handle pagination on filtered results
  const paginatedRooms = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRooms.slice(startIndex, endIndex);
  }, [filteredRooms, currentPage, pageSize]);

  // Calculate total pages based on filtered results
  const totalPages = Math.ceil(filteredRooms.length / pageSize);

  // Handle clear all favorites
  const handleClearAllFavorites = () => {
    clearAllFavorites();
    setShowConfirmClear(false);
    setCurrentPage(0);
  };

  // Handle remove single favorite
  const handleRemoveFavorite = (roomId) => {
    removeFavorite(roomId);
    refetchFavoriteRooms();
  };

  // Reset page when favorites change or search changes
  useEffect(() => {
    if (favoriteRoomIds.length === 0) {
      setCurrentPage(0);
    }
  }, [favoriteRoomIds.length]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const favoriteCount = getFavoriteCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Heart className="w-7 h-7 -mt-1 text-rose-500 fill-rose-500" />
                <h1 className="text-3xl font-bold text-gray-800 tangerine-bold">
                  My Favorite Rooms
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                {favoriteCount > 0
                  ? `You have ${favoriteCount} favorite room${
                      favoriteCount > 1 ? "s" : ""
                    }`
                  : "You haven't added any favorite rooms yet"}
              </p>
            </div>

            {/* Search and Controls */}
            {favoriteCount > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search favorite rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="main-input !pl-10 pr-4 py-3 w-full sm:w-80"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="grid grid-cols-2 border border-gray-300 rounded-xl overflow-hidden w-[100px]">
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

                  <button
                    onClick={() => setShowConfirmClear(true)}
                    className="flex items-center gap-2 px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {favoriteCount === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <HeartOff className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No Favorite Rooms Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our amazing rooms and add your favorites by
              clicking the heart icon. Your favorite rooms will appear here for
              easy access.
            </p>
            <button
              onClick={() => navigate("/room-listing")}
              className="main-btn px-8 py-3 mx-auto"
            >
              Explore Rooms
            </button>
          </div>
        ) : (
          <div>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold">{paginatedRooms.length}</span>{" "}
                of <span className="font-semibold">{filteredRooms.length}</span>{" "}
                favorite rooms
                {favoriteRoomsLoading && (
                  <span className="ml-2 text-sm text-gray-400">
                    (Loading...)
                  </span>
                )}
              </p>
            </div>

            {favoriteRoomsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No rooms found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or clear the search to see all
                  favorites.
                </p>
              </div>
            ) : (
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                    : "space-y-6"
                }`}
              >
                {paginatedRooms.map((room) => (
                  <div key={room.id} className="relative">
                    <RoomCard room={room} view={viewMode} />
                    {/* Remove from favorites button */}
                    <button
                      onClick={() => handleRemoveFavorite(room.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white shadow-lg rounded-full transition-colors z-10"
                      title="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  pageCount={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  className="user-ui-pagination"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Clear All Dialog */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Clear All Favorites?
                </h3>
                <p className="text-gray-600 text-sm">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all {favoriteCount} rooms from
              your favorites?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllFavorites}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;

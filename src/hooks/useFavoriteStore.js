import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Zustand store cho quản lý favorite
const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: new Set(),

      // Favorite actions
      addFavorite: (roomId) => {
        set((state) => ({
          favorites: new Set([...state.favorites, roomId]),
        }));
      },

      removeFavorite: (roomId) => {
        set((state) => {
          const newFavorites = new Set(state.favorites);
          newFavorites.delete(roomId);
          return { favorites: newFavorites };
        });
      },

      toggleFavorite: (roomId) => {
        const { favorites } = get();
        if (favorites.has(roomId)) {
          get().removeFavorite(roomId);
          return false;
        } else {
          get().addFavorite(roomId);
          return true;
        }
      },

      isFavorite: (roomId) => {
        const { favorites } = get();
        return favorites.has(roomId);
      },

      getFavoriteCount: () => {
        const { favorites } = get();
        return favorites.size;
      },

      clearAllFavorites: () => {
        set({ favorites: new Set() });
      },

      getFavoritesList: () => {
        const { favorites } = get();
        return Array.from(favorites);
      },
    }),
    {
      name: "room-favorites-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: Array.from(state.favorites), // Convert Set to Array for serialization
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.favorites)) {
          state.favorites = new Set(state.favorites); // Convert back to Set
        }
      },
    }
  )
);

export default useFavoriteStore;

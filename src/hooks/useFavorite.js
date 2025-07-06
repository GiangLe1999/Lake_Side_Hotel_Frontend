import { useState } from "react";
import useFavoriteStore from "./useFavoriteStore";
import { toast } from "react-toastify";

// Custom hook for favorite functionality
const useFavorite = (room) => {
  const [favoriteAnimation, setFavoriteAnimation] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wasFavorite = isFavorite(room?.id);
    toggleFavorite(room?.id);

    setFavoriteAnimation(true);
    setTimeout(() => setFavoriteAnimation(false), 300);

    // Optional: Show toast notification
    if (wasFavorite) {
      toast.info(`Removed "${room?.name}" from favorites`);
    } else {
      toast.success(`Added "${room?.name}" to favorites`);
    }
  };

  return {
    isFavorite: isFavorite(room?.id),
    toggleFavorite: handleToggleFavorite,
    favoriteAnimation,
  };
};

export default useFavorite;

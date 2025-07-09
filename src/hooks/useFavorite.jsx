import { useState } from "react";
import useFavoriteStore from "./useFavoriteStore";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// Custom hook for favorite functionality
const useFavorite = (room) => {
  const [favoriteAnimation, setFavoriteAnimation] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const navigate = useNavigate();

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
      toast.success(
        <p>
          Added "{room?.name}" to favorites.{" "}
          <span
            onClick={() => {
              navigate("/favorites");
              toast.dismiss(); // Đóng toast sau khi navigate
            }}
            className="underline cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Check now
          </span>
        </p>
      );
    }
  };

  return {
    isFavorite: isFavorite(room?.id),
    toggleFavorite: handleToggleFavorite,
    favoriteAnimation,
  };
};

export default useFavorite;

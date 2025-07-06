import { Heart } from "lucide-react";
import useFavorite from "../../hooks/useFavorite";

const FavoriteBtn = ({ className = "", size = 16, room }) => {
  const { isFavorite, toggleFavorite, favoriteAnimation } = useFavorite(room);

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg ${className} ${
        favoriteAnimation ? "scale-120" : ""
      }`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        className={
          isFavorite
            ? "text-red-500 fill-current"
            : "text-gray-600 hover:text-red-500 transition-colors"
        }
      />
    </button>
  );
};

export default FavoriteBtn;

import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../../../service/room-service";
import RoomCard from "../../common/RoomCard";
import RoomCardSkeleton from "../../common/RoomCardSkeleton";

const FeaturedRooms = () => {
  const { data: rooms, isLoading: getRoomsLoading } = useQuery({
    queryKey: ["get-featured-rooms"],
    queryFn: () => getRooms(0, 3),
    select: (res) => res.data.data.items,
  });

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-white to-indigo-50 relative">
      {/* Background Pattern */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Premium Selection
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent pb-6">
            Featured Rooms & Suites
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our handpicked collection of luxury accommodations designed
            for unforgettable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {getRoomsLoading
            ? [...Array(3)].map((_, i) => <RoomCardSkeleton key={i} />)
            : rooms?.map((room) => <RoomCard room={room} key={room.id} />)}
        </div>

        {/* Bottom Stats */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              Free Cancellation
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Best Price Guarantee
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              24/7 Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;

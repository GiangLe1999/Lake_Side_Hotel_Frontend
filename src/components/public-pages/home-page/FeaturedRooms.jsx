import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRoomsForHomepage } from "../../../service/room-service";
import RoomCard from "../../common/RoomCard";
import RoomCardSkeleton from "../../common/RoomCardSkeleton";
import { Link } from "react-router-dom";

const FeaturedRooms = () => {
  const { data: rooms, isLoading: getRoomsLoading } = useQuery({
    queryKey: ["get-rooms-for-homepage"],
    queryFn: getRoomsForHomepage,
  });

  return (
    <section className="py-24 relative">
      {/* Background Pattern */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Premium Selection
          </div>
          <h2 className="heading-2 tangerine-bold">Featured Rooms & Suites</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Discover our handpicked collection of luxury accommodations designed
            for unforgettable experiences
          </p>

          <Link to="room-listing">
            <span className="underline underline-offset-2 text-yellow-600 font-bold hover:text-yellow-500 text-sm transition">
              View All Rooms
            </span>
          </Link>
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

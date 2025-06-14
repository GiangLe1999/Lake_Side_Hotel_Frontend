import React from "react";
import RoomImageGallery from "../../components/public-pages/room-detail-page/RoomImageGallery";
import RoomInfo from "../../components/public-pages/room-detail-page/RoomInfo";
import SubHeader from "../../components/public-pages/room-detail-page/SubHeader";
import BookingCard from "../../components/public-pages/room-detail-page/BookingCard";
import { useQuery } from "@tanstack/react-query";
import { getRoom } from "../../service/room-service";
import { useParams } from "react-router-dom";
import Reviews from "../../components/public-pages/room-detail-page/Reviews";
import RoomPolicies from "../../components/public-pages/room-detail-page/RoomPolicies";
import RoomFAQs from "../../components/public-pages/room-detail-page/RoomFAQs";
import SimilarRooms from "../../components/public-pages/room-detail-page/SimilarRooms";

const RoomDetailPage = () => {
  const { id } = useParams();

  const { data: room, isLoading: getRoomLoading } = useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoom(id),
    select: (res) => res.data.data,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-indigo-50">
      <SubHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RoomImageGallery room={room} />
            <RoomInfo room={room} />
            <RoomPolicies />
            <RoomFAQs />
            <Reviews room={room} />
            <SimilarRooms currentRoom={room} />
          </div>

          <div className="lg:col-span-1">
            <BookingCard roomData={room} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;

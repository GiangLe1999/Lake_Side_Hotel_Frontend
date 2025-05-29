import React from "react";
import RoomImageGallery from "../../components/public-pages/room-detail-page/RoomImageGallery";
import RoomInfo from "../../components/public-pages/room-detail-page/RoomInfo";
import SubHeader from "../../components/public-pages/room-detail-page/SubHeader";
import BookingCard from "../../components/public-pages/room-detail-page/BookingCard";
import Reviews from "../../components/public-pages/room-detail-page/Reviews";

const RoomDetailPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-indigo-50">
      <SubHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RoomImageGallery />

            <RoomInfo />

            <Reviews />
          </div>

          <div className="lg:col-span-1">
            <BookingCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;

import { Bed } from "lucide-react";
import React, { useState } from "react";
import { getRoomTypes } from "../../service/room-service";
import { useQuery } from "@tanstack/react-query";

const recentBookings = [
  {
    id: "001",
    guest: "John Doe",
    room: "Deluxe Suite",
    checkin: "2025-05-24",
    status: "Confirmed",
  },
  {
    id: "002",
    guest: "Jane Smith",
    room: "Standard Room",
    checkin: "2025-05-25",
    status: "Pending",
  },
  {
    id: "003",
    guest: "Mike Johnson",
    room: "Presidential Suite",
    checkin: "2025-05-26",
    status: "Confirmed",
  },
];

const RoomsTable = () => {
  const [filteredRoomType, setFilteredRoomType] = useState("");

  const { data: roomTypes, isLoading: getRoomTypesLoading } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
    select: (res) => res.data.data, // chỉ lấy phần data từ response
  });

  return (
    <>
      <div className="text-center py-12 text-gray-500 border-b border-gray-100">
        <Bed className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg mb-2 font-semibold">Room Management System</p>
        <p className="text-sm">View, edit, and manage all your hotel rooms</p>

        <div className="mt-6 flex items-center justify-center max-w-[400px] mx-auto">
          <label className="text-sm font-medium w-fit h-10 bg-blue-600 text-white rounded-l-md grid place-items-center px-3">
            Filter by :
          </label>
          <select
            onChange={(e) => {
              const value = e.target.value;
              setFilteredRoomType(value);
            }}
            className="flex-1 w-full px-3 py-2 border rounded-r-md focus:outline-none border-gray-300"
          >
            <option value="">Choose room type to filter</option>
            {!getRoomTypesLoading &&
              roomTypes &&
              roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-500">
              <th className="pb-5">Room ID</th>
              <th className="pb-5">Room Type</th>
              <th className="pb-5">Room Price</th>
              <th className="pb-5">Created At</th>
              <th className="pb-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="border-t border-gray-100">
                <td className="py-3 text-sm text-gray-900">#{booking.id}</td>
                <td className="py-3 text-sm text-gray-900">{booking.guest}</td>
                <td className="py-3 text-sm text-gray-600">{booking.room}</td>
                <td className="py-3 text-sm text-gray-600">
                  {booking.checkin}
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RoomsTable;

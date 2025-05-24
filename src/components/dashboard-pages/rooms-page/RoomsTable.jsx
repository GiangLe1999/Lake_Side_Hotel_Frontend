import { Bed } from "lucide-react";
import React, { useState } from "react";
import {
  getRoomFilteredByType,
  getRoomTypes,
} from "../../service/room-service";
import { useQuery } from "@tanstack/react-query";
import formatDate from "../../../utils/format-date";
import formatPriceUSD from "../../../utils/format-price";
import Pagination from "../../common/pagination/Pagination";

const RoomsTable = () => {
  const [filteredRoomType, setFilteredRoomType] = useState("");

  const { data: roomTypes, isLoading: getRoomTypesLoading } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
    select: (res) => res.data.data, // chỉ lấy phần data từ response
  });

  const [pageNo, setPageNo] = useState(0);
  const pageSize = 10;

  const { data: rooms, isLoading: getRoomsLoading } = useQuery({
    queryKey: ["roomsByType", filteredRoomType, pageNo],
    queryFn: () =>
      getRoomFilteredByType({
        pageNo,
        pageSize,
        type: filteredRoomType,
      }),
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
              <th className="pb-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getRoomsLoading
              ? [...Array(5)].map((_, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-100 animate-pulse"
                  >
                    <td className="py-3">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-3 flex items-center justify-center gap-2">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              : rooms?.items?.map((room) => (
                  <tr key={room?.id} className="border-t border-gray-100">
                    <td className="py-3 text-sm text-gray-900">
                      #00{room?.id}
                    </td>
                    <td className="py-3 text-sm text-gray-900">{room?.type}</td>
                    <td className="py-3 text-sm text-gray-600">
                      {formatPriceUSD(room?.price || null)}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {formatDate(room?.createdAt || "", "dd/MM/yyyy")}
                    </td>
                    <td className="py-3 flex gap-2 justify-center text-xs font-semibold">
                      <button
                        // onClick={() => handleEdit(room.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        // onClick={() => handleDelete(room.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        <Pagination
          pageCount={rooms?.totalPages || 1}
          currentPage={pageNo}
          onPageChange={(newPage) => setPageNo(newPage)}
        />
      </div>
    </>
  );
};

export default RoomsTable;
